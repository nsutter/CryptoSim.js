var request = require('request');

module.exports = {
  /*
    démarre le jeu en démarrant chaque agent par une requête vers sa route /start
  */
  start: function(regles){

    var agents = {}; // array des agents concurrents avec le minimum d'informations possibles pour les joueurs
    agents.producteurs = [];
    agents.joueurs = [];

    for(var i = 0; i < regles.producteurs.length; i++)
    {
      agents.producteurs.push({ip: regles.producteurs[i].ip, port: regles.producteurs[i].port, ressource: regles.producteurs[i].ressource});
    }

    for(var i = 0; i < regles.joueurs.length; i++)
    {
      agents.joueurs.push({ip: regles.joueurs[i].ip, port: regles.joueurs[i].port});
    }

    // démarrage des producteurs
    for(var i = 0; i < regles.producteurs.length; i++)
    {
      request.post('http://' + regles.producteurs[i].ip + ':' + regles.producteurs[i].port + '/start', function (err1, res1, body1) {
        if(err1)
          console.log(err1)
        if(!err1)
          console.log('statusCode:', res1.statusCode);
      });
    }

    // démarrage des joueurs
    for(var i = 0; i < regles.joueurs.length; i++)
    {
      request.post('http://' + regles.joueurs[i].ip + ':' + regles.joueurs[i].port + '/start', {form: {agents: JSON.stringify(agents)}}, function (err2, res2, body2) {
        if(err2)
          console.log(err2)
        if(!err2)
          console.log('statusCode:', res2.statusCode);
      });
    }

    return 0;
  },
  end: function(regles)
  {
    // on arrête tous les joueurs dans le cas où l'arrêt vient du bouton d'arrêt
    for(var i = 0; i < regles.joueurs.length; i++)
    {
      request.post('http://' + regles.joueurs[i].ip + ':' + regles.joueurs[i].port + '/end', function (err, res, body) {
        if(err)
        {
          console.log(err)
        }
        if(!err)
        {
          console.log('statusCode:', res.statusCode);
          regles.joueurs[i].stop = true;
        }
      });
    }

    // on arrête tous les producteurs
    for(var i = 0; i < regles.producteurs.length; i++)
    {
      request.post('http://' + regles.producteurs[i].ip + ':' + regles.producteurs[i].port + '/end', function (err, res, body) {
        if(err)
          console.log(err)
        if(!err)
          console.log('statusCode:', res.statusCode);
      });
    }
  }
};
