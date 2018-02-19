'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;
chai.use(chaiHttp);

const {app} = require('../server.js');


describe('GET /', function(){
	it('should display index.html with status 200', function(){
		return chai.request(app)
		  .get('/')
		  .then(res=>{
	  		expect(res).to.have.status(200);
		  });
	});
});

/** /users **/
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

/** /destination **/
describe('GET /destination/find', function(){
	/** get all destination for all users

	req:

	res:
		json: array of all the destinations for all users.
	**/
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


