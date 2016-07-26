angular.module('errorHandler', []).
factory("errorHandler", ["$log", function($log) {

    //common error handler
    var handleError = function(error) {
        $log.error("Error:" + error);
    };


    return {
        handleError: handleError,


    };

}]);
