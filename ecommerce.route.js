angular.module("ecommerce.routes", ["ngRoute"]).
config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/index", {
      controller: "productCtrl",
      templateUrl: "app/partials/index.html"
    })
    .when("/cart", {
      controller: "cartCtrl",
      templateUrl: "app/partials/cart.html"
    })
    .when("/addNewProduct", {
      controller: "productCtrl",
      templateUrl: "app/partials/newProductForm.html"
    })
    .when("/signIn", {
      controller: "userCtrl",
      templateUrl: "app/partials/signIn.html"
    })
    .when("/signUp", {
      controller: "userCtrl",
      templateUrl: "app/partials/signUp.html"
    })
    .when("/cartItems", {
      controller: "cartCtrl",
      templateUrl: "app/partials/cart.html"
    })
    .otherwise({
      redirectTo: '/index'
    });
}])