var express = require('express');
var sys = require('util');
var exec = require('child_process').exec;
var router = express.Router();
var SSH = require('simple-ssh');
var data= require('../model/data');

var coordinateur = require('../private/coordinateur');

/*
etat = 0 -> phase de paramétrage
etat = 1 -> phase de d'inscription
etat = 2 -> phase de fin
*/
var etat = 0;

var regles = {};
var data = require('../model/data');

/*
  cip = ip du coordinateur
  cport = port du coordinateur
*/
function lance_ssh(ip, username, port, pass, producteur, cip, cport){
  var ssh = new SSH({
      host: ip,
      user: username,
      pass: pass
  });

  ssh.exec('git clone https://github.com/nsutter/CryptoSim.js.git', {
      out: function(stdout) {
        console.log(stdout);
      }
  }).start();
  ssh.exec('cd CryptoSim.js', {
      out: function(stdout) {
        console.log(stdout);
      }
  }).start();
  if(producteur == 1){
    ssh.exec('cd producteur', {
        out: function(stdout) {
          console.log(stdout);
        }
    }).start();
  }
  else {
    ssh.exec('cd joueur', {
        out: function(stdout) {
          console.log(stdout);
        }
    }).start();
    }
    ssh.exec('npm install', {
        out: function(stdout) {
          console.log(stdout);
        }
    }).start();
    ssh.exec('PORT=' + port + ' CIP=' + cip + ' CPORT=' + cport + 'npm start &', {
        out: function(stdout) {
          console.log(stdout);
        }
    }).start();
    ssh.end();
}

// Paramétrage des règles et des agents
router.get('/', function(req, res, next) {
  if(etat == 0) // phase de paramètrage - OK
  {
    data.remove({}, function(err,removed) {
    });
    res.render('index', {title: 'Préparation du jeu 1/2 - Paramétrage des règles et des agents'});
  }
  else if(etat == 1) // phase d'inscription
  {
    res.redirect('/inscription');
  }
});

// Enregistrement des règles et des agents
router.post('/regles', function(req, res, next) {

  // on construit ici un objet qui contient l'ensemble du système

  if(req.body.mode == 'Tour par tour'){
    regles.tour = true;
  }
  else {
    regles.tour = false;
  }

  // bool voler
  if(req.body.voler) {
    regles.voler = true;
  }
  else {
    regles.voler = false;
  }

  // bool observer
  if(req.body.observer) {
    regles.observer = true;
  }
  else {
    regles.observer = false;
  }

  // array objectif
  regles.objectif = [];

  // si c'est un Array, on utilise la boucle, si c'est un String, on ajoute directement l'élément (évite qu'on boucle caractère par caractère)
  if(req.body.objectif_nom.constructor === Array)
  {
    for(var i = 0; i < req.body.objectif_nom.length; i++)
    {
      regles.objectif.push({nom: req.body.objectif_nom[i], quantite: parseInt(req.body.objectif_quantite[i])});
    }
  }
  else
  {
    regles.objectif.push({nom: req.body.objectif_nom, quantite: parseInt(req.body.objectif_quantite)});
  }

  // int Nressources
  regles.Nressources = parseInt(req.body.Nressources);

  // object coordinateur
  regles.coordinateur = {ip: req.body.coordinateur_ip, port: parseInt(req.body.coordinateur_port)};

  // array liste des joueurs
  regles.joueurs = []; // sites
  regles.joueursParametres = []; // parametres

  if(req.body.joueur_ip.constructor === Array)
  {
    for(var i = 0; i < req.body.joueur_ip.length; i++)
    {
      regles.joueurs.push({ip: req.body.joueur_ip[i], port: parseInt(req.body.joueur_port[i]), identifiant: req.body.joueur_id[i], pass: req.body.joueur_pass[i], inscription: false});
      regles.joueursParametres.push({strategie: req.body.joueur_strategie[i]});
    }
  }
  else
  {
    regles.joueurs.push({ip: req.body.joueur_ip, port: parseInt(req.body.joueur_port), identifiant: req.body.joueur_id, pass: req.body.joueur_pass, inscription: false});
    regles.joueursParametres.push({strategie: req.body.joueur_strategie});
  }

  // array liste des producteurs
  regles.producteurs = []; // sites
  regles.producteursParametres = []; // parametres

  if(req.body.producteur_ip.constructor === Array)
  {
    for(var i = 0; i < req.body.producteur_ip.length; i++)
    {
      var proportionnel;
      if(req.body.producteur_epuisement && req.body.producteur_epuisement[i])
      {
        proportionnel = true;
      }
      else
      {
        proportionnel = false;
      }

      regles.producteurs.push({ip: req.body.producteur_ip[i], port: parseInt(req.body.producteur_port[i]), identifiant: req.body.producteur_id[i], pass: req.body.producteur_pass[i], inscription: false});
      regles.producteursParametres.push({ressource: req.body.producteur_ressource_produite[i], quantite: parseInt(req.body.producteur_quantite_initiale[i]), quantite_produite: parseInt(req.body.producteur_quantite_produite[i]), proportionnel: proportionnel});
    }
  }
  else
  {
    var proportionnel;
    if(req.body.producteur_epuisement)
    {
      proportionnel = true;
    }
    else
    {
      proportionnel = false;
    }

    regles.producteurs.push({ip: req.body.producteur_ip, port: parseInt(req.body.producteur_port), identifiant: req.body.producteur_id, pass: req.body.producteur_pass, inscription: false});
    regles.producteursParametres.push({ressource: req.body.producteur_ressource_produite, quantite: parseInt(req.body.producteur_quantite_initiale), quantite_produite: parseInt(req.body.producteur_quantite_produite), proportionnel: proportionnel});
  }

  console.log(regles);

  for(var i = 0; i < regles.joueurs.length; i++)
  {
    var client = regles.joueurs[i];
    if(client.ip != 'localhost')
      lance_ssh(client.ip, client.identifiant, client.port, client.pass, 0, regles.coordinateur.ip, regles.coordinateur.port)
    else {
      // lancement local en considérant que le code est déjà installé
      var commande = 'cd ../joueur && npm install && CIP=' + regles.coordinateur.ip + ' CPORT=' + regles.coordinateur.port + ' node bin/www ' + client.ip + ' ' + client.port;
      console.log(commande);
      exec(commande, function(err, stdout, stderr){
        console.log('stdout :' + stdout);
        console.log('stderr :' + stderr);
      });
    }
  }
  for(var i = 0; i < regles.producteurs.length; i++)
  {
    var client = regles.producteurs[i];
    if(client.ip != 'localhost')
      lance_ssh(client.ip, client.identifiant, client.port, client.pass, 1, regles.coordinateur.ip, regles.coordinateur.port)
    else {
      // lancement local en considérant que le code source est déjà téléchargé
      var commande = 'cd ../producteur && npm install && CIP=' + regles.coordinateur.ip + ' CPORT=' + regles.coordinateur.port + ' node bin/www ' + client.ip + ' ' + client.port;
      console.log(commande);
      exec(commande, function(err, stdout, stderr){
        console.log('stdout :' + stdout);
        console.log('stderr :' + stderr);
      });
    }
  }

  etat = 1; // on passe à la phase d'inscription

  res.redirect('/inscription');
});


// Inscription des agents
router.get('/inscription', function(req, res, next) {
  if(etat == 1 || etat == 2) // phase d'inscription - OK
  {
    var nJoueurs = 0, nProducteurs = 0;

    for(var i = 0; i < regles.joueurs.length; i++)
    {
      if(!regles.joueurs[i].inscription)
        nJoueurs++;
    }
    for(var i = 0; i < regles.producteurs.length; i++)
    {
      if(!regles.producteurs[i].inscription)
        nProducteurs++;
    }

    data.find({}).sort({joueur: 1, date: 1}).exec(function (err, data) {
      res.render('inscription', {regles: regles, nJoueurs: nJoueurs, nProducteurs: nProducteurs, data: data});
    });
  }
  else if(etat == 0) // phase de paramétrage
  {
    res.redirect('/');
  }
});

router.get('/producteur/inscription/:ip/:port', function(req, res, next) {

  if(regles.producteursParametres && regles.producteursParametres.length > 0)
  {
    for(var i = 0; i < regles.producteurs.length; i++)
    {
      if(regles.producteurs[i].ip == req.params.ip && regles.producteurs[i].port == req.params.port)
      {
        // on copie les 1ers paramètres en attente
        regles.producteurs[i].ressource = regles.producteursParametres[0].ressource;
        regles.producteurs[i].quantite = regles.producteursParametres[0].quantite;
        regles.producteurs[i].quantite_produite = regles.producteursParametres[0].quantite_produite;

        // on supprime les paramètres copiés
        regles.producteursParametres.splice(0, 1);

        // on valide l'inscription
        regles.producteurs[i].inscription = true;

        // on crée un nouvel objet avec les règles
        var resp = regles.producteurs[i];
        resp.voler = regles.voler;
        resp.observer = regles.observer;
        resp.Nressources = regles.Nressources;

        // on envoie les paramètres
        res.send(resp);

        var nAgents = 0;

        for(var i = 0; i < regles.joueurs.length; i++)
        {
          if(!regles.joueurs[i].inscription)
            nAgents++;
        }
        for(var i = 0; i < regles.producteurs.length; i++)
        {
          if(!regles.producteurs[i].inscription)
            nAgents++;
        }

        if(nAgents == 0) // toutes les inscriptions ont été effectuées
        {
          regles.dateDebut = new Date();
          coordinateur.start(regles);
        }
        return;
      }
    }

    res.send({}); // objet vide = erreur côté joueur
  }
  else // toutes les inscriptions ont été effectués OU les inscriptions n'ont pas commencées
  {
    res.send({}); // objet vide = erreur côté joueur
  }
});

router.get('/joueur/inscription/:ip/:port', function(req, res, next) {
  if(regles.joueursParametres && regles.joueursParametres.length > 0)
  {
    for(var i = 0; i < regles.joueurs.length; i++)
    {
      if(regles.joueurs[i].ip == req.params.ip && regles.joueurs[i].port == req.params.port)
      {
        // on copie les 1ers paramètres en attente
        regles.joueurs[i].strategie = regles.joueursParametres[0].strategie;

        // on supprime les paramètres copiés
        regles.joueursParametres.splice(0, 1);

        // on valide l'inscription
        regles.joueurs[i].inscription = true;

        // on crée un nouvel objet avec les règles
        var resp = regles.joueurs[i];
        resp.voler = regles.voler;
        resp.observer = regles.observer;
        resp.Nressources = regles.Nressources;

        // et les objectifs
        resp.objectif = []
        for(var i = 0; i < regles.objectif.length; i++)
        {
          resp.objectif.push({nom: regles.objectif[i].nom, quantite: 0, quantite_demandee: parseInt(regles.objectif[i].quantite)})
        }

        // on envoie les paramètres
        res.send(resp);

        var nAgents = 0;

        for(var i = 0; i < regles.joueurs.length; i++)
        {
          if(!regles.joueurs[i].inscription)
            nAgents++;
        }
        for(var i = 0; i < regles.producteurs.length; i++)
        {
          if(!regles.producteurs[i].inscription)
            nAgents++;
        }

        if(nAgents == 0) // toutes les inscriptions ont été effectuées
        {
          regles.dateDebut = new Date();
          coordinateur.start(regles);
        }
        return;
      }
    }

    res.send({}); // objet vide = erreur côté joueur
  }
  else // toutes les inscriptions ont été effectués OU les inscriptions n'ont pas commencées
  {
    res.send({}); // objet vide = erreur côté joueur
  }
});

// Arrêt manuel en appuyant sur le bouton "Arrêter la partie" sur le coordinateur
router.get('/stop', function(req, res, next) {
  etat = 2;
  regles.dateFin = new Date(); // on enregistre la date de fin
  coordinateur.end(regles);
  res.end();
  return;
});

router.get('/stop/:ip/:port', function(req, res, next) {
  console.log(req.params.ip + ':' + req.params.port + ' fini');

  // on compte le joueur comme ayant terminé
  for(var i = 0; i < regles.joueurs.length; i++)
  {
    if(regles.joueurs[i].ip == req.params.ip && regles.joueurs[i].port == req.params.port)
    {
      regles.joueurs[i].stop = true;
    }
  }

  // on vérifie si tous les jours ont terminé
  for(var i = 0; i < regles.joueurs.length; i++)
  {
    if(!regles.joueurs[i].stop)
    {
      res.end();
      return; // si c'est pas le cas, on fait rien
    }
  }

  // si c'est le cas, on arrête les agents et on passe à la phase suivante
  etat = 2;
  regles.dateFin = new Date(); // on enregistre la date de fin
  coordinateur.end(regles);
  res.end();
  return;
});

// Remise à zéro de l'état et des règles et retour au paramétrage des règles et des agents
router.get('/annulation', function(req, res, next) {
  regles = {};
  etat = 0;
  res.redirect('/');
});

module.exports = router;
