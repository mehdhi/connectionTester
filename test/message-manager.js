module.exports = (function MessageManager() {
    var Promise = require('es6-promise').Promise;
    var waitingList;
    var resolveMessageList;
    var rejectMessageList;


    if (!waitingList) waitingList = [];
    if (!resolveMessageList) resolveMessageList = [];
    if (!rejectMessageList) rejectMessageList = [];


    function removeFromList(messageId) {
        delete waitingList[messageId];
        delete resolveMessageList[messageId];
        delete rejectMessageList[messageId];
    }

    return {

        addToList: function(message) {

            if (message) {
                try {
                    if (message.id) {
                        waitingList[message.id] = new Promise(
                            function(resolve, reject) {
                                resolveMessageList[message.id] = resolve;
                                rejectMessageList[message.id] = reject;
                            });
                        console.info("Message with ID : " + message.id + " added to tracking list");
                        return waitingList[message.id];
                    } else {
                        console.warn("Message ID is missing. Cannot add to waitingList");
                        return new Promise.reject("Message ID is missing, cannot be tracked");
                    }
                } catch (error) {
                    console.warn("Message cannot be tracked. " + error );
                    return new Promise.reject("Message cannot be tracked. " + error);
                }


            } else {
                console.warn("Message is null. Cannot add to waitingList");
                return new Promise.reject("Message is null, cannot be tracked");
            }

        },

        resolveMessage: function(message) {

            if (message) {
                if (message.id) {
                    var resolve = resolveMessageList[message.id];
                    if (resolve) {
                        resolve(message);
                        removeFromList(message.id);
                    } else {
                        console.warn("Message with messageId : " + message.id + "was not found in list!"
                            + "\nMessageBody : " + JSON.stringify(message));
                    }
                } else {
                    console.error("Message ID is missing. Cannot be resolved \nMessageBody : " + JSON.stringify(message));
                }

            } else {
                console.warn("Message is null. Cannot be resolved");
            }



        },

        rejectMessage: function(message) {

            var reject = rejectMessageList[message.id];
            if (reject) {
                reject(message);
                removeFromList(message.id);
            } else {
                console.warn("Message with id : " + message.id + "was not found in list!"
                    + "\nMessageBody : " + response.responseBody);
            }

        }
    }
})();



