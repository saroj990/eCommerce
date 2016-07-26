angular.module("productController", []).
controller("productCtrl", ["$scope", "$rootScope", "productService", "localDbService",
    function($scope, $rootScope, productService, localDbService) {

        $rootScope.cart_items = []
        $scope.product = {}

        $scope.displayMessage = function() {
            console.log("I am visible to everyone!!")
        }

        var getProducts = function() {
            productService.getProducts().then(function(response) {
                $scope.products = response.data

            })
        }

        $scope.addNewProduct = function() {
            localDbService.addNewProduct($scope.product).then(function(response) {
                if (response) {
                    console.log(" product added successfully!!")
                }
            }, function(error) {
                console.log(error)
            })

        }

        getProducts();

    }
]);
