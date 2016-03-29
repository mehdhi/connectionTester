module.exports.connect = function Connection(serverUrl, done) {

    var socket = require('atmosphere.js');
    var Promise = require('es6-promise').Promise;
    var MessageManager = require('./message-manager');
    var request;
    var sub;

    request = {
        url: serverUrl,
        contentType: "application/json",
        transport: 'websocket',
        fallbackTransport: 'long-polling'
    };

    request.onMessage = function(response) {
        
        try {
            var message = JSON.parse(response.responseBody);
            if (message != null) {
                //TODO Find error message
                var errorCondition = false;
                if ( !errorCondition ){
                    MessageManager.resolveMessage(message);
                } else {
                    MessageManager.rejectMessage(message);
                }   
                
            } else {                
                console.error("Message recieved from server is null or corrupted: " + response.responseBody);
            }
        } catch (error) {
            console.error("Message recieved cannot be parsed. Error : " + error 
            + "\n MessageBody : " + response.responseBody );
        }
    };

    request.onError = function(response) {
        console.log('Error : Cannot establish connection. Please make sure the targeted server is running.');
    };

    request.onOpen = function(response) {
        console.log("Succesfully connected to Neutrino Server");
        done();
    }

    sub = socket.subscribe(request);

    /**
     * Send Message on Active connection
     */
    function sendMessage(msg) {
        
        if (sub != null) {
            if (typeof msg == 'string') {
                sub.push(msg);
                console.log("Message sent! Message ID not found cannot return a promise.");
            } else {
                try {
                    var strJson = JSON.stringify(msg);
                    if (strJson != null) {
                        sub.push(strJson);
                        console.log("Message sent!");
                        return MessageManager.addToList(msg.messageId);
                    } else {
                        console.log("Sending failed! Message is null");
                    }
                } catch (error) {
                    console.log("Sending failed! Error : " + error);
                }

            }
        } else {
            console.log("Sending failed! Connection is not active!");
        }
        return null;
    }

    return {

        send: function(msg) {
            return sendMessage(msg);
        }

    }

};