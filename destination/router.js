'use strict';
const express = require('express');
const {Destination} = require('./models');
const config = require('../config');
const router = express.Router();
const bodyParser = require('body-parser');
const {User} = require('../users');

router.use(bodyParser.json());

//  GET /find
router.route('/')
  .get((req,res)=>{
  	Destination.find({})
  	.then(entries=>{
  		res.status(200).json(entries);
  	}).catch((err)=>{
  		console.error(err);
  		res.status(500).send('Server error');
  	});
  });


//  GET /find/:username
router.route('/:username')
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





//  POST /addDate:username
//  Strategy
//check if the user exists
//check if the same title exists
//if not, create an entry

router.route('/:username')
  //Check if the user exists 
  .post((req,res)=>{
    User
      .find({username:req.params.username})
      .count()
      .then(result=>{
        if(result<1){
          //res.status(400).send(`A user,${req.params.username}, does not exists.`);
          res.status(400).json({
            reason: `A user,${req.params.username}, does not exists.`
          });
        }
      });
  //Check if the same title exists for the same user.
  	Destination
      .find({
        title: req.body.title, username:req.params.username
      })
      .count()
      .then(result=>{
        if(result>0){
          //Q: how to display the error message on client end?
          //res.status(500).send('so sorry');
          res.status(500).json({
            reason: 'Duplicate title detected under your account. Try using different title'
          });
        }
        let res_;
        Destination.create({
          username: req.params.username,
          title: req.body.title,
          destinations: req.body.destinations
        })
        .then(addedItem=>{
          res_ = addedItem;
          let saving_list = {
            id: addedItem._id,
            username: addedItem.username,
            title: addedItem.title
          };
          User.findOneAndUpdate(
            {username: addedItem.username},
            {$push: {savedLists: saving_list}},
            {new:true}/*,
            //Q: how to add below function, or not necessary?
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
          //return res.status(201).json(addedItem.serialize());
          return res.status(201).json(res_.serialize());
        });
      })
  });
  
/*
router.route('/:id')
*/
module.exports = {router};