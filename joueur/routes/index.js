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

    if(!param.ip) // inscription impossible
    {
      process.exit(1);
    }

    console.log('Téléchargement des paramètres...')
    console.log(param);
  }
  else { // par défaut
    param.strategie = 'Mec de gauche';
    param.voler = false;
    param.observer = false;
    param.Nressources = 10;
  }
});

function update()
{
  // INTÉGRER ICI UNE IA QUI PREND LE CONTRÔLE DU MONDE

  // joueur.observer(param, agents.producteurs[0], 'producteur', 'ressources');
}

// lancement de la partie
router.post('/start', function(req, res, next) {
  console.log('Récupération des autres agents...');
  agents = JSON.parse(req.body.agents)
  console.log(agents);
  console.log('Démarrage du joueur...');
  // TODO : le joueur avec ses actions
  res.end();

  setInterval(update, 1000); // chaque seconde
});

// observation des ressources
router.get('/show_ressource', function(req, res, next) {
  if(param.observer)
  {
    var resultat = {};
    resultat.success = true;
    resultat.objectif = param.objectif;
    res.send(resultat);
  }
  else
  {
    res.send({success: false});
  }
});

// observation de la stratégie
router.get('/show_strategie', function(req, res, next) {
  if(param.observer)
  {
    res.send({success: true, strategie: param.strategie});
  }
  else
  {
    res.send({success: false});
  }
});

// se faire voler la ressource :ressourceVolee en quantité :quantitéVolee
router.get('/voler/:ressourceVolee/:quantiteVolee', function(req, res, next) {

  var quantiteVolee = joueur.se_faire_voler(req.params.ressource, req.params.quantiteVolee);

  res.json({success: true, quantiteVolee: quantiteVolee});
});

module.exports = router;
