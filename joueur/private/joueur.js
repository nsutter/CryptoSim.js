var request = require('request');

module.exports = {
  /*
    passe en mode observation et met le résultat de l'observation dans cibles
  */
  observer: function(param, agents, cibles)
  {
    // si on a pas le droit d'observer, on s'arrête
    if(!param.observer)
      return 0;

    param.observation = true;

    // on effectue une requête sur chaque agent pour récupérer ses informations
    for(var i = 0; i < agents.joueurs.length; i++)
    {
      request.get('http://' + agents.joueurs[i].ip + ':' + agents.joueurs[i].port + '/show_ressource', function(err, res, body){
        var resultat = JSON.parse(body);

        if(resultat.success) // si on obtient des informations correctes, on les ajoute à un tableau qui sera réutilisé
        {
          cibles.push({ip: agents.joueurs[i].ip, port: agents.joueurs[i].port, objectif: resultat.objectif});
        }
      });
    }
  },
  /*
    vole quantiteVolee unité de ressourceVolee à cible
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
        for(var i = 0; i < param.objectif.length; i++)
        {
          if(param.objectif[i].nom == ressourceVolee)
          {
            param.objectif[i].quantite += resultat.quantiteVolee;
          }
        }
      }

      return;
    });
  },
  /*
    renvoie la quantité volée de la ressource volée
  */
  se_faire_voler: function(param, ressourceVolee, quantiteVolee){

    // si on a pas le droit de se faire voler, on s'arrête
    if(!param.voler)
      return 0;

    if(quantiteVolee > param.Nressources)
    {
      quantiteVolee = param.Nressources;
    }

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
    if(param.stop)
      return;

    for(var i = 0; i < param.objectif.length; i++)
    {
      if(param.objectif[i].quantite < param.objectif[i].quantite_demandee)
        return; // on quitte la fonction sans rien faire si un objectif n'est pas atteint
    }

    // tous les objectifs sont atteints, on prévient le coordinateur et on passe en mode fini
    param.stop = true;
    request.get('http://' + param.coordinateur.ip + ':' + param.coordinateur.port + '/stop/' + param.ip + '/' + param.port);
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
  voleur: function(param, agents, cibles)
  {
    if(param.action) // voler
    {
      param.action = false;

    }
    else // observation
    {
      param.action = true;
      observer(param, agents, cibles);
    }
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
      observer();
    }
    else
    {
      param.action = true;
      cooperatif(param, agents);
    }
  }
};
