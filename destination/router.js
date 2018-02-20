'use strict';
const express = require('express');
const {Destination} = require('./models');
const config = require('../config');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.route('/find')
  .get((req,res)=>{
  	Destination.find({})
  	.then(entries=>{
  		res.status(200).json(entries);
  	}).catch((err)=>{
  		console.error(err);
  		res.status(500).send('Server error');
  	});
  });


router.route('/find/:username')
  .get((req,res)=>{
  	Destination.find({
  		username: req.params.username
  	}).then(entries=>{
  		res.status(200).json(entries);
  	}).catch((err)=>{
  		console.error(err);
  		res.status(500).send('Server error');
  	});
  });


//check if the same title exists
//if not, create an entry
/*
router.route('/addDate/:username', (req,res)=>{
  return Destination
    .find({title:req.body.title})
    .count()
    .then(count=>{
      if(count>0){
        return Promise.reject({
          code: 422,
          message: 'title conflict'
        });
      }
      next();
    })
    .then(
      Destination.create({
        username: req.params.username,
        title: req.body.title,
        destinations: req.body.destinations
      })
      .then(destination => res.status(201).json(destination.serialize()))
      .catch(err=>{
        console.error(err);
        res.status(500).send('Server error');
      })
      );
});
*/
/*
        Destination.create({
          username: req.params.username,
          title: req.body.title,
          destinations: req.body.destinations
        })
        .then(destModel => res.status(201).json(destModel.serialize()))
        .catch(err => {
          console.error(err);
          res.status(500).send('Server error');
        });
        */

router.route('/addDate/:username')
  .post((req,res)=>{
  	Destination
      .find({
        title: req.body.title
      })
      .count()
      .then(result=>{
        
        
        if(result>0){
          console.log(result);
          /*
          return Promise.reject({
            code: 422,
            message: 'Same title exists',
            location: 'title'
          });
          
          return res.status(500).json(JSON.stringify({
            "message": 'Same title exists',
            "location": 'title'
          }));
          */
          res.status(500).send('so sorry');
        }
        
        res.status(201).send('a okay');
      });  	
  });

/*
router.route('/:username').post(function(req,res){
	console.log(req.body.title);
	//console.log('hello');
});
*/


module.exports = {router};