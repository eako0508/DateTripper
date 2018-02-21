'use strict';
const express = require('express');
const {Destination} = require('./models');
const config = require('../config');
const router = express.Router();
const bodyParser = require('body-parser');
const {User} = require('../users');

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
  		res.status(200).json(entries.map(entry=>entry.serialize()));
      //res.status(200).json(entries);
  	}).catch((err)=>{
  		console.error(err);
  		res.status(500).send('Server error');
  	});
  });

//check if the same title exists
//if not, create an entry

router.route('/addDate/:username')
  .post((req,res)=>{
  	Destination
      .find({
        title: req.body.title
      })
      .count()
      .then(result=>{
        if(result>0){
          //Q: how to display the error message on client end?
          res.status(500).send('so sorry');
        }
        Destination.create({
          username: req.params.username,
          title: req.body.title,
          destinations: req.body.destinations
        })
        .then(addedItem=>{
          let saving_list = {
            id: addedItem._id,
            username: addedItem.username,
            title: addedItem.title
          };
          User.findOneAndUpdate(
            {username: addedItem.username},
            {$push: {savedLists: saving_list}},
            {new:true}/*,
            function(err, raw){
              if(err) return handleError(err);
              //console.log('The raw data: ', raw);
              return raw;
            }*/
          )
          //pick one

          //option 1: user's info
          //.then(destModel => res.status(201).json(destModel.serialize()))
          .catch(err => {
            console.error(err);
            res.status(500).send('Server error');
          });
          //option 2: added info
          return res.status(201).json(addedItem.serialize());
        });
      })
  });
  
module.exports = {router};