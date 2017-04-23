module.exports = {
  /*
    renvoie la quantité volée de la ressource volée à la cible
  */
  voler: function(ressourceVolee, quantiteVolee, cible)
  {
    // si on a pas le droit de voler, on s'arrête
    if(!param.voler)
      return;

    // construction de l'adresse et requête
    request.post('http://' + cible.ip + ':' + cible.port + '/voler/ ' + ressourceVolee + '/' + quantiteVolee, function(err, res, body){
      var resulat = JSON.parse(body);

      if(body.success) // mise à jour des objectifs
      {
        // param.objectif[ressourceVolee] += resultat.quantiteVolee;
      }

      return;
    });
  },
  /*
    renvoie la quantité volée de la ressource volée
    TODO : seuil maximum de quantité volée
  */
  se_faire_voler: function(ressourceVolee, quantiteVolee){

    // si on a pas le droit de se faire voler, on s'arrête
    if(!param.voler)
      return 0;

    for(var i = 0; i < param.objectif.length; i++)
    {
      if(param.objectif[i].nom == ressourceVolee)
      {
        if(param.objectif[i].quantite >= quantiteVolee)
        {
          param.objectif[i].quantite -= quantiteVolee;
          return quantiteVolee; // vol total
        }
        else
        {
          var quantite = param.objectif[i].quantite;
          param.objectif[i].quantite = 0;
          return quantite; // vol partiel
        }
      }
    }

    return 0; // on ne possède pas la ressource demandée
  }
};
