var express = require('express');
var request = require('request');
var router = express.Router();

module.exports = router;

var param = {};

// récupération de paramètres du producteur
// TODO : adresse du coordinateur et du producteur dynamique (lancé avec le script)
request('http://localhost:1337/producteur/inscription/localhost/3001', function (error, response, body) {
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

var serveur = "localhost:1337"
var quantite = param.quantite;

// parseInt NE SONT PLUS NECESSAIRES car au niveau du coordinateur ? à tester
function update()
{
  // TODO : implémenter param.proportionnel côté coordinateur
  if(param.proportionnel) {
    param.quantite = parseInt(param.quantite) + parseInt(param.quantite)/2 + 1;
  }
  else {
    param.quantite = parseInt(param.quantite) + parseInt(param.quantite_produite);
  }
  console.log(new Date() + ' : ' + param.quantite + ' ' + param.ressource + '(s)');
}

// lancement de la partie
router.post('/start', function(req, res, next){
  console.log('\nDémarrage de la production...')
  setInterval(update, 1000); // chaque seconde
  res.end();
});

// connaître le type de ressource et la quantité que le producteur possède
router.get('/show_ressource', function(req, res, next){
  res.send({nom: param.ressource, quantite: param.quantite}); // envoi du nom et de la quantité de la ressource produite
});

// prendre une ressource
// parseInt NE SONT PLUS NECESSAIRES car au niveau du coordinateur ? à tester
router.get('/get_ressource/:nb', function(req, res, next){
  if(req.params.nb <= parseInt(param.quantite)){ // vérification de la quantité disponible
    param.quantite = parseInt(param.quantite) - req.params.nb;
    res.send(req.params.nb); // envoi du nombre brut
  }
  else {
    res.send(param.quantite); // envoi du nombre brut
    quantite = 0;
  }
});
