angular.module("productController", []).
controller("productCtrl", ["$scope", "$rootScope", "productService", "localDbService", "commonService", "$log",
    function ($scope, $rootScope, productService, localDbService, commonService, $log) {

    $scope.product = {}
    $rootScope.totalCartItems = 0;

    var getProducts = function () {
      productService.getProducts().then(function (response) {
        $scope.products = response.data

      })
    }

    $scope.addNewProduct = function () {
      localDbService.addNewProduct($scope.product).then(
        function (response) {
          if (response) {
            $log.info(" product added successfully!!");
            commonService.redirectToUrl("/index");
          }
        },
        function (error) {
          $log.error(error);
        });
    }

    $scope.addToCart = function (productId, userId) {
      localDbService.creatCartLineItem($rootScope.cartId, productId).then(
        function (response) {
          $log.info("item added to cart");
          $rootScope.totalCartItems += 1;
        },
        function (error) {
          $log.error(error);
        })
    };

    getProducts();

    }
]);