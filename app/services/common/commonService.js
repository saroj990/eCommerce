/**​
 * @name common module 
 * @desc contains all the common functionality 
 * @createdOn 2/07/2015
 */
angular.module('commonService', []).
factory("commonService", ["localDbService", "$location","$q", function (localDbService, $location,$q) {

  var setLocalItem = function (key, value) {
    localStorage.setItem(key, value);
  }

  var getLocalItem = function (key) {

    var value = localStorage.getItem(key)
    return value;
  }
  var redirectToUrl = function (url) {
    if (url) {
      $location.path(url)
    }
  }

  var deleteLocalItem = function (key) {
    localStorage.removeItem(key);
  }

  var initializeTotalCartItems = function(){
    var deferred =  $q.defer();
      var cartId = getLocalItem("cartId");
      if(!cartId){
        deferred.resolve(0);
      }
   
      localDbService.getTotalCartItem().then(function(response){
        debugger;
        deferred.resolve(response);
      },function(error){
        console.log(error);
        deferred.reject(error);
      });
    return deferred.promise;      
    }

  return {
    setLocalItem: setLocalItem,
    getLocalItem: getLocalItem,
    redirectToUrl: redirectToUrl,
    deleteLocalItem: deleteLocalItem,
    initializeTotalCartItems: initializeTotalCartItems
  };

}]);