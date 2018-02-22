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


//  GET /user/:username
router.route('/user/:username')
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

//  GET /title/:title
router.route('/title/:title')
  .get((req,res)=>{
    Destination.find({title:req.params.title})
      .then(result=>{
        res.status(200).json(entries.map(entry=>entry.serialize()));
      })
      .catch(err=>{
        console.error(err);
        res.status(500).send('Server Error');
      });
  });

// PUT
router.route('/:id')
  .put((req,res)=>{
    Destination.findOneAndUpdate(
      {_id: req.params.id},
      {$set: {
        title: req.body.title,
        destinations: req.body.destinations
      }},
      {new: true}
      )
      .then(updated=>{
        res.status(200).json(updated.serialize());
      })
      .catch(err=>{
        console.error(err);
        res.status(500).send('Server Error on PUT');
      })
  })



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
          return res.status(500).json({
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
            {new:true}
          )
          .catch(err => {
            console.error(err);
            res.status(500).send('Server error');
          });
          res.status(201).json(res_.serialize());
        });
      })
  });
  

//  DELETE /:id
//  Strategy
// pre-requisite: remove from user's savedLists
/*
router.route('/:id')
  .delete((req, res)=>{
    Destination
      .remove({id:req.params.title})
      .then(res.status(201).send('Successfully removed a date.'))
      .catch(err=>{
        console.error(err);
        res.status(201).send('Server Error');
      });
  });
  */

router.route('/')
  .delete((req, res)=>{
    Destination
      .remove({title:req.body.title})
      .then(()=>{
        User.findOneAndUpdate(
          {"savedLists.title": req.body.title},
          {"$pull": 
            {"savedLists":
              {"title": req.body.title}
            }
          }
        )
        .catch(err=>{
          console.error(err);
          res.status(500).send('Server Error');
        });

        res.status(200).send('Successfully removed a date.');
      });
  });

//db.users.findOneAndUpdate({"savedLists.title": "test1"},{"$pull": {"savedLists": {"id": ObjectId("5a8f090e017b311c96e9d906")}}});
//  Delete All
router.route('/')
  .delete((req,res)=>{
    Destination
      .remove({})
      .then(res.status(200).send('Successfully removed all dates.'))
      .catch(err=>{
        console.error(err);
        res.status(500).send('Server Error');
      });
  });

module.exports = {router};