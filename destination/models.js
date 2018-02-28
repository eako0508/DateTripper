//models.js

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const destinationSchema = mongoose.Schema({
	username: {type: String, required: true},
	title: {type: String, required: true},
	destinations: {type: Array, default: []}
});


destinationSchema.methods.serialize = function() {
  return {
  	id: this._id,
    username: this.username,
    title: this.title,
    destinations: this.destinations
  };
};

const Destination = mongoose.model('destination', destinationSchema);

module.exports = {Destination};