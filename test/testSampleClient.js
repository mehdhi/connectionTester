var Connection = require('./connection');
var should = require('should');

describe("Atmosphere Neutrino Connection Testing", function() {
    var conn;
    
    before( function( done ) {
        conn = Connection.connect('http://localhost:8400/jupiter/neutrino',done);
        // conn = Connection.connect('ws://echo.websocket.org',done);
    });


    it('Should send and recieve from Neutrino', function(done) {
        this.timeout(5000);
        conn.send(
            
            {
                id: 12515,
                ver: 1,
                type: 'conn',
                msg: 'init',
                ts: 1457346216101,
                stat: 'act',
                dev: 'iPhone6777',
                os: 'iOS8.1',
                app: 'electron',
                brow: 'safari 6'
            }
        ).then(function(data) {
            //Assertions
            console.log( "Data recieved for Testing : " + JSON.stringify(data));
            data.ver.should.equal(1.0);
           
            done();
        }).catch(function(err) {
            console.log( "Error Occured during testing: " + err);
            should.fail();
            done();
        });

    })

});
