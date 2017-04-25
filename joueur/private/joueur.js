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
  },
  /*
    vérifie si les objectifs sont remplis et effectue les actions correspondantes
  */
  verification_stop: function(param)
  {
    for(var i = 0; i < param.objectif.length; i++)
    {
      if(param.objectif[i].quantite < param.objectif[i].quantite_demandee)
        return; // on quitte la fonction sans rien faire si un objectif n'est pas atteint
    }

    // tous les objectifs sont atteints, on prévient le coordinateur et on arrête le jeu
    // TODO : coordinateur non défini
    request.get('http://' + param.coordinateur.ip + ':' + param.coordinateur.port + '/stop/' + param.ip + '/' + param.port); // est-ce que ça marche comme ça ?
  },
  /*
    IA coopérative
    - cherche à atteindre ses objectifs sans interaction avec les autres joueurs
  */
  cooperatif: function(param, agents)
  {
    // on cherche la ressource où l'on est le moins avancé dans les objectifs
    var ressourceLaMoinsAvancee, quantiteLaMoinsAvancee = 0;

    for(var i = 0; i < param.objectif.length; i++)
    {
      if(param.objectif[i].quantite_demandee - param.objectif[i].quantite > quantiteLaMoinsAvancee)
      {
        quantiteLaMoinsAvancee = param.objectif[i].quantite_demandee - param.objectif[i].quantite;
        ressourceLaMoinsAvancee = param.objectif[i].nom;
      }
    }

    if(ressourceLaMoinsAvancee)
    {
      // on cherche un producteur qui produit cette ressource
      for(var i = 0; i < agents.producteurs.length; i++)
      {
        if(agents.producteurs[i].ressource == ressourceLaMoinsAvancee)
        {
          // requête de récupération de ressource chez le producteur choisi
          request.get('http://' + agents.producteurs[i].ip + ':' + agents.producteurs[i].port + '/get_ressource/' + param.Nressources, function(err, res, body){

            for(var j = 0; j < param.objectif.length; j++)
            {
              if(param.objectif[j].nom == ressourceLaMoinsAvancee)
              {
                param.objectif[i].quantite += parseInt(body);
              }
            }
          });

          return;
        }
      }
    }
  },
  /*
    IA individualiste
    - cherche à atteindre ses objectifs en épuisant les ressources des producteurs
  */
  individualiste: function(param, agents)
  {
    // on cherche la 1ère ressource qu'on a pas réussi à obtenir complètement
    for(var i = 0; i < param.objectif.length; i++)
    {
      if(param.objectif[i].quantite_demandee >= param.objectif[i].quantite)
      {
        // on cherche le 1er producteur qui produit cette ressource
        for(var j = 0; j < agents.producteurs.length; j++)
        {
          if(agents.producteurs[j].ressource == param.objectif[i].nom)
          {
            // requête de récupération de ressource chez le producteur choisi
            request.get('http://' + agents.producteurs[i].ip + ':' + agents.producteurs[i].port + '/get_ressource/' + param.Nressources, function(err, res, body){
              // TODO : mettre à jour
            });

            return;
          }
        }
      }
    }
  },
  /*
    IA voleuse
    - cherche à atteindre ses objectifs en volant les autres joueurs
  */
  voleur: function(param, agents)
  {
    // TODO : code du voleur
  },
  /*
    IA paranoiaque
    - cherche à atteindre ses objectifs sans se faire voler
  */
  paranoiaque: function(param, agents)
  {
    // action spéciale
    if(param.action)
    {
      param.action = false;
      // TODO : se mettre en observation
    }
    else
    {
      param.action = true;
      cooperatif(param, agents);
    }
  }
};
