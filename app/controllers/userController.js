angular.module("userController", []).
controller("userCtrl", ["$scope", "localDbService", "commonService", "$log", "$rootScope", function ($scope, localDbService, commonService, $log, $rootScope) {

  $scope.user = {};

  $scope.signIn = function () {
    localDbService.authenticateUser($scope.user).then(
      function (response) {
        createSession(response[0].id);

        localDbService.checkIfCartExist(response[0].id).then(function (cartId) {
          if (!cartId) {
            createCart($scope.currentUser);
          }
        })
        commonService.redirectToUrl("/index");
      },
      function (error) {
        $log.error(error);
      })
  }

  $scope.signUp = function () {
    localDbService.addUser($scope.user).then(
      function (response) {
        $log.info("user signed up successfully")
        createSession(response);
        commonService.redirectToUrl("/index");
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
    localDbService.createCart(userId).then(function (cartId) {
      $rootScope.cartId = cartId;
    }, function (error) {
      $log.error(error);
    });
  }

}])