var express = require('express');
var router = express.Router();

module.exports = router;

var ressource;
var nombre;
var delay= 1000;
var serveur= "192.168.1.1:3000"

function update()
{
  nombre = nombre+1;
  console.log(nombre);
  setTimeout(update, delay);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// lancement de la partie
router.get('/start', function(req, res, next){
  nombre= 0;
  ressource= "ethereum";
  setTimeout(update, delay);
});

//connaitre le type de ressource et le nombre que le producteur possède
router.get('/show_ressource', function(req, res, next){
  res.send(ressource + ": " + nombre);
});

//prendre une ressource
router.get('/get_ressource/:nb', function(req, res, next){
  if(parseInt(req.params.nb) <= nombre){
    nombre= nombre - parseInt(req.params.nb);
    res.send(req.params.nb);
  }
  else {
    res.send(nombre);
    nombre= 0;
  }
});
