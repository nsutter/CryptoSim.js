var express = require('express');
var request = require('request');
var router = express.Router();

var joueur = require('../private/joueur');

var param = {};
var agents = {};

// récupération de paramètres du joueur
// TODO : adresse du coordinateur et du joueur dynamique (lancé avec le script)
request('http://localhost:1337/joueur/inscription/localhost/2001', function (error, response, body) {
  if(response){
    param = JSON.parse(body);
    console.log('Téléchargement des paramètres...')
    console.log(param);
  }
  else { // par défaut
    param.ressource = "Ether";
    param.quantite = 0;
    param.quantite_produite = 5;
  }
});

// rempli lors du lancement de la partie
var clients; // liste de couple IP/port
var producteurs; // liste de couple IP/port

// lancement de la partie
router.post('/start', function(req, res, next) {
  console.log('Récupération des autres agents...');
  agents = JSON.parse(req.body.agents)
  console.log(agents);
  console.log('Démarrage du joueur...');
  // TODO : le joueur avec ses actions
  res.end();
});

// se faire observer
router.get('/observer', function(req, res, next) {
  // if(regles.observer)
});

// se faire voler la ressource :ressourceVolee en quantité :quantitéVolee
router.get('/voler/:ressourceVolee/:quantiteVolee', function(req, res, next) {

  var quantiteVolee = joueur.vol(req.params.ressource, req.params.quantiteVolee);

  res.json({success: true, quantiteVolee: quantiteVolee});
});

module.exports = router;
