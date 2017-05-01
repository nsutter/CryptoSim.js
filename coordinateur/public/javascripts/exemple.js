// rempli automatiquement un exemple de paramétrage avec 1 objectif, 1 joueur et 1 producteur
function exemple1()
{
  $('[name="voler"]').prop('checked', true);
  $('[name="observer"]').prop('checked', true);

  $('[name="objectif_nom"]').val('Ether');
  $('[name="objectif_quantite"]').val(35);

  $('[name="Nressources"]').val(10);

  $('[name="coordinateur_ip"]').val('localhost');
  $('[name="coordinateur_port"]').val(1337);

  $('[name="joueur_ip"]').val('localhost');
  $('[name="joueur_port"]').val(2001);
  $('[name="joueur_strategie"]').val('1');

  $('[name="producteur_ip"]').val('localhost');
  $('[name="producteur_port"]').val(3001);
  $('[name="producteur_ressource_produite"]').val('Ether');
  $('[name="producteur_quantite_initiale"]').val(0);
  $('[name="producteur_quantite_produite"]').val(5);
}

// rempli automatiquement un exemple de paramétrage avec 2 objectifs, 2 joueurs et 2 producteurs
function exemple2()
{
  $('[data-role="add"]').click();

  $('[name="voler"]').prop('checked', true);
  $('[name="observer"]').prop('checked', true);

  $('[name="objectif_nom"]:eq(0)').val('Ether');
  $('[name="objectif_quantite"]:eq(0)').val(35);

  $('[name="objectif_nom"]:eq(1)').val('Bitcoin');
  $('[name="objectif_quantite"]:eq(1)').val(50);

  $('[name="Nressources"]').val(10);

  $('[name="coordinateur_ip"]').val('localhost');
  $('[name="coordinateur_port"]').val(1337);

  $('[name="joueur_ip"]:eq(0)').val('localhost');
  $('[name="joueur_port"]:eq(0)').val(2001);
  $('[name="joueur_strategie"]:eq(0)').val('1');

  $('[name="joueur_ip"]:eq(1)').val('localhost');
  $('[name="joueur_port"]:eq(1)').val(2002);
  $('[name="joueur_strategie"]:eq(1)').val('1');

  $('[name="producteur_ip"]:eq(0)').val('localhost');
  $('[name="producteur_port"]:eq(0)').val(3001);
  $('[name="producteur_ressource_produite"]:eq(0)').val('Ether');
  $('[name="producteur_quantite_initiale"]:eq(0)').val(0);
  $('[name="producteur_quantite_produite"]:eq(0)').val(5);

  $('[name="producteur_ip"]:eq(1)').val('localhost');
  $('[name="producteur_port"]:eq(1)').val(3002);
  $('[name="producteur_ressource_produite"]:eq(1)').val('Bitcoin');
  $('[name="producteur_quantite_initiale"]:eq(1)').val(5);
  $('[name="producteur_quantite_produite"]:eq(1)').val(1);
}
