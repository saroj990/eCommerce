angular.module('localDbService', []).
factory("localDbService", ["$indexedDB", "$q", "$log", "Guid", function ($indexedDB, $q, $log, Guid) {

  var addNewProduct = function (product) {
    try {
      var deferred = $q.defer();
      if (!product) {
        return;
      }
      $indexedDB.openStore("products", function (store) {

        store.insert({
          "id": Guid.newGuid(),
          "name": product.name,
          "description": product.description,
          "price": product.price,
          "sku": product.sku,
          "likes": 0,
          "shares": 0,
          "companyId": 1
        }).then(function (response) {
          $log.info("Product was added successfully!!")
          deferred.resolve(true)
        }, function (error) {
          $log.error("There was some error")
          deferred.reject(error)
        });
      });
    } catch (error) {
      // errorHandler.handleError(error);

    }
    return deferred.promise;
  };


  var addUser = function (user) {
    var deferred = $q.defer();
    $indexedDB.openStore("users", function (store) {
      store.insert({
        "id": Guid.newGuid(),
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "password": user.password
      }).then(
        function (response) {
          deferred.resolve(response[0]);
        },
        function (error) {
          deferred.reject(error)
        })
    });
    return deferred.promise;
  }
  var authenticateUser = function (user) {
    var deferred = $q.defer();
    $indexedDB.openStore("users", function (store) {
      return findItem("users", "email", user.email).then(
        function (response) {
          deferred.resolve(response);
        },
        function (error) {
          deferred.resolve(error);
        });
    });
    return deferred.promise;
  }

  //Finds item by store name,key name and key value provided
  function findItem(storeName, keyName, KeyValue) {
    try {
      var deferred = $q.defer();
      if (!storeName || !keyName || !KeyValue) {
        deferred.resolve(null);
      }
      $indexedDB.openStore(storeName, function (store) {
        store.findWhere(store.query().$index(keyName).$eq(KeyValue))
          .then(function (results) {
            deferred.resolve(results);

          }, function (error) {
            deferred.reject(error);
          });
      });

    } catch (error) {
      console.log(error);
    }
    return deferred.promise;
  }

  var createCart = function (userId) {
    var deferred = $q.defer()
    $indexedDB.openStore("carts", function (store) {
      store.insert({
        "id": Guid.newGuid(),
        "userId": userId
      }).then(
        function (response) {
          deferred.resolve(response[0])
        },
        function (error) {
          deferred.reject(error)
        })
    });
    return deferred.promise;
  }

  var creatCartLineItem = function (cartId, productId) {
    var deferred = $q.defer();
    $indexedDB.openStore("cartItems", function (store) {
      store.insert({
        "id": Guid.newGuid(),
        "cartId": cartId,
        "productId": productId
      }).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      })
    })
    return deferred.promise;
  }

  var getCartItems = function (cartId) {
    var deferred = $q.defer();

    findItem("cartItems", "cartId", cartId).then(
      function (items) {
        deferred.resolve(items);
      },
      function (error) {
        $log.error(error);
      });
    return deferred.promise;
  }

  return {
    addNewProduct: addNewProduct,
    addUser: addUser,
    authenticateUser: authenticateUser,
    createCart: createCart,
    creatCartLineItem: creatCartLineItem,
    getCartItems: getCartItems
  }
}])