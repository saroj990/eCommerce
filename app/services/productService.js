angular.module('productService', []).
factory("productService", ["$http", "localDbService", "$log", "$q", function ($http, localDbservice, $log, $q) {

  var getProducts = function () {
    return $http.get("app/database/product.json")
  }

  var addSampleProduct = function () {
    var deferred = $q.defer();
    getProducts().then(function (response) {
      localDbservice.addSampleProducts(response.data).then(
        function (response) {
          deferred.resolve(response);
        },
        function (error) {
          deferred.reject(error)
          $log.error(error);
        });
    }, function (error) {
      deferred.reject(error)
      $log.error(error);
    })
    return deferred.promise;
  }

  var getProduct = function (id) {
    var deferred = $q.defer();
    localDbservice.getProduct(id).then(
      function (response) {
        console.log("product service");
        console.log(response);
        debugger
        deferred.resolve(response);
      },
      function (error) {
        deferred.reject(error);
      })
    return deferred.promise;
  }

  return {
    addSampleProduct: addSampleProduct,
    getProducts: getProducts,
    getProduct: getProduct
  }
}]);