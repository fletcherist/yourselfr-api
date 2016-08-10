const should = require('should')
const chai = require('chai')
const supertest = require('supertest-as-promised')
const server = supertest.agent("http://localhost:80")

let expect = chai.expect

const s = 
describe('(Method) Users -> getUser', () => {
	it('Should return user object', (done) => {
		server
		.get('/api/users/asd')
		.expect(200)
		.end((err, res) => {
			should(res.body).be.an.Object()
			done()
		})
	})
})

module.exports = s