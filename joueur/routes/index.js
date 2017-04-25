var express = require('express');
var request = require('request');
var router = express.Router();

var joueur = require('../private/joueur');

var data= require('../model/data');

var param = {};
var agents = {};

// récupération de paramètres du joueur
// TODO : adresse du coordinateur et du joueur dynamique (lancé avec le script)
console.log('Téléchargement des paramètres...')
request('http://localhost:1337/joueur/inscription/localhost/2001', function (error, response, body) {
  if(response){
    param = JSON.parse(body);

    if(!param.ip) // inscription impossible
    {
      process.exit(1);
    }

    console.log('Initialisation de la stratégie...')
    if(param.strategie == 'voleur')
    {
      param.action = false;

      // TODO : réfléchir au voleur..
    }
    else if(param.strategie == 'paranoiaque')
    {
      param.action = false;
    }

    console.log(param);

  }
  else { // par défaut
    param.strategie = 'cooperatif';
    param.voler = false;
    param.observer = false;
    param.Nressources = 10;
  }
});

function update()
{
  // action du joueur en fonction de sa stratégie
  if(param.strategie == 'cooperatif')
  {
    joueur.cooperatif(param, agents);
  }
  else if(param.strategie == 'individualiste')
  {
    joueur.individualiste(param, agents);
  }
  else if(param.strategie == 'voleur')
  {
    joueur.voleur(param, agents);
  }
  else if(param.strategie == 'paranoiaque')
  {
    joueur.paranoiaque(param, agents);
  }

  console.log(param.objectif);
  var TimeInMS = Date.now()
  data.register(new data({ip: param.ip, port: param.port, partie: param.idpartie, date: TimeInMS, ressources: param.objectif });

  // vérification s'il a réussi ses objectifs
  joueur.verification_stop(param);
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
