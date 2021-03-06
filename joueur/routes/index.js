var express = require('express');
var request = require('request');
var router = express.Router();

var joueur = require('../private/joueur');

var data = require('../model/data');

var param = {};
var agents = {};

// récupération de paramètres du joueur
// TODO : adresse du coordinateur et du joueur dynamique (lancé avec le script)
console.log('Téléchargement des paramètres...');
request('http://' + process.env.CIP + ':' + process.env.CPORT + '/joueur/inscription/' + process.argv[2] + '/' + process.argv[3], function (error, response, body) {
  if(response){
    param = JSON.parse(body);

    if(!param.ip) // inscription impossible
    {
      process.exit(1);
    }

    console.log('Initialisation de la stratégie...');
    if(param.observer)
    {
      param.observation = false;
    }

    if(param.strategie == 'voleur')
    {
      param.action = false;
    }
    else if(param.strategie == 'paranoiaque')
    {
      param.action = false;
    }

    console.log(param);
  }

  param.coordinateur = {};
  param.coordinateur.ip = process.env.CIP;
  param.coordinateur.port = process.env.CPORT;

  param.fini = false; // défini si le joueur a fini
});

function update()
{
  // si on a fini, on n'effectue aucune action mais en reste en exécution
  if(param.stop)
    return;

  // on sort du mode observation si on y était
  param.observation = false;

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
    joueur.voleur(param, agents, agents.cibles);
  }
  else if(param.strategie == 'paranoiaque')
  {
    joueur.paranoiaque(param, agents);
  }

  // on enregistre les logs
  var TimeInMS = new Date().getTime();
  var i;
  var r= [];
  for(i=0; i<param.objectif.length; i++){
    r.push(param.objectif[i].quantite);
  }
  var newData = new data({joueur: param.ip + param.port, date: TimeInMS, ressources: r});
  newData.save();

  // vérification s'il a réussi ses objectifs
  joueur.verification_stop(param);
}

// lancement de la partie
router.post('/start', function(req, res, next) {
  console.log('Récupération des autres agents...');
  agents = JSON.parse(req.body.agents);
  agents.cibles = [];
  console.log(agents);

  console.log('Démarrage du joueur...');
  setInterval(update, 1000); // une action chaque seconde

  res.end();
});

// observation des ressources
router.get('/show_ressource', function(req, res, next) {
  if(param.stop) // si le joueur a fini, on transmet au client qu'on a fini
  {
    res.send({success: false, raison: 'stop'})
  }

  if(param.observer)
  {
    var resultat = {};
    resultat.ip = param.ip;
    resultat.port = param.port;
    resultat.success = true;
    resultat.objectif = param.objectif;
    res.send(resultat);
  }
  else
  {
    res.send({success: false, raison: 'impossible'});
  }
});

// observation de la stratégie
router.get('/show_strategie', function(req, res, next) {
  if(param.stop) // si le joueur a fini, on transmet au client qu'on a fini
  {
    res.send({success: false, ip: param.ip, port: param.port, raison: 'stop'});
  }

  if(param.observer)
  {
    res.send({success: true, ip: param.ip, port: param.port, strategie: param.strategie});
  }
  else
  {
    res.send({success: false, raison: 'impossible'});
  }
});

// se faire voler la ressource :ressourceVolee en quantité :quantitéVolee
router.get('/voler/:ressourceVolee/:quantiteVolee', function(req, res, next) {
  if(param.stop) // si le joueur a fini, on transmet au client qu'on a fini
  {
    res.send({success: false, raison: 'stop'})
  }

  if(param.observation) // voleur détecté
  {
    res.send({success: false, ip: param.ip, port: param.port, raison: 'observation'});
    return;
  }

  var quantiteVolee = joueur.se_faire_voler(param, req.params.ressourceVolee, req.params.quantiteVolee);

  res.json({success: true, quantiteVolee: quantiteVolee}); // un vol qui échoue renvoie 0
});

// arrêt
router.get('/end', function(req, res, next) {
  process.exit();
})

module.exports = router;
