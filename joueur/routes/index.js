var express = require('express');
var request = require('request');
var router = express.Router();

var joueur = require('../private/joueur');

// rempli lors du lancement
var coordinateur; // triplet IP/port/adresse complète

// rempli lors de l'inscription au coordinateur
var regles; // JSON avec les règles
var ressources; // JSON avec ressources courantes et ressources voulues

// TODO : recommencer cette requête si elle échoue
request(coordinateur.adresse + '/inscription/joueur', function (err, res, body) {
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);
  console.log('body:', body);

  if(body.success)
  {
    regles = body.regles;
    ressources = body.ressources;
  }
});

// rempli lors du lancement de la partie
var clients; // liste de triplet IP/port/adresse complète
var producteurs; // liste de triplet IP/port/adresse complète

// lancement de la partie
router.post('/start', function(req, res, next) {
});

// se faire observer
router.get('/observer', function(req, res, next) {
  // if(observer)
});

// se faire voler la ressource :ressourceVolee
router.get('/voler/:ressourceVolee/:quantiteVolee', function(req, res, next) {

  var quantiteVolee = joueur.vol(req.params.ressource, req.params.quantiteVolee);

  res.json({success: true, quantiteVolee: quantiteVolee});
});

module.exports = router;
