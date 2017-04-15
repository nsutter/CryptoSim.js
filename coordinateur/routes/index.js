var express = require('express');
var router = express.Router();

/*
etat = 0 -> rien
etat = 1 -> regles OK
etat = 2 -> regles OK, ..
*/
var etat = 0;

// Paramétrage des règles et des agents
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Préparation du jeu 1/2 - Paramétrage des règles et des agents' });
});

// Enregistrement des règles et des agents
router.post('/regles', function(req, res, next) {

  console.log(req.body);

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
