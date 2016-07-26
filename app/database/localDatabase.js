/**​
 * @name localDatabase
 * @desc  creates local database
 * @createdOn 7th July 2015
 */

angular.module('localDatabase', ['indexedDB'])
    .config(function($indexedDBProvider) {
        $indexedDBProvider
            .connection("eCommerce")
            .upgradeDatabase(1, function(event, db, transaction) {
                //creates value list object store
                var productStore = db.createObjectStore("products", {
                    keyPath: "id"
                });
                productStore.createIndex("name", "name", {
                    unique: false
                });
                productStore.createIndex("sku", "sku", {
                    unique: false
                });
                productStore.createIndex("description", "description", {
                    unique: false
                });
                productStore.createIndex("price", "price", {
                    unique: false
                });
                productStore.createIndex("likes", "likes", {
                    unique: false
                });
                productStore.createIndex("share", "share", {
                    unique: false
                });
                productStore.createIndex("companyId", "companyId", {
                    unique: false
                });

                productStore.transaction.oncomplete = function(event) {
                        console.log("product store was successfuly created!!");
                    }
                    //creates value list object store

                var companyStore = db.createObjectStore("companies", {
                    keyPath: "id"
                });
                companyStore.createIndex("name", "name", {
                    unique: false
                });
                companyStore.createIndex("location", "location", {
                    unique: false
                });
                companyStore.createIndex("description", "description", {
                    unique: false
                });
                companyStore.createIndex("phone", "phone", {
                    unique: false
                });
                companyStore.createIndex("websiteUrl", "websiteUrl", {
                    unique: false
                });
                companyStore.transaction.oncomplete = function(event) {
                    console.log("companyStore was successfuly created!!");
                }

                var cartItemStore = db.createObjectStore("cartItems", {
                    keyPath: "id"
                });
                cartItemStore.createIndex("productId", "productId", {
                    unique: false
                });
                cartItemStore.createIndex("userId", "userId", {
                    unique: false
                });
                cartItemStore.transaction.oncomplete = function(event) {
                    console.log("cart item was successfuly created!!");
                }

                var userStore = db.createObjectStore("users", {
                    keyPath: "id"
                });
                userStore.createIndex("firstName", "firstName", {
                    unique: false
                });
                userStore.createIndex("lastName", "lastName", {
                    unique: false
                });
                userStore.createIndex("email", "email", {
                    unique: false
                });
                userStore.createIndex("password", "password", {
                    unique: false
                });
                companyStore.transaction.oncomplete = function(event) {
                    console.log("companyStore was successfuly created!!");
                }


            })

    })
