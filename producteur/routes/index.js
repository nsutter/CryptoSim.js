var express = require('express');
var request = require('request');
var router = express.Router();

module.exports = router;

var param= {};

request("localhost:4000/producteur/inscription", function (error, reponse, body) {
  if(reponse){
    param = JSON.parse(body);
  }
  else {
    param.quantite = parseInt(10);
    param.delay= parseInt(1000);
    param.ressource= "ETH";
    param.quantite_produit= parseInt(1);
  }
});

var serveur= "localhost:4000"
var quantite= param.quantite;

function update()
{
  if(param.proportionnel) {
    quantite = parseInt(quantite + quantite/2 + 1);
  }
  else {
    quantite = quantite + parseInt(param.quantite_produit);
  }
  console.log(quantite);
}

// lancement de la partie
router.get('/start', function(req, res, next){
  setInterval(update, param.delay);
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
