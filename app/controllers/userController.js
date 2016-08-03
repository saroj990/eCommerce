angular.module("userController", []).
controller("userCtrl", ["$scope", "localDbService", "commonService", "$log", "$rootScope", "cartService",
    function($scope, localDbService, commonService, $log, $rootScope, cartService) {

        $scope.user = {};
        $scope.showLoginError = false;
        $scope.signIn = function() {
            localDbService.authenticateUser($scope.user).then(function(response) {
                    console.log(response)
                    if (!response) {
                        $scope.showLoginError = true
                        return;
                    }
                    $scope.showLoginError = false;
                    createSession(response.id);
                    var userId = getUserId();

                    localDbService.checkIfCartExist(response.id).then(function(status) {
                        if (!status && userId) {
                            createCart(userId);
                            getUserInfo();
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
            commonService.deleteLocalItem('importComplete');
            localStorage.removeItem('importComplete');
            $scope.totalCartItems = 0;
        }

        var createSession = function(userId) {
            commonService.setLocalItem("userId", userId);
            commonService.setLocalItem("isAlive", true);
        }

        var getUserId = function() {
            return commonService.getLocalItem("userId");
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
            localDbService.getCartItems(cartId).then(function(response) {
                    console.log("user controller get total cart item");
                    console.log(response);
                    if (response.length) {
                        $scope.totalCartItems = response.length
                    }
                },
                function(error) {
                    $log.error(error);
                });
        }

        var initializeCartItem = function() {
            debugger
            var cartId = commonService.getLocalItem("cartId");
            if (cartId && getUserId()) {
                getTotalCartItem(cartId);
            } else {
                $scope.totalCartItems = 0;
            }
        }

        var getUserInfo = function() {
            var userId = commonService.getLocalItem("userId");
            if (!userId) {
                return
            }

            localDbService.findItemById("users", userId).then(function(user) {
                $scope.currentUser = user;
                initializeCartItem();

            }, function(error) {
                console.log(error);
            })
        }

        getUserInfo();

        $rootScope.$on('refreshCartElement', function(args) {
            initializeCartItem();
        });
    }
])
