angular.module("cartService", []).factory("cartService", ["$http", "$q", "localDbService", "commonService", function($http, $q, localDbService, commonService) {

    var getTotalCartItemFromDB = function() {
        var deferred = $q.defer();
        var cartId = commonService.getLocalItem("cartId");
        if (!cartId) {
            deferred.resolve(0);
        } else {
            localDbService.getCartItems(cartId).then(function(response) {
                console.log("response received from cart service");
                console.log(response);
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    }

    return {
        getTotalCartItemFromDB: getTotalCartItemFromDB
    }
}])
