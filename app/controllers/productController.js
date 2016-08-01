angular.module("productController", []).
controller("productCtrl", ["$scope", "$rootScope", "productService", "localDbService", "commonService", "$log","$routeParams",
    function ($scope, $rootScope, productService, localDbService, commonService, $log,$routeParams) {

    $scope.product = {}
    $rootScope.totalCartItems = 0;

    var getProducts = function () {
      productService.getProductsFromDB().then(function (response) {
        $scope.products = response;
      })
    }

    var initializeCartItems = function(){
      commonService.initializeTotalCartItems().then(
        function(response){
          $rootScope.totalCartItems = response
      },function(error){
        console.log(error);
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
      debugger;
      localDbService.creatCartLineItem($rootScope.cartId, productId).then(
        function (response) {
          debugger;
          console.clear();
          $log.info("item added to cart");
          ++$rootScope.totalCartItems;
        },
        function (error) {
          $log.error(error);
        })
    };

    var addSampleProducts = function () {
      if (!commonService.getLocalItem("productImported")) {
        productService.addSampleProduct().then(function (response) {
          $log.info("products were added successfully!!")
          commonService.setLocalItem("productImported", true);
        }, function (error) {
          $log.error(error);
        })
      }
    }
    addSampleProducts();
    getProducts();
    initializeCartItems();

    }]);