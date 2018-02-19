'use strict';
const express = require('express');
const DestModels = require('./models');
const config = require('../config');
const router = express.Router();


router.route('/:username')
  .get((req,res)=>{
  	DestModels.find({
  		username: req.params.username
  	}).then(entries=>{
  		res.status(200).json(entries);
  	}).catch((err)=>{
  		console.error(err);
  		res.status(500).send('Server error');
  	});
  });
  
router.route('/')
  .post((req,res)=>{
  	DestModels
	  	.create({
	  		username: req.body.username,
	  		title: req.body.title,
	  		destinations: req.body.destinations
	  	})
	  	.then(destModel => res.status(201).json(destModel.serialize()))
	  	.catch(err => {
	  		console.error(err);
	  		res.status(500).send('Server error');
	  	});
  });

router.route('/')


module.exports = {router};