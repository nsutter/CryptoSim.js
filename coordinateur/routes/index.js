var express = require('express');
var router = express.Router();

/*
etat = 0 -> rien
etat = 1 -> regles OK
etat = 2 -> regles OK, ..
*/
var etat = 0;

var regles = {};

// Paramétrage des règles et des agents
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Préparation du jeu 1/2 - Paramétrage des règles et des agents' });
});

// Enregistrement des règles et des agents
router.post('/regles', function(req, res, next) {

  console.log(req.body);

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

  // ---------------------------------------------------------------------
  // si c'est un Array, on fait ça, si c'est un String, on en ajoute qu'un
  for(var i = 0; i < req.body.objectif_nom.length; i++)
  {
    regles.objectif.push({nom: req.body.objectif_nom[i], quantite: req.body.objectif_quantite[i]});
  }

  // int Nressources
  regles.Nressources = req.body.Nressources;

  // object coordinateur
  regles.coordinateur = {ip: req.body.coordinateur_ip, port: req.body.coordinateur_port};

  // array liste des joueurs
  regles.joueurs = [];

  for(var i = 0; i < req.body.joueur_ip.length; i++)
  {
    regles.joueurs.push({ip: req.body.joueur_ip[i], port: req.body.joueur_port[i], strategie: req.body.joueur_strategie});
  }

  // array liste des producteurs
  regles.producteurs = [];

  for(var i = 0; i < req.body.producteur_ip.length; i++)
  {
    regles.producteurs.push({ip: req.body.producteur_ip[i], port: req.body.producteur_port[i], ressource: req.body.producteur_ressource_produite[i], quantite: req.body.producteur_quantite_produite[i]});
  }

  console.log(regles);

  // enregistrer les règles
  etat = 1;

  // lancer les agents

  res.redirect('/');
});


// Inscription des agents
router.get('/inscription', function(req, res, next) {
  res.render('inscription', { title: 'Préparation du jeu 2/2 - Inscription des agents' });
});




module.exports = router;