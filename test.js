let request = require('supertest');
require('mocha');
let app = require('./routes').app;
let assert = require('chai').assert;
let ContactModel = require('./db').contactModel;

describe("Adding a contact", function() {
    it('should add a contact to the database and then delete it', function(done) {

        request(app)
            .post('/contacts')
            .send({ firstName: 'Bobby', lastName: 'Test', description: 'Un mec qui sert à tester' })
            .set('Accept', 'application/json')
            .end(function(err, res) {

            });

        request(app)
            .get('/contacts')
            .set('Accept', 'application/json')
            .end(function(err, res){
                assert.include(JSON.stringify(res.body), 'Un mec qui sert à tester');
                ContactModel.remove({description: 'Un mec qui sert à tester'}, (err, result) => {
                    if (err) { throw err }
                });
                done();
            });



    });
});