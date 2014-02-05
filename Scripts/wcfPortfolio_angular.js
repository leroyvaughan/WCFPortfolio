//create app namespace + module
var wcfP = angular.module('wcfPortfolio', []);

wcfP.config(['$httpProvider', function ($httpProvider) {
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
} ]);

// Define app module.
angular.module('myApp.Factory', []).
    factory('dataSource', ['$http', function ($http) {

        var urlBase = 'http://www.communityautomotiveservice.com/wcfsvcs/Service1.svc/';
        if (document.location.href.toLowerCase().indexOf("localhost") > 0) {
            urlBase = 'http://localhost:1229/Service1.svc/';
        }

        return {//return methods of the dataSource object
            getAllWebStuff: function () {
                //also return the $http.jsonp object back to the controller for error handling
                return $http.jsonp(urlBase + 'GetAllWebStuff?callback=JSON_CALLBACK');
            },

            getAllFlashStuff: function () {
                return $http.jsonp(urlBase + 'GetAllFlashStuff?callback=JSON_CALLBACK');
            },

            getAllDesignStuff: function () {
                return $http.jsonp(urlBase + 'GetAllDesignStuff?callback=JSON_CALLBACK');
            }
        }
    } ]);
//now add the factory dependency
angular.module('wcfPortfolio', ['myApp.Factory']);


/*
    This is the Controller (ng-controller) for the Application
     - defined in 'Portfolio.Master' on #ng-app element
*/
function wcfP_Controller($scope, $timeout, dataSource){
    $scope.allData = {};
    $scope.categories = ["Web Stuff", "Flash Stuff", "Design Stuff"];
    $scope.subCategories = {};


    $scope.getData = function (allStuff, imagePath) {
        var tempArr1 = [], tempArr2 = [];
        var SubCategories = [];

        //add first DDL Option to each array
        SubCategories.push({ subCat: 'Show All' });

        /*
        - allStuff.Object = {Title, Description, Link, ImgSource, 
        Category, SubCategory, Year, Company}
        */
        angular.forEach(allStuff, function (key) {
            if ($.inArray(key.SubCategory, tempArr1) == -1) {
                tempArr1.push(key.SubCategory);
                SubCategories.push({ subCat: key.SubCategory });
            }
        })

        tempArr1 = null; tempArr2 = null;

        //assign data to scope variable for the template
        $scope.imgPath = (imagePath == 'w') ? 'webstuff' : 'designstuff';
        $scope.allData = allStuff;
        $scope.subCategories = SubCategories;
    };


    //this is the filter defined on the ng-repeat element
    $scope.subCatsFilter = function (data) {
        if (data.SubCategory == $scope.filterItem.subCat || 
            $scope.filterItem.subCat == 'Show All') {
            return true;
        }
        return false;
    }


    //used on the Front End by ng-click directives
    $scope.webStuff = function () {
        dataSource.getAllWebStuff()
            .success(function (data) {
                $scope.getData(data.GetAllWebStuffResult, 'w');
                $scope.showDDL = true;
                $scope.filterItem = $scope.subCategories[0];
            })
            .error(function (data, status) {
                //do something here
            });
    };

    //used on the Front End by ng-click directives
    $scope.flashStuff = function () {
        dataSource.getAllFlashStuff()
            .success(function (data) {
                $scope.getData(data.GetAllFlashStuffResult, 'w');
                $scope.showDDL = false;
                $scope.filterItem.subCat = 'Show All';
            })
            .error(function (data, status) {
                //do something here
            });
    };

    //used on the Front End by ng-click directives
    $scope.designStuff = function (item) {
        dataSource.getAllDesignStuff()
            .success(function (data) {
                $scope.getData(data.GetAllDesignStuffResult, 'd');
                $scope.showDDL = false;
                $scope.filterItem.subCat = 'Show All';
            })
            .error(function (data, status) {
                //do something here
            });
    }

    //used for determining if portfolio piece has a link
    $scope.isBlank = function (link) {
        if (typeof (link) == 'undefined') {
            return "blank";
        }
        return link;
    }

    //get web stuff on page load
    $scope.webStuff();
}