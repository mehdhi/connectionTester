module.exports = ( function MessageManager() {
    var Promise = require('es6-promise').Promise;
    var waitingList;
    var resolveMessageList;
    var rejectMessageList;

    function removeFromList(messageId) {
        delete waitingList[messageId];
        delete resolveMessageList[messageId];
        delete rejectMessageList[messageId];
    }

    return {

        addToList: function(messageId) {
            waitingList[messageId] = new Promise(
                function(resolve, reject) {
                    resolveMessageList[messageId] = resolve;
                    rejectMessageList[messageId] = reject;
                });
            return waitingList[messageId];
        },

        resolveMessage: function(message) {

            var resolve = resolveMessageList[message.messageId];
            if (resolve) {
                resolve(message);
                removeFromList(message.messageId);
            } else {
                console.warn("Message with messageId : " + message.messageId + "was not found in list!"
                    + "\nMessageBody : " + response.responseBody);
            }

        },

        rejectMessage: function(message) {

            var reject = rejectMessageList[message.messageId];
            if (reject) {
                reject(message);
                removeFromList(message.messageId);
            } else {
                console.warn("Message with messageId : " + message.messageId + "was not found in list!"
                    + "\nMessageBody : " + response.responseBody);
            }

        }
    }
}
)();



