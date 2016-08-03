/**​
 * @name common module 
 * @desc contains all the common functionality 
 * @createdOn 2/07/2015
 */
angular.module('commonService', []).
factory("commonService", ["localDbService", "$location", "$q", function(localDbService, $location, $q) {



    var setLocalItem = function(key, value) {
        localStorage.setItem(key, value);
    }


    var getLocalItem = function(key) {
        var value = localStorage.getItem(key)
        return value;
    }
    var redirectToUrl = function(url) {
        if (url) {
            $location.path(url)
        }
    }

    var deleteLocalItem = function(key) {
        localStorage.removeItem(key);
    }
    var isUserLoggedIn = function() {
        var userId = localStorage.getItem("userId");
        var isAlive = localStorage.getItem("isAlive");
        if (userId && isAlive) {
            return true;
        } else {
            return false
        }
    }

    return {
        setLocalItem: setLocalItem,
        getLocalItem: getLocalItem,
        redirectToUrl: redirectToUrl,
        deleteLocalItem: deleteLocalItem,
        isUserLoggedIn: isUserLoggedIn

    };

}]);
