module.exports = {
  /*
    renvoie la quantité volée de la ressource volée
    TODO : seuil maximum de quantité volée
  */
  vol: function(ressourceVolee, quantiteVolee){

    // si on a pas le droit de voler, on s'arrête
    if(!regles.voler)
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
};
