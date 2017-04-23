var request = require('request');

module.exports = {
  /*
    cible = le couple IP/port de la cible
    type_cible = producteur/joueur
    type_observation = ressources/strategie
    /!\ le traitement de l'observation N'EST PAS effectué dans la fonction
    TODO : CALLBACK
  */
  observer: function(param, cible, type_cible, type_observation)
  {
    if(!param.observer)
      return {success: false};

    var adresse;

    // construction de l'adresse
    if(type_cible == 'joueur' && type_observation == 'strategie') // observation de la stratégie sur  unjoueur
    {
      adresse = 'http://' + cible.ip + ':' + cible.port + '/show_strategie';
    }
    else // observation de(s) ressource(s) sur un joueur/producteur
    {
      adresse = 'http://' + cible.ip + ':' + cible.port + '/show_ressource';
    }

    // requête
    request.get(adresse, function(err, res, body){

      // CALLBACK
      return JSON.parse(body);
    });
  },
  /*
    renvoie la quantité volée de la ressource volée à la cible
    /!\ le traitement du vol EST effectué dans la fonction
  */
  voler: function(param, ressourceVolee, quantiteVolee, cible)
  {
    // si on a pas le droit de voler, on s'arrête
    if(!param.voler)
      return;

    // construction de l'adresse et requête
    request.get('http://' + cible.ip + ':' + cible.port + '/voler/ ' + ressourceVolee + '/' + quantiteVolee, function(err, res, body){
      var resultat = JSON.parse(body);

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
  se_faire_voler: function(param, ressourceVolee, quantiteVolee){

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
