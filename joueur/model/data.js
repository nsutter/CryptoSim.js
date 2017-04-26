var mongoose = require('mongoose');

module.exports = mongoose.model('Data', {
  ip: String,
  port: String,
  partie: String,
  ressources: [],
	date: Number
});
