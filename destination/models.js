//models.js

const mongoose = require('mongoose');

let destinationSchema = new mongoose.Schema({
	name: {type: String, required: true}	
});

const User = mongoose.model('Database', destinationSchema);