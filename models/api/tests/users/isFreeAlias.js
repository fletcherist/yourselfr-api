const should = require('should')
const chai = require('chai')
const supertest = require('supertest-as-promised')
const server = supertest.agent('http://localhost:80')

const s = 
describe('(Method) Users -> IsFreeAlias', () => {
	it('Should return if user alias is free or not', done => {
		server
		.get('/api/users/isfree/y97sdy87y09y2h38iughsddhsuh')
		.expect(200)
		.end((err, res) => {
			should(res.body).be.an.Object()
			res.body.status.should.be.eql(1)
			done()
		})
	})
})
