var Connection = require('./connection');
var MessageFactory = require('./message-factory');
var should = require('should');

describe("Atmosphere Neutrino Connection Testing", function() {
    var conn;
    
    before( function( done ) {
        conn = Connection.connect('http://localhost:8400/jupiter/neutrino',done);
    });


    it('Should send and recieve from Neutrino', function(done) {
        conn.send(
            
            {
                ver: 1,
                type: 'conn',
                msg: 'init',
                ts: 1457346216101,
                stat: 'act',
                dev: 'iPhone6777',
                os: 'iOS8.1',
                app: 'electron',
                brow: 'safari 6'
            }, done
        ).then(function(data) {
            //Assertions
            console.log( "Data recieved for Testing : " + JSON.stringify(data));
            data.ver.should.equal(1.0);
            MessageFactory.getConnInitMessaeg();
            done();
        }).catch(function(err) {
            console.log( "Error Occured during testing: " + err);
            should.fail();
            done();
        });

    })

});
