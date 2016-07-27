angular.module("cartController", []).
controller("cartCtrl", ["$scope", "localDbService", "$log", "$rootScope", "commonService", "productService", function ($scope, localDbService, $log, $rootScope, commonService, productService) {

  $scope.cartId = commonService.getLocalItem("cartId");
  var cartItems = [];

  var getCartItems = function (cartId) {
    console.log(cartId);
    localDbService.getCartItems(cartId).then(
      function (response) {
        $log.info("Response from get cart item");
        $log.info(response);
        formatCartItems(response);
      },
      function (error) {
        $log.error(error);
      })
  }


  getCartItems($scope.cartId);

  $scope.RemoveFromCart = function () {

  }

  var formatCartItems = function (cartElement) {
    $scope.cartItems = [];
    var productId = "",
      quantity = 0;
    if (cartElement.length) {
      for (var i = 0; i < cartElement.length; ++i) {
        productId = cartElement[i].productId;
        quantity = cartElement[i].quantity;
        productService.getProduct(cartElement[i].productId).then(function (response) {
          console.log("cart controller");
          console.log(response);
          var element = {
            name: response.name,
            id: response.id,
            imageUrl: response.imageUrl,
            productId: productId,
            price: response.price,
            quantity: quantity
          };
          $scope.cartItems.push(element);
          console.log($scope.cartItems);

        }, function (error) {

        });
      }
    }
  }

  $scope.reCalculateTotalPrice = function (quantity) {
    var price = 0;
    if ($scope.cartItems.length) {
      for (i = 0; i < $scope.cartItems.length - 1; ++i) {
        price = price + ($scope.cartItems[i].price * $scope.cartItems[i].quantity)
      }
      $scope.totalCartPrice = price;
    }
  }

}])