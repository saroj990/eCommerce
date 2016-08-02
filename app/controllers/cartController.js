angular.module("cartController", []).
controller("cartCtrl", ["$scope", "localDbService", "$log",
    "$rootScope", "commonService", "productService",
    "cartService",
    function($scope, localDbService, $log, $rootScope, commonService, productService, cartService) {

        $scope.cartId = commonService.getLocalItem("cartId");
        var cartItems = [];
        $scope.totalCartItems = 0;

        var getCartItems = function(cartId) {
            localDbService.getCartItems(cartId).then(
                function(response) {
                    formatCartItems(response);
                },
                function(error) {
                    $log.error(error);
                })
        }

        getCartItems($scope.cartId);
        $scope.removeItem = function(id, index) {
            if (id) {
                localDbService.removeCartItem(id).then(function(response) {
                    $scope.cartItems.splice(index, 1)
                    $scope.totalCartItems--;
                    $rootScope.$broadcast('refreshCartElement', true);
                }, function(error) {

                })
            }
        }

        var formatCartItems = function(cartElement) {
            $scope.cartItems = [];
            var productId = "",
                quantity = 0,
                cartElementId;
            if (cartElement.length) {
                for (var i = 0; i < cartElement.length; ++i) {
                    productId = cartElement[i].productId;
                    quantity = cartElement[i].quantity;
                    cartElementId = cartElement[i].id;
                    productService.getProduct(cartElement[i].productId).then(function(response) {

                        var element = {
                            name: response.name,
                            id: cartElementId,
                            imageUrl: response.imageUrl,
                            productId: productId,
                            price: response.price,
                            quantity: quantity
                        };
                        $scope.cartItems.push(element);
                        $scope.reCalculateTotalPrice();

                    }, function(error) {

                    });
                }
            }
        }

        $scope.reCalculateTotalPrice = function() {
            var price = 0;
            if ($scope.cartItems.length) {
                for (i = 0; i < $scope.cartItems.length; i++) {
                    price = price + ($scope.cartItems[i].price * parseInt($scope.cartItems[i].quantity))
                }
                $scope.totalCartPrice = price;
            }
        }

        var initializeCartItems = function() {
            cartService.getTotalCartItemFromDB().then(
                function(response) {
                    $scope.totalCartItems = response
                },
                function(error) {
                    console.log(error);
                })
        }
        initializeCartItems();

    }
])
