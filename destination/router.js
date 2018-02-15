'use strict';
const express = require('express');
const destModels = require('./models');
const config = require('../config');
const router = express.Router();


router.route('/:username')
  .get((req,res)=>{
  	//get user's destination from destination colleciton
  });
  


module.exports = {router};