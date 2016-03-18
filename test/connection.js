module.exports.connect = function Connection(serverUrl, done) {

    var socket = require('atmosphere.js');
    var Promise = require('es6-promise').Promise;
    var request;
    var sub;
    var resolveMessage;
    var rejectMessage;
    
    /**
     * This holds the Promsie for message recieved 
     */
    var onMessagePromise;
    
    
    onMessagePromise = new Promise(
        function(resolve, reject) {
            resolveMessage = resolve;
            rejectMessage = reject;
        });

    request = {
        url: serverUrl,
        contentType: "application/json",
        transport: 'websocket',
        fallbackTransport: 'long-polling'
    };

    request.onMessage = function(response) {
        console.log("Message recieved from server : " + response.responseBody);
        try {
            var message = JSON.parse(response.responseBody);
            if (message != null) {
                resolveMessage(message);
            } else {
                rejectMessage("Recieved Message is null!");
            }
        } catch (error) {
            rejectMessage(error);
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
                console.log("Message sent!");
            } else {
                try {
                    var strJson = JSON.stringify(msg);
                    if (strJson != null) {
                        sub.push(strJson);
                        console.log("Message sent!");
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

    }

    return {

        send: function(msg) {
            sendMessage(msg);
            return onMessagePromise;
        }

    }

};