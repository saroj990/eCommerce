angular.module('localDbService', []).
factory("localDbService", ["$indexedDB", "$q", "$log", "Guid", "$timeout", function($indexedDB, $q, $log, Guid, $timeout) {


    var addUser = function(user) {
        var deferred = $q.defer();
        $indexedDB.openStore("users", function(store) {
            store.insert({
                "id": Guid.newGuid(),
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "password": user.password
            }).then(
                function(response) {
                    deferred.resolve(response[0]);
                },
                function(error) {
                    deferred.reject(error)
                })
        });
        return deferred.promise;
    }
    var authenticateUser = function(user) {
        var deferred = $q.defer();
        $indexedDB.openStore("users", function(store) {
            return findItem("users", "email", user.email).then(
                function(response) {
                    $log.info("authenticate user");
                    $log.info(response);
                    deferred.resolve(response);
                },
                function(error) {
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
            $indexedDB.openStore(storeName, function(store) {
                store.findWhere(store.query().$index(keyName).$eq(KeyValue)).then(
                    function(data) {
                        $log.info("result from find method");
                        $log.info(data);
                        deferred.resolve(data);

                    },
                    function(error) {});
            });

        } catch (error) {
            console.log(error);
        }
        return deferred.promise;
    }

    var createCart = function(userId) {
        var deferred = $q.defer()
        $indexedDB.openStore("carts", function(store) {
            store.insert({
                "id": Guid.newGuid(),
                "userId": userId
            }).then(
                function(response) {
                    deferred.resolve(response[0])
                },
                function(error) {
                    deferred.reject(error)
                })
        });
        return deferred.promise;
    }

    var creatCartLineItem = function(cartId, productId) {
        var deferred = $q.defer();
        $indexedDB.openStore("cartItems", function(store) {
            store.insert({
                "id": Guid.newGuid(),
                "cartId": cartId,
                "productId": productId,
                "quantity": 1
            }).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            })
        })
        return deferred.promise;
    }

    var getCartItems = function(cartId) {
        var deferred = $q.defer();

        findItem("cartItems", "cartId", cartId).then(
            function(items) {
                deferred.resolve(items);
            },
            function(error) {
                $log.error(error);
            });
        return deferred.promise;
    }

    var checkIfCartExist = function(userId) {
        var deferred = $q.defer();
        var status = false;

        findItem("carts", "userId", userId).then(
            function(items) {
                if (items.count) {
                    status = true
                }
                deferred.resolve(status);
            },
            function(error) {
                deferred.resolve(error)
            });
        return deferred.promise;
    }

    var addSampleProducts = function(products) {
        var deferred = $q.defer();
        var i = 0;
        if (!products.length) {
            deferred.resolve(false)
        }

        for (; i < products.length; i++) {
            addNewProduct(products[i]);
        }

        $timeout(function() {
            deferred.resolve(true);
        }, 1000 * products.length)

        return deferred.promise;
    }

    var addNewProduct = function(product) {
        try {
            var deferred = $q.defer();

            if (!product) {
                return;
            }
            $indexedDB.openStore("products", function(store) {
                store.insert({
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "price": product.price,
                    "sku": product.sku,
                    "likes": product.likes,
                    "shares": product.shares,
                    "companyId": 1,
                    "imageUrl": product.imageUrl
                }).then(function(response) {
                    $log.info("Product was added successfully!!")
                    deferred.resolve(true)
                }, function(error) {
                    $log.error("There was some error")
                    deferred.reject(error)
                });
            });
        } catch (error) {
            $log.error(error);
        }
        return deferred.promise;
    };

    //Find a record based ob id value
    function findItemById(objectStoreName, id) {
        try {
            var deferred = $q.defer();
            $indexedDB.openStore(objectStoreName, function(store) {
                store.find(id)
                    .then(function(result) {
                            deferred.resolve(result);
                        },
                        function(error) {
                            deferred.reject(error);
                        });
            });

        } catch (error) {
            errorHandler.handleError(error);
        }
        return deferred.promise;
    }

    var getProduct = function(id) {
        var deferred = $q.defer();
        findItemById("products", id).then(
            function(response) {
                deferred.resolve(response);
            },
            function(error) {
                deferred.reject(error);
            })
        return deferred.promise;
    }
    var getTotalCartItem = function(cartId) {
        var deffered = $q.defer()
        getAllElements("cartItems").then(function(response) {
                debugger;
                console.log("total cart item");
                console.log(response)
                deffered.resolve(response.length);
            },
            function(error) {
                console.log(error);
                deffered.reject(error);
            })
        return deffered.promise;
    }

    var deleteItem = function(storeName, key) {
        var deferred = $q.defer();
        $indexedDB.openStore(storeName, function(store) {
            store.delete(key).then(function(response) {
                console.log("item deleted");
                console.log(response);
                deferred.resolve(response);
            }, function(error) {
                console.log("error while deleting item");
                deferred.reject(error)
            })
        });
        return deferred.promise;
    }

    var removeCartItem = function(id) {
        var deferred = $q.defer();
        deleteItem("cartItems", id).then(function(response) {
            console.log("cart item deleted");
            deferred.resolve(response);
        }, function(error) {
            console.log("error while deleting cart item");
            deferred.reject(error);
        })
        return deferred.promise;

    }

    var getAllElements = function(storeName) {
        var deferred = $q.defer();
        $indexedDB.openStore(storeName, function(store) {
            store.getAll().then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            })
        });
        return deferred.promise;
    }

    return {
        addNewProduct: addNewProduct,
        addUser: addUser,
        authenticateUser: authenticateUser,
        createCart: createCart,
        creatCartLineItem: creatCartLineItem,
        getCartItems: getCartItems,
        checkIfCartExist: checkIfCartExist,
        addSampleProducts: addSampleProducts,
        getProduct: getProduct,
        getTotalCartItem: getTotalCartItem,
        removeCartItem: removeCartItem,
        getAllElements: getAllElements
    }
}])
