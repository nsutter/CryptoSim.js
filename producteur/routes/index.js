var express = require('express');
var router = express.Router();

module.exports = router;

var ressource;
var nombre;
var delay= 300;
var serveur= "192.168.1.1:3000"

function update()
{
  nombre ++;
  console.log(nombre);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// lancement de la partie
router.post('/start', function(req, res, next){
  setTimeout(update, delay);
});

//connaitre le type de ressource et le nombre que le producteur possède
router.get('/show_ressource', function(req, res, next){
  res.send(ressource + ": " + nombre);
});

//prendre une ressource
router.get('/get_ressource/:nb', function(req, res, next){
  if(req.param.nb < nombre){
    nombre= nombre - req.param.nb;
    res.send(req.param.nb);
  }
  else {
    res.send(nombre);
    nombre= 0;
  }
});
