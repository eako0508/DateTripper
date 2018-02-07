'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const {app} = require('../server.js');

describe('Server running test', function(){
	describe('Is the server running', function(){
		it('should display index.html with status 200', function(){
			return chai.request(app)
			  .get('/')
			  .then(res=>{
		  		expect(res).to.have.status(200);
			  });
		});
	});
});