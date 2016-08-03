angular.module("productController", []).
controller("productCtrl", ["$scope", "$rootScope", "productService", "localDbService", "commonService", "$log", "$routeParams", "cartService", "$timeout",
    function($scope, $rootScope, productService, localDbService, commonService, $log, $routeParams, cartService, $timeout) {

        $scope.product = {}

        var getProducts = function() {
            productService.getProductsFromDB().then(function(response) {
                $scope.products = response;
                $rootScope.$broadcast('refreshCartElement', true);
            })
        }

        var initializeCartItems = function() {
            cartService.getTotalCartItemFromDB().then(
                function(response) {
                    $rootScope.$broadcast('refreshCartElement', true);
                },
                function(error) {
                    console.log(error);
                })
        }

        $scope.addNewProduct = function() {
            localDbService.addNewProduct($scope.product).then(
                function(response) {
                    if (response) {
                        $log.info(" product added successfully!!");
                        commonService.redirectToUrl("/index");
                    }
                },
                function(error) {
                    $log.error(error);
                });
        }

        $scope.addToCart = function(productId, userId) {
            var cartId = commonService.getLocalItem('cartId');
            if (!cartId) {
                return
            }

            localDbService.creatCartLineItem(cartId, productId).then(
                function(response) {
                    $rootScope.$broadcast('refreshCartElement', true);
                },
                function(error) {
                    $log.error(error);
                })
        };

        var addSampleProducts = function() {
            if (!localStorage.getItem("importComplete")) {
                productService.addSampleProduct().then(function(response) {
                    $log.info("products were added successfully!!")
                    commonService.setLocalItem("importComplete", true);
                }, function(error) {
                    $log.error(error);
                })
            }
        }

        addSampleProducts();
        getProducts();
        $timeout(function() {
            getProducts();
        }, 5000)

    }
]);
