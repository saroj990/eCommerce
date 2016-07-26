angular.module("userController", []).
controller("userCtrl", ["$scope", "localDbService", "commonService", function($scope, localDbService, commonService) {

    $scope.user = {};

    $scope.signIn = function() {
        localDbService.authenticateUser($scope.user).then(
            function(response) {
                console.log("received from authenticateUser");
                commonService.setLocalItem("isAlive", true);
                console.log(response);
                commonService.redirectToUrl("/index");
            },
            function(error) {
                console.log(error)
            })
    }

    $scope.signUp = function() {
        debugger
        localDbService.addUser($scope.user).then(
            function(response) {
                console.log("user added successfully!!");
            },
            function(error) {
                console.log("There are some errors");
            });
    };
    $scope.isSessionExist = function() {
        console.log(commonService.getLocalItem('isAlive'))
        return commonService.getLocalItem('isAlive');
    }
    $scope.logOut = function() {
        debugger
        commonService.deleteLocalItem('isAlive');
    }
}])
