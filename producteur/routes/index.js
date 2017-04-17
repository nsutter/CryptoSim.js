var express = require('express');
var router = express.Router();

module.exports = router;

// faire une requete get au debut vers /producteur/inscription

var delay= 1000;
var serveur= "localhost:4000"

var quantite= param.quantite;

//fonction de production de la ressource: fonction qu'on peut faire nombre_initial/2*quantite
function update()
{
  quantite = quantite + quantite_produit;
  console.log(quantite);
  setTimeout(update, delay);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// lancement de la partie
router.get('/start', function(req, res, next){
  setTimeout(update, delay);
});

//connaitre le type de ressource et le quantite que le producteur possède
router.get('/show_ressource', function(req, res, next){
  res.send(param.ressource + ": " + quantite);
});

//prendre une ressource
router.get('/get_ressource/:nb', function(req, res, next){
  if(parseInt(req.params.nb) <= quantite){
    quantite= quantite - parseInt(req.params.nb);
    res.send(req.params.nb);
  }
  else {
    res.send(quantite);
    quantite= 0;
  }
});
