'use strict';
const express = require('express');
const {Destination} = require('./models');
const config = require('../config');
const router = express.Router();
const bodyParser = require('body-parser');
const {User} = require('../users');
var ObjectId = require('mongoose').Types.ObjectId;

router.use(bodyParser.json());
//  GET /
//  res: all user's saved destinations in detail 200

//  GET /all/:username
//  res: all username's saved destinations in detail 200

//  GET /user/:username
//  res: brief user's list 200

//  GET /:id
//  res: list of destinations 200

//  PUT /
//  need: json({title})
//  res: updated data 200

//  POST /:username
//  need: json({username, title, destinations})
//  res: posted data 201

//  DELETE /:id
//  need: json({title})
//  res: 200




//  GET /
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


//  GET /all/:username
router.route('/all/:username')
  
  .get((req,res)=>{
    /*
    if(req.user.username!=req.params.username){
      res.status(403).send('Unauthorized');
    }
    */
  	Destination.find({
  		username: req.params.username
  	}).then(entries=>{
  		res.status(200).json(entries.map(entry=>entry.serialize()));
      //res.status(200).json(entries);
  	}).catch((err)=>{
  		console.error(err);
  		res.status(500).send('User not found.');
  	});
  });

//  GET /user/:username
router.route('/user/:username')
  .get((req,res)=>{
    /*
    if(req.user.username!=req.params.username){
      res.status(403).send('Unauthorized to view other user\'s list.');

    }
    */
    return User.find({username: req.params.username})
      .then(users => res.json(users.map(user => user.serialize())))
      .catch(err => res.status(500).json({message: 'Internal server error'}));
  });
/*
if(req.user.username!=result.username){
          res.status(403).send(`${req.user.username}, ${result}, ${x}`);
        }
*/
//  GET /:id
router.route('/:id')
  .get((req,res)=>{
    Destination.find({_id: req.params.id})
      .then(result=>{
        res.status(200).json(result.map(entry=>entry.serialize()));
      })
      .catch(err=>{
        console.error(err);
        res.status(500).send('Server Error');
      });
  });





// PUT
router.route('/')
  .put((req,res)=>{
    Destination.findOneAndUpdate(
      {$and: [{username: req.body.username}, {title: req.body.title}]},
      //{$and: [{username: req.user.username}, {title: req.body.title}]},
      {$set: {
        destinations: req.body.destinations
      }},
      {new: true}
      )
      .then(updated=>{
        console.log(updated);
        /*
        User.findOneAndUpdate(
            {$and: {username: addedItem.username,savedLists.title:req.body.title}},
            {savedLists.$.title: },
            {new:true}
          )
        */
        res.status(200).json(updated.serialize());
      })
      .catch(err=>{
        console.error(err);
        res.status(500).send('Server Error on PUT');
      })
  })
/*
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
  */



//  POST /addDate:username
//  Strategy
//check if the user exists
//check if the same title exists
//if not, create an entry

router.route('/:username')
  //Check if the user exists 
  .post((req,res)=>{
    /*
    if(req.params.username != req.user.username){
      res.status(400).json({
        reason: `Username does not match.`
      });
    }
    */
  //Check if the same title exists for the same user.
  	Destination
      .find({
        title: req.body.title, username:req.params.username
      })
      .count()
      .then(result=>{
        if(result>0){
          return res.status(409).json({
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
router.route('/:id')
  .delete((req, res)=>{
    //find title and see if username matches
    return Destination
      .find({_id:req.params.id})
      .then(target=>{
        /*
        if(target[0].username!=req.user.username){
          res.status(403).send('Unauthorized');
          next();
        }
        */
        return Destination
          .remove({_id:req.params.id})
          .then(()=>{
            return User.findOneAndUpdate(
              {"savedLists.id": new ObjectId(req.params.id)},
              {"$pull": 
                {"savedLists":
                  {"id": new ObjectId(req.params.id)}
                }
              }              
            )
            .then(()=>{              
              res.status(200).json({id: req.params.id});
            })
            .catch(err=>{
              console.error(err);
              res.status(500).send('Server Error');
            });            
          });
      });
  });

//db.users.findOneAndUpdate({"savedLists.title": "test1"},{"$pull": {"savedLists": {"id": ObjectId("5a8f090e017b311c96e9d906")}}});
//  Delete All
/*
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
*/
module.exports = {router};