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
	const destinationStack = [];
	for(let i=0;i<10;i++){
		destinationStack.push({
			//Q: 
			//_id: faker.random.number(),
			//id: faker.random.number(),
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
			//_id: faker.random.alphaNumeric(),
			//id: faker.random.number(),
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

	/** /destination **/
	describe('GET /destination/find', function(){
		/** get all destination for all users

		req:

		res:
			json: array of all the destinations for all users.
		**/
		it('should return all the saved dates for every users', function(){
			let res;
			return chai.request(app)
				.get('/destination/find')
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

	describe('GET /destination/find/:userID', function(){
		/** get all destination for userID

		req:
			
		res:
			json: array of all the destinations for userID.
		**/
		it('should return all the saved dates for a designated user', function(){
			let resEntry;
			return chai.request(app)
				.get('/destination/find/')
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
	});

	describe('POST /destination/addDate', function(){
		/**
		Create a new list of destinations for a single user
		
		req:
			username, title, DB
		res: 
			json: OK message
		**/
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