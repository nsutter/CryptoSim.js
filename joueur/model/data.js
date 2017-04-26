var mongoose = require('mongoose');

module.exports = mongoose.model('Data', {
  joueur: String,
  ressources: [],
	date: Number
});
