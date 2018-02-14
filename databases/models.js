//models.js

const mongoose = require('mongoose');

let databaseSchema = new mongoose.Schema({
	name: {type: String, required: true}

});

const User = mongoose.model('Database', databaseSchema);