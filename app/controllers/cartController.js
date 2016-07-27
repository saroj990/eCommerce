angular.module("cartController", []).
controller("cartCtrl", ["$scope", "localDbService", "$log", "$rootScope", function ($scope, localDbService, $log, $rootScope) {

  var cartItems = [];
  var getCartItems = function (cartId) {
    console.log(cartId);
    localDbService.getCartItems(cartId).then(
      function (response) {
        $scope.cartItems = response
      },
      function (error) {
        $log.error(error);
      })
  }
  getCartItems($rootScope.cartId);

  $scope.RemoveFromCart = function () {

  }
}])