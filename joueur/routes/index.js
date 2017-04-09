var express = require('express');
var router = express.Router();

var joueur = require('../private/joueur');

// rempli lors du lancement
var coordinateur; // couple IP/port

// rempli lors de l'inscription au coordinateur
var observer; // true or false
var voler; // true or false
var Nressources; // le nombre de ressources qu'on peut prendre

var ressources; // JSON avec ressources courantes et ressources voulues

// rempli lors du lancement de la partie
var clients; // liste de couple IP/port
var producteurs; // liste de couple IP/port

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
