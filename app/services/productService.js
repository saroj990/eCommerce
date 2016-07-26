angular.module('productService', []).
factory("productService", ["$http", function($http) {

    var getProducts = function() {
        return $http.get("app/database/product.json")
    }

    return {
        getProducts: getProducts
    }
}]);
