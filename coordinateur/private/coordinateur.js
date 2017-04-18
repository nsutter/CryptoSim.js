var request = require('request');

module.exports = {
  /*
    démarre le jeu en démarrant chaque agent
  */
  start: function(regles){

    /*
      request.post('adresse', {form: {key: 'value'}}, function(err, res, body){

      });
    */

    var agents = []; // array des agents concurrents avec le minimum d'informations possibles

    // démarrage des producteurs
    for(var i = 0; i < regles.producteurs.length; i++)
    {
      console.log('http://' + regles.producteurs[i].ip + ':' + regles.producteurs[i].port + '/start');

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
      request.post('http://' + regles.joueurs[i].ip + ':' + regles.joueurs[i].port + '/start', {form: agents}, function (err2, res2, body2) {
        if(err2)
          console.log(err2)
        if(!err2)
          console.log('statusCode:', res2.statusCode);
      });
    }

    return 0;
  }
};
