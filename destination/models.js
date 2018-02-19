//models.js

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let destinationSchema = new mongoose.Schema({
	username: {type: String, required: true},
	title: {type: String, required: true},
	destinations: {type: Array, default: []}
});


destinationSchema.methods.serialize = function() {
  return {
  	id: this._id,
    username: this.username
  };
};


const Destination = mongoose.model('destination', destinationSchema);

module.exports = {Destination};