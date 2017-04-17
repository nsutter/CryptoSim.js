function exemple1()
{
  $('[name="voler"]').prop('checked', true);

  $('[name="objectif_nom"]').val('Ether');
  $('[name="objectif_quantite"]').val(35);

  $('[name="Nressources"]').val(10);

  $('[name="coordinateur_ip"]').val('192.168.1.1');
  $('[name="coordinateur_port"]').val(1337);

  $('[name="joueur_ip"]').val('192.168.2.1');
  $('[name="joueur_port"]').val(2001);
  $('[name="joueur_strategie"]').val('1');

  $('[name="producteur_ip"]').val('192.168.3.1');
  $('[name="producteur_port"]').val(3001);
  $('[name="producteur_ressource_produite"]').val('Ether');
  $('[name="producteur_quantite_initiale"]').val(0);
  $('[name="producteur_quantite_produite"]').val(5);
}

function exemple2()
{
  $('[data-role="add"]').click();

  $('[name="voler"]').prop('checked', true);

  $('[name="objectif_nom"]:eq(0)').val('Ether');
  $('[name="objectif_quantite"]:eq(0)').val(35);

  $('[name="objectif_nom"]:eq(1)').val('Bitcoin');
  $('[name="objectif_quantite"]:eq(1)').val(50);

  $('[name="Nressources"]').val(10);

  $('[name="coordinateur_ip"]').val('192.168.1.1');
  $('[name="coordinateur_port"]').val(1337);

  $('[name="joueur_ip"]:eq(0)').val('192.168.2.1');
  $('[name="joueur_port"]:eq(0)').val(2001);
  $('[name="joueur_strategie"]:eq(0)').val('1');

  $('[name="joueur_ip"]:eq(1)').val('192.168.2.2');
  $('[name="joueur_port"]:eq(1)').val(2002);
  $('[name="joueur_strategie"]:eq(1)').val('1');

  $('[name="producteur_ip"]:eq(0)').val('192.168.3.1');
  $('[name="producteur_port"]:eq(0)').val(3001);
  $('[name="producteur_ressource_produite"]:eq(0)').val('Ether');
  $('[name="producteur_quantite_initiale"]:eq(0)').val(0);
  $('[name="producteur_quantite_produite"]:eq(0)').val(5);

  $('[name="producteur_ip"]:eq(1)').val('192.168.3.2');
  $('[name="producteur_port"]:eq(1)').val(3002);
  $('[name="producteur_ressource_produite"]:eq(1)').val('Bitcoin');
  $('[name="producteur_quantite_initiale"]:eq(1)').val(5);
  $('[name="producteur_quantite_produite"]:eq(1)').val(1);
}
