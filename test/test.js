'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const expect = chai.expect;
chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../server');
const { Destination } = require('../destination/models');
const { User } = require('../users/models');
const { TEST_DATABASE_URL } = require('../config');


function generateDestinationStack(username_){
	const destinationStack = [];

	for(let i=0;i<2;i++){
		destinationStack.push({
			username: username_,
			title: faker.lorem.words(),
			destinations: [{
				id: faker.random.number(),
				name: faker.name.findName(),
				place_id: faker.random.number(),
				location: {
					lat: faker.random.number(),
					lng: faker.random.number(),
				},
				photos_large: 'https://some-url/'+faker.random.word()+faker.random.number(),
				photos_small: 'https://some-url/'+faker.random.word()+faker.random.number(),
				hours: [
					faker.random.words(),
					faker.random.words(),
					faker.random.words(),
					faker.random.words(),
					faker.random.words(),
					faker.random.words(),
					faker.random.words()
				]
			},{
				id: faker.random.number(),
				name: faker.name.findName(),
				place_id: faker.random.number(),
				location: {
					lat: faker.random.number(),
					lng: faker.random.number(),
				},
				photos_large: 'https://some-url/'+faker.random.word()+faker.random.number(),
				photos_small: 'https://some-url/'+faker.random.word()+faker.random.number(),
				hours: [
					faker.random.words(),
					faker.random.words(),
					faker.random.words(),
					faker.random.words(),
					faker.random.words(),
					faker.random.words(),
					faker.random.words()
				]
			}]
		});
	}
	return destinationStack;
}

function establishDB(){
	//establish destinationDB
	const userStack = [];
	
	for(let i=0;i<10;i++){
		let user_ = {
			username: faker.name.firstName(),
			password: '123456789',
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		};
		let destStack = generateDestinationStack(user_.username);
		user_.savedLists = destStack;
		userStack.push(user_);
		Destination.insertMany(destStack);
	}
	return User.insertMany(userStack);
}

function tearDown(){
	return mongoose.connection.dropDatabase();
	//return mongoose.connection.dropCollection('datetripper-test');
}

/*
describe('First page', function(){
	it('should display index.html with status 200', function(){
		return chai.request(app)
		  .get('/')
		  .then(res=>{
	  		expect(res).to.have.status(200);
		  });
	});
});
*/
describe('/Destination', function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return establishDB();
	});
	afterEach(function(){
		return tearDown();
	});
	after(function(){
		return closeServer();
	});

/*
	
// get all destination for all users
// req:endpoint, res:json-array of all the destinations for all users.
	describe('GET /api/destination', function(){
		it('should return all the saved dates for every users', function(){
			
			let res;
			return chai.request(app)
				.get('/api/destination')
				.then(_res=>{
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body.length).to.be.at.least(1);
					return Destination.count();
				})
				.then(count=>{
					expect(res.body).to.have.lengthOf(count);
				});
			
		});
	});
	
	//dest result vs get result
	describe('GET /api/destination/all/:username', function(){		
		it('should return all the saved dates for a designated user', function(){
			
			let destResult;
			return Destination.findOne().then(destResult_=>{
				destResult = destResult_;
				return chai.request(app)
				  .get(`/api/destination/all/${destResult.username}`)
				  .then(apiResult=>{
				  	expect(apiResult).to.be.status(200);
				  	expect(apiResult).to.be.a('object');
				  	apiResult.forEach(item=>{
				  		expect(item).to.include.keys('username', 'title', 'savedLists');
				  	});				  	
				  })
				  .catch(err=>{
				  	console.error(err);
				  });
			});
		});
	});

// get all destination for userID
// req:endpoint, res:json-array of all the destinations for userID.

	describe('GET /api/destination/user/:username', function(){
		it('should return short version of the user\'s saved dates', function(){
			return User.findOne().then(resUser_=>{
				let resUser = resUser_;
				console.log(resUser);
				console.log("resUser");
				return Destination.findOne({username: resUser.username})
					.then(theone=>{
						return chai.request(app)
							.get(`/api/destination/user/${resUser.username}`)
							.then(apiResult=>{
								expect(apiResult).to.be.a('object');
								expect(apiResult).to.have.status(200);
								apiResult.body.forEach(obj=>{
									expect(obj).to.be.a('object');
									expect(obj).to.include.keys('username', 'savedLists');
								});
							})
							.catch(err=>{
								console.error(err);
							});
					});
			});
		});
	});
	
//Create a new list of destinations for a single user
//req:(username, title, DB), res: json-OK message
	describe('POST /api/destination/', function(){

		it('should add date to user\'s savedLists', function(){
			
			//get a single user's id
			//add the date to the user's savedList
			let temp;
			let newID;
			//Q: return User vs return chai
			return User.findOne().then(res=>{	//res is list of the users
				temp = res;
				
				const entry = {
					username: temp.username,
					title: faker.lorem.words(),
					destinations: [{
						id: faker.random.number(),
						username: temp.username,
						place_id: faker.random.number(),
						location: {
							lat: faker.random.number(),
							lng: faker.random.number(),
						},
						photos_large: 'https://some-url/'+faker.random.word()+faker.random.number(),
						photos_small: 'https://some-url/'+faker.random.word()+faker.random.number(),
						hours: [
							faker.random.words(),
							faker.random.words(),
							faker.random.words(),
							faker.random.words(),
							faker.random.words(),
							faker.random.words(),
							faker.random.words()
						]
					}]
				};
				return chai.request(app)
					.post(`/api/destination/${temp.username}`)
					.send(entry)
					.then(res=>{
						newID = res.body.id;
						expect(res).to.be.status(201);
						expect(res).to.be.a('object');
						expect(res.body).to.include.keys('username','title','destinations');
					})
					.catch(err=>{
						console.error(err);
					});

			});
			//look for the same user again
			//and check if savedList array is updated with new entry
			
		});
		
	});
	
*/
	describe('DELETE /api/destination/', function(){		
		it('should delete a user\'s savedList item with an id number', function(){			
			return Destination.findOne()
				.then(res=>{
					let targetID = res._id;
					let targetTitle = res.title;					
					return chai.request(app)
						.delete(`/api/destination/${targetID}`)
						.then(result=>{
							expect(result).to.have.status(200);
							return Destination.findOne({"destinations.id" : new ObjectId(targetID)})
								.count()
								.then(result_dest=>{
									expect(result_dest).to.be.equal(0);
									return User.find({"savedLists.id": new ObjectId(targetID)})
										.count()
										.then(result_user=>{
											expect(result_user).to.be.equal(0);
										})
										.catch(err=>{
											console.error(err);
										});
								})
								.catch(err=>{
									console.error(err);
								});						
						});
				});				
		});		
	});

	/*
	//	DELETE WITH TITLE
	describe('DELETE /api/destination/', function(){		
		it('should delete a user\'s savedList item', function(){			
			return User.findOne()
				.then(res=>{
					let targetItem = {
						title: res.savedLists[0].title
					}
					return chai.request(app)
						.delete(`/api/destination/`)
						.send(targetItem)
						.then(result=>{
							expect(result).to.have.status(200);
							Destination.findOne({title: targetItem.title})
								.count()
								.then(result_dest=>{
									expect(result_dest).to.be.equal(0);
								})
								.catch(err=>{
									console.error(err);
								})
							User.find({"savedLists.title": targetItem.title})
								.count()
								.then(result_user=>{
									console.log('result_user: '+result_user);
									expect(result_user).to.be.equal(0);
								})
								.catch(err=>{
									console.error(err);
								})
						});
				});

		});
		
	});
	*/
});