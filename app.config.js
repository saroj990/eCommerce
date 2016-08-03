/**
 * @name app.config.js
 * @desc Confg for handling route.
 * @createdOn 22th July 2015
 */
angular.module("appConfig", []).
run(function($rootScope, $location, commonService) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
        debugger
        $rootScope.postLogInRoute = $location.path();
        var loggedIn = commonService.isUserLoggedIn();
        if (nextRoute.originalPath == "/signUp") {
            $location.path("/signUp");
        } else if ($rootScope.postLogInRoute) {
            if (!loggedIn) {
                $location.path("/signIn").replace();
            } else {
                $location.path($rootScope.postLogInRoute).replace();
            }
        }
        $rootScope.postLogInRoute = null;
    });
})
