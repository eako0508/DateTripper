'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;
chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../server');
const { Destination } = require('../destination/models');
const { User } = require('../users/models');
const { TEST_DATABASE_URL } = require('../config');


function establishDestinationsDB(){
	//establish destinationDB
	const userStack = [];
	for(let i=0;i<10;i++){
		userStack.push({
			username: faker.name.firstName(),
			password: '123456789',
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		});
	}
	User.insertMany(userStack);

	const destinationStack = [];
	for(let i=0;i<10;i++){
		destinationStack.push({
			username: faker.name.findName(),
			title: faker.lorem.words(),
			destinations: {
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
			}
		},{
			username: faker.name.findName(),
			title: faker.lorem.words(),
			destinations: {
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
			}
		});
	}
	return Destination.insertMany(destinationStack);
}
function establishUsersDB(){
	//establish usersDB
	const userStack = [];
	for(let i=0;i<10;i++){
		userStack.push({
			username: faker.name.firstName(),
			password: '123456789',
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		});
	}
	return User.insertMany(userStack);
}
function tearDown(){
	return mongoose.connection.dropDatabase();
}


describe('First page', function(){
	it('should display index.html with status 200', function(){
		return chai.request(app)
		  .get('/')
		  .then(res=>{
	  		expect(res).to.have.status(200);
		  });
	});
});

describe('/Destination', function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return establishDestinationsDB();
	});
	afterEach(function(){
		return tearDown();
	});
	after(function(){
		return closeServer();
	});

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

// get all destination for userID
// req:endpoint, res:json-array of all the destinations for userID.
	describe('GET /api/destination/:userID', function(){
		/* REWORK with userID<--!!!
		it('should return all the saved dates for a designated user', function(){
			let resEntry;
			return chai.request(app)
				.get('/api/destination/')
				.then(res=>{
					expect(res).to.be.a('object');
					expect(res).to.have.status(200);

					res.body.forEach(obj=>{
						expect(obj).to.be.a('object');
						expect(obj).to.include.keys('username', 'title', 'destinations');
					});

					resEntry = res.body[0];
					return Destination.findById(resEntry._id);
				})
				.then(res=>{
					expect(res.username).to.be.equal(resEntry.username);
					expect(res.title).to.be.equal(resEntry.title);
					expect(res.destinations).to.deep.equal(resEntry.destinations);
				});
		});
		*/
	});

//Create a new list of destinations for a single user
//req:(username, title, DB), res: json-OK message
	describe('POST /api/destination/', function(){

		it('should add date to user\'s savedLists', function(){
			const entry = {
				username: faker.name.findName(),
				title: faker.lorem.words(),
				destinations: {
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
				}
			};
			//get a single user's id
			//add the date to the user's savedList
			let temp;
			let newID;
			//Q: return User vs return chai
			return User.findOne().then(res=>{	//res is list of the users
					temp = res.body[0];	//temp is now one of user
					return chai.request(app)
						.post(`/api/destination/${temp.username}`)
						.send(entry)
						.then(res=>{
							newID = res.body.id;
							expect(res).to.be.status(201);
							expect(res).to.be.a('object');
							expect(res.body).to.include.keys('username','title','destinations');
						});

				});
				//look for the same user again
				//and check if savedList array is updated with new entry
				
				//Q: how to query element in array?
				/*
				.User
					.find({savedLists: {"$in": [newID]}})
					.where('savedList').equals()
				*/
		});
		
	});
	
});

describe('/users', function(){
	/*
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return establishUsersDB();
	});
	afterEach(function(){
		return tearDown();
	});
	after(function(){
		return closeServer();
	});
	*/
	describe('GET /users:userID', function(){
		/**	get userID's information
		
		req:
			json: username

		res: 
			json for all destinations for userID.
		**/
	});
	describe('POST /users', function(){
		
		/**	Create an account

		req:
			json: username, password, firstName, lastName
		res: 
			json: username, firstName, lastName
		**/
	});
});

describe('/auth', function(){
	/*
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return establishDestinationsDB();
	});
	afterEach(function(){
		return tearDown();
	});
	after(function(){
		return closeServer();
	});
	*/

	/** /auth **/
	describe('POST /auth/login', function(){
		
		/**	login
		req: 
			json: username, password

		res: 
			json: token
		**/
	});
	describe('POST /auth/refresh', function(){
		
		/**	login
		req: 
			json: username, auth:token

		res: 
			json: token
		**/
	});
});