var express = require('express');
var request = require('request');
var router = express.Router();

module.exports = router;

var param = {};
param.coordinateur = {};
param.coordinateur.ip = process.env.CIP;
param.coordinateur.port = process.env.CPORT;
// récupération de paramètres du producteur
// TODO : adresse du coordinateur et du producteur dynamique (lancé avec le script)
request('http://' + param.coordinateur.ip + ':' + param.coordinateur.port + '/producteur/inscription/' + process.argv[2] + '/' + process.argv[3], function (error, response, body) {
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
    param.ressource = "Ether";
    param.quantite = 0;
    param.quantite_produite = 5;
  }
});

var quantite = param.quantite;

function update()
{
  if(param.proportionnel == 'o') {
    param.quantite = parseInt(param.quantite) + parseInt(param.quantite)/2 + 1;
  }
  else {
    param.quantite = parseInt(param.quantite) + parseInt(param.quantite_produite);
  }

  console.log(new Date() + ' : ' + param.quantite + ' ' + param.ressource + '(s)');
}

// lancement de la partie
router.post('/start', function(req, res, next){
  console.log('\nDémarrage de la production...');
  setInterval(update, 1000); // une action chaque seconde
  res.end();
});

// connaître le type de ressource et la quantité que le producteur possède
router.get('/show_ressource', function(req, res, next){
  res.send({nom: param.ressource, quantite: param.quantite}); // envoi du nom et de la quantité de la ressource produite
});

// prendre une ressource
router.get('/get_ressource/:nb', function(req, res, next){
  if(req.params.nb <= parseInt(param.quantite)){ // vérification de la quantité disponible
    param.quantite = parseInt(param.quantite) - req.params.nb;
    res.send(req.params.nb + ""); // envoi du nombre brut
  }
  else {
    res.send(param.quantite + ""); // envoi du nombre brut
    quantite = 0;
  }
});

// arrêt
router.get('/end', function(req, res, next) {
  process.exit();
})
