angular.module("userController", []).
controller("userCtrl", ["$scope", "localDbService", "commonService", "$log", "$rootScope", function ($scope, localDbService, commonService, $log, $rootScope) {

  $scope.user = {};

  $scope.signIn = function () {
    localDbService.authenticateUser($scope.user).then(function (response) {
        $log.info("response");
        $log.info(response)
        if (!response.length) {
          return;
        }
        createSession(response[0].id);

        localDbService.checkIfCartExist(response[0].id).then(function (status) {
          $log.info("cartExist?:");
          $log.info(status);
          if (!status) {
            debugger
            createCart(currentUser());
          }
          commonService.redirectToUrl("/index");
        }, function (error) {
          $log.error(error);
        });
      },
      function (error) {
        $log.error(error);
      })
  }

  $scope.signUp = function () {
    localDbService.addUser($scope.user).then(
      function (response) {
        $log.info("user signed up successfully");
        commonService.redirectToUrl("/signIn");
      },
      function (error) {
        $log.error(error);
      });
  };

  $scope.isSessionExist = function () {
    return commonService.getLocalItem('isAlive');
  }

  $scope.logOut = function () {
    commonService.deleteLocalItem('isAlive');
    commonService.deleteLocalItem('userId');
    commonService.deleteLocalItem('cartId');
    commonService.deleteLocalItem("productImported")
  }

  var createSession = function (userId) {
    commonService.setLocalItem("userId", userId);
    commonService.setLocalItem("isAlive", true);
  }

  var currentUser = function () {
    $scope.currentUser = commonService.getLocalItem("userId");
    return $scope.currentUser;
  }
  var createCart = function (userId) {
    $log.info("Before create cart:" + userId)
    localDbService.createCart(userId).then(function (cartId) {
      console.log("create cart");
      console.log(cartId);
      commonService.setLocalItem("cartId", cartId);
      $rootScope.cartId = cartId;
    }, function (error) {
      $log.error(error);
    });
  }
  var getTotalCartItem = function (cartId) {
    localDbService.getTotalCartItem(cartId).then(function (response) {
        $scope.totalCartItems = response
      },
      function (error) {
        $log.error(error);
      });
  }
  var cartId = commonService.getLocalItem("cartId")
  if (cartId) {
    getTotalCartItem(cartId);
  }

}])