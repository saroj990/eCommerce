angular.module("cartController", []).
controller("cartCtrl", ["$scope", "localDbService", "$log", "$rootScope", "commonService", "productService", function($scope, localDbService, $log, $rootScope, commonService, productService) {

    $scope.cartId = commonService.getLocalItem("cartId");
    var cartItems = [];

    var getCartItems = function(cartId) {
        debugger;
        console.log(cartId);
        localDbService.getCartItems(cartId).then(
            function(response) {
                $log.info("Response from get cart item");
                $log.info(response);
                formatCartItems(response);
            },
            function(error) {
                $log.error(error);
            })
    }


    getCartItems($scope.cartId);

    $scope.removeItem = function(id,index) {
        debugger
        if(id){
            localDbService.removeCartItem(id).then(function(response){
                $scope.cartItems.splice(index,1)
                --$rootScope.totalCartItems;
            },function(error){

            })
        }
    }

    var formatCartItems = function(cartElement) {
        debugger
        $scope.cartItems = [];
        var productId = "",
            quantity = 0,cartElementId;
        if (cartElement.length) {
            for (var i = 0; i < cartElement.length; ++i) {
                productId = cartElement[i].productId;
                quantity = cartElement[i].quantity;
                cartElementId = cartElement[i].id;
                productService.getProduct(cartElement[i].productId).then(function(response) {
                    console.log("cart controller");
                    console.log(response);
                    var element = {
                        name: response.name,
                        id: cartElementId,
                        imageUrl: response.imageUrl,
                        productId: productId,
                        price: response.price,
                        quantity: quantity
                    };
                    $scope.cartItems.push(element);
                    console.log("========= cart items ========")
                    console.log($scope.cartItems);
                    $scope.reCalculateTotalPrice();

                }, function(error) {

                });
            }
        }
    }

    $scope.reCalculateTotalPrice = function() {
        debugger;
        var price = 0;
        if ($scope.cartItems.length) {
            console.log("total cart item");
            console.log($scope.cartItems.length);
            for (i = 0; i < $scope.cartItems.length ; i++) {
                price = price + ($scope.cartItems[i].price * parseInt($scope.cartItems[i].quantity))
            }
            debugger
            $scope.totalCartPrice = price;
        }
    }

    var initializeCartItems = function(){
      commonService.initializeTotalCartItems().then(
        function(response){
          console.clear();
          console.log("cart controller initializeCartItems");
          console.log(response);
          $rootScope.totalCartItems = response
      },function(error){
        console.log(error);
      })
    }

    initializeCartItems();
}])
