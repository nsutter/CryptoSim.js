var mongoose = require('mongoose');

module.exports = mongoose.model('Data', {
  joueur: String,
  ressource: String,
  quantite: Number,
	date: Date
});
