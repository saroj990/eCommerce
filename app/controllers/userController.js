angular.module("userController", []).
controller("userCtrl", ["$scope", "localDbService", "commonService", "$log", "$rootScope", "cartService",
    function($scope, localDbService, commonService, $log, $rootScope, cartService) {

        $scope.user = {};
        $scope.showLoginError = false;
        $scope.signIn = function() {
            localDbService.authenticateUser($scope.user).then(function(response) {
                    if (!response.length) {
                        $scope.showLoginError = true
                        return;
                    }
                    $scope.showLoginError = false;
                    createSession(response[0].id);

                    localDbService.checkIfCartExist(response[0].id).then(function(status) {
                        if (!status) {
                            debugger
                            createCart(currentUser());
                        }
                        commonService.redirectToUrl("/index");
                    }, function(error) {
                        $log.error(error);
                    });
                },
                function(error) {
                    $log.error(error);
                })
        }

        $scope.signUp = function() {
            localDbService.addUser($scope.user).then(
                function(response) {
                    commonService.redirectToUrl("/signIn");
                },
                function(error) {
                    $log.error(error);
                });
        };

        $scope.isSessionExist = function() {
            return commonService.getLocalItem('isAlive');
        }

        $scope.logOut = function() {
            commonService.deleteLocalItem('isAlive');
            commonService.deleteLocalItem('userId');
            commonService.deleteLocalItem('cartId');
            commonService.deleteLocalItem('productImported');
            localStorage.removeItem('productImported');
            $scope.totalCartItems = 0;
        }

        var createSession = function(userId) {
            commonService.setLocalItem("userId", userId);
            commonService.setLocalItem("isAlive", true);
        }

        var currentUser = function() {
            $scope.currentUser = commonService.getLocalItem("userId");
            return $scope.currentUser;
        }
        var createCart = function(userId) {
            $log.info("Before create cart:" + userId)
            localDbService.createCart(userId).then(function(cartId) {
                commonService.setLocalItem("cartId", cartId);
                $rootScope.cartId = cartId;
            }, function(error) {
                $log.error(error);
            });
        }

        var getTotalCartItem = function(cartId) {
            cartService.getTotalCartItemFromDB(cartId).then(function(response) {
                    $scope.totalCartItems = response
                },
                function(error) {
                    $log.error(error);
                });
        }

        var initializeCartItem = function() {
            var cartId = commonService.getLocalItem("cartId");
            if (cartId && currentUser()) {
                getTotalCartItem(cartId);
            } else {
                $scope.totalCartItems = 0;
            }
        }
        initializeCartItem();

        $rootScope.$on('refreshCartElement', function(args) {
            initializeCartItem();
        });
    }
])
