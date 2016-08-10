const should = require('should')
const chai = require('chai')
const supertest = require('supertest-as-promised')
const server = supertest.agent("http://localhost:80")

let expect = chai.expect

require('./users/getUser')