/**​
 * @name common module 
 * @desc contains all the common functionality 
 * @createdOn 2/07/2015
 */
angular.module('commonService', []).
factory("commonService", ["localDbService", "$location", function(localDbService, $location) {

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
        debugger
        localStorage.removeItem('isAlive');
    }

    return {
        setLocalItem: setLocalItem,
        getLocalItem: getLocalItem,
        redirectToUrl: redirectToUrl,
        deleteLocalItem: deleteLocalItem
    };

}]);
