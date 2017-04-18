var express = require('express');
var router = express.Router();

var coordinateur = require('../private/coordinateur');
/*
etat = 1 -> regles OK
etat = 2 -> regles OK, inscriptions OK
*/
var etat = 0;

var regles = {};

// Paramétrage des règles et des agents
router.get('/', function(req, res, next) {
  if(etat == 0) // phase de paramètrage - OK
  {
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
      regles.objectif.push({nom: req.body.objectif_nom[i], quantite: req.body.objectif_quantite[i]});
    }
  }
  else
  {
    regles.objectif.push({nom: req.body.objectif_nom, quantite: req.body.objectif_quantite});
  }

  // int Nressources
  regles.Nressources = req.body.Nressources;

  // object coordinateur
  regles.coordinateur = {ip: req.body.coordinateur_ip, port: req.body.coordinateur_port};

  // array liste des joueurs (sites)
  regles.joueurs = []; // sites
  regles.joueursParametres = []; // parametres

  if(req.body.joueur_ip.constructor === Array)
  {
    for(var i = 0; i < req.body.joueur_ip.length; i++)
    {
      regles.joueurs.push({ip: req.body.joueur_ip[i], port: req.body.joueur_port[i], inscription: false});
      regles.joueursParametres.push({strategie: req.body.joueur_strategie[i]})
    }
  }
  else
  {
    regles.joueurs.push({ip: req.body.joueur_ip, port: req.body.joueur_port, strategie: req.body.joueur_strategie, inscription: false});
    regles.joueursParametres.push({strategie: req.body.joueur_strategie})
  }

  // array liste des producteurs
  regles.producteurs = []; // sites
  regles.producteursParametres = []; // parametres

  if(req.body.producteur_ip.constructor === Array)
  {
    for(var i = 0; i < req.body.producteur_ip.length; i++)
    {
      regles.producteurs.push({ip: req.body.producteur_ip[i], port: req.body.producteur_port[i], inscription: false});
      regles.producteursParametres.push({ressource: req.body.producteur_ressource_produite[i], quantite: req.body.producteur_quantite_initiale[i], quantite_produite : req.body.producteur_quantite_produite[i]})
    }
  }
  else
  {
    regles.producteurs.push({ip: req.body.producteur_ip, port: req.body.producteur_port, ressource: req.body.producteur_ressource_produite, quantite: req.body.producteur_quantite_initiale, quantite_produite : req.body.producteur_quantite_produite, inscription: false});
    regles.producteursParametres.push({ressource: req.body.producteur_ressource_produite, quantite: req.body.producteur_quantite_initiale, quantite_produite : req.body.producteur_quantite_produite})
  }

  console.log(regles);

  // LANCER LES AGENTS EN SSH ICI

  etat = 1; // on passe à la phase d'inscription

  res.redirect('/inscription');
});


// Inscription des agents
router.get('/inscription', function(req, res, next) {
  if(etat == 1) // phase d'inscription - OK
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
    res.render('inscription', {regles: regles, nJoueurs: nJoueurs, nProducteurs: nProducteurs});
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

        // on envoie les paramètres
        res.send(regles.producteurs[i]);

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

        // on envoie les paramètres
        res.send(regles.joueurs[i]);

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
      }
    }

    res.send({}); // objet vide = erreur côté joueur
  }
  else // toutes les inscriptions ont été effectués OU les inscriptions n'ont pas commencées
  {
    res.send({}); // objet vide = erreur côté joueur
  }
});

// Fin de partie (affichage des scores, des graphiques, ...)
router.get('/fin', function(req, res, next) {
  res.render('fin', {title: 'Fin du jeu'});
});

// Remise à zéro de l'état et des règles et retour au paramétrage des règles et des agents
router.get('/annulation', function(req, res, next) {
  regles = {};
  etat = 0;
  res.redirect('/');
});

module.exports = router;
