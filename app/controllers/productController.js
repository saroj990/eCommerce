angular.module("productController", []).
controller("productCtrl", ["$scope", "$rootScope", "productService", "localDbService", "commonService", "$log", "$routeParams", "cartService",
    function($scope, $rootScope, productService, localDbService, commonService, $log, $routeParams, cartService) {

        $scope.product = {}

        var getProducts = function() {
            productService.getProductsFromDB().then(function(response) {
                $scope.products = response;
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
            var cartId = commonService.getLocaItem('cartId');
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
            if (!localStorage.getItem("productImported")) {
                productService.addSampleProduct().then(function(response) {
                    $log.info("products were added successfully!!")
                    commonService.setLocalItem("productImported", true);
                }, function(error) {
                    $log.error(error);
                })
            }
        }

        addSampleProducts();
        getProducts();
        initializeCartItems();

    }
]);
