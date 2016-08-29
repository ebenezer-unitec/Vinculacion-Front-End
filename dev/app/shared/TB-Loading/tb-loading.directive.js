(function() {
    "use strict";

    angular
        .module('VinculacionApp')
        .directive('tbLoading', tbLoading);

    function tbLoading() {
        var directive = 
        {
            restrict: 'E',
            templateUrl: 'templates/shared/TB-Loading/tb-loading.html' 
        };

        return directive;
    }
})();