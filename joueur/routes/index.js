var express = require('express');
var router = express.Router();

// rempli lors du lancement
var coordinateur; // couple IP/port

// rempli lors de l'inscription au coordinateur
var observer; // true or false
var voler; // true or false
var Nressources; // le nombre de ressources qu'on peut prendre

var ressources; // JSON avec ressources courantes et ressources voulues

/*
[
{ nom : "",
  quantite : "",
  objectif : ""
}
]
*/

// rempli lors du lancement de la partie
var clients; // liste de couple IP/port
var producteurs; // liste de couple IP/port

/*
  renvoie la quantité volée de la ressource volée
  TODO : quantité volée max
*/
function vol(ressourceVolee, quantiteVolee){

  // si on a pas le droit de voler, on s'arrête
  if(!voler)
    return 0;

  for(var i = 0; i < ressources.length; i++)
  {
    if(ressources[i].nom = ressourceVolee)
    {
      if(ressources[i].quantite >= quantiteVolee)
      {
        ressources[i].quantite -= quantiteVolee;
        return quantiteVolee; // vol total
      }
      else
      {
        var quantite = ressources[i].quantite;
        ressources[i].quantite = 0;
        return quantite; // vol partiel
      }
    }
  }

  return 0;
}

// lancement de la partie
router.post('/start', function(req, res, next) {
});

// se faire observer
router.get('/observer', function(req, res, next) {
  // if(observer)
});

// se faire voler la ressource :ressourceVolee
router.get('/voler/:ressourceVolee/:quantiteVolee', function(req, res, next) {

  var quantiteVolee = vol(req.params.ressource, req.params.quantiteVolee);

  res.json({success: true, quantiteVolee: quantiteVolee});
});

module.exports = router;
