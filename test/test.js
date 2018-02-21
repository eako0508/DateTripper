'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;
chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../server');
const { router: usersRouter } = require('../users');
const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
const { router: destinationRouter } = require('../destination');
const { TEST_DATABASE_URL } = require('../config');


function establishDestinationsDB(){
	//establish destinationDB
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
			return chai.request(app)
				.get('/destination/find')
				.then(res=>{
					expect(res).to.have.status(200);

				});
		});
	});

	describe('GET /destination/find/:userID', function(){
		/** get all destination for userID

		req:
			
		res:
			json: array of all the destinations for userID.
		**/
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