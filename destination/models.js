//models.js

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
/*
let destinationSchema = new mongoose.Schema({
	name: {type: String, required: true},
	place_id: {type: String, required: true},
	username: {type: String, required: true}
	photos_large: {type: String, default: ''},
	photos_small: {type: String, default: ''},
	hours: {type: Array, default: []}
});
*/
let destinationSchema = new mongoose.Schema({
	username: {type: String, required: true},
	title: {type: String, required: true},
	destinations: {type: Array, default: []}
});


destinationSchema.methods.serialize = function() {
  return {
  	id: _id,
    username: this.username
  };
};


const User = mongoose.model('DestModels', destinationSchema);