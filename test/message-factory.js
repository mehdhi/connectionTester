module.exports = (function (){
    
    var init = "hi";
    var end = "bye";
    
    return {
        
        getConnectionInitMessage : function () {
            return init;
        },
        
        getConnectionEndMessage : function () {
            return end;
        }
        
       
    }

})();