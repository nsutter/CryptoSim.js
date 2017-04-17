var express = require('express');
var router = express.Router();

module.exports = router;

// faire une requete get au debut vers /producteur/inscription

var serveur= "localhost:4000"

var quantite= param.quantite;

function update()
{
  if(param.proportionnel) {
    quantite = quantite + quantite/2 + 1;
  }
  else {
    quantite = quantite + quantite_produit;
  }
  console.log(quantite);
  setTimeout(update, param.delay);
}

// lancement de la partie
router.get('/start', function(req, res, next){
  setTimeout(update, param.delay);
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
