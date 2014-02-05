/*
    This is an working application, but it had to be written in such a way
    that did not provide for error handling without the use of try...catch blocks.
    This means that I could not take advantage of the AngularJS JSONP built-in 
    error handling.

    When attempting to fix it, I ended up with $Digest errors in ALL browsers in
    the getData method on scope.$apply.

    NOTE: if testing in lower versions of Internet Explorer, remove the console.log statements
            as there is not console in those browsers
*/


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

        /*************************************************************************
        * Note: without using 'JSON_CALLBACK' as the actual callback,
        the resulting code does not allow for the success clause of the
        JSONP request.  It will always error out, even if the data is
        returned.
        **************************************************************************/
        return {
            getAllWebStuff: function () {
                /*should be*/
                //$http.jsonp(urlBase + 'GetAllWebStuff?callback=JSON_CALLBACK');
                $http.jsonp(urlBase + 'GetAllWebStuff?callback=webStuff')
                .success(function (data) {
                    //this will never be met
                    //console.log(data);
                })
                .error(function (data, status) {
                    //this will always console output with status of 0
                    console.log("error: " + status);
                });
            },

            getAllFlashStuff: function () {
                $http.jsonp(urlBase + 'GetAllFlashStuff?callback=flashStuff');
            },

            getAllDesignStuff: function () {
                $http.jsonp(urlBase + 'GetAllDesignStuff?callback=designStuff');
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

    //used to fill the dropdown list of web stuff subcategories
    $scope.fillDDL = function () {
        //setting a delay in order for the WCF AJAX call to finish
        $timeout(function () {
            $scope.filterItem = $scope.subCategories[0];

            $scope.subCatsFilter = function (data) {
                if (data.SubCategory == $scope.filterItem.subCat || 
                        $scope.filterItem.subCat == 'Show All') {
                    return true;
                }
                return false;
            }
        }, 1000);
    }

    //used on the Front End by ng-click directives
    $scope.webStuff = function (item) {
        dataSource.getAllWebStuff();
        $scope.showDDL = true;
        $scope.fillDDL();
    }
    $scope.flashStuff = function (item) {
        $scope.filterItem = 'Show All';
        $scope.showDDL = false;
        dataSource.getAllFlashStuff();
    }
    $scope.designStuff = function (item) {
        $scope.filterItem = 'Show All';
        $scope.showDDL = false;
        dataSource.getAllDesignStuff();
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


/* Main function used by callback funcs to slice+dice data */
function getData(allStuff, imagePath) {
    var tempArr1 = [], tempArr2 = [];
    var SubCategories = [];

    //add first DDL Option to each array
    SubCategories.push({ subCat: 'Show All' });

    //get scope from the angular app
    var scope = angular.element($("#ng-app")).scope();

    //need to get the data into the $scope
    scope.$apply(function () {
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
        
        scope.imgPath = (imagePath == 'w')? 'webstuff' : 'designstuff';
        scope.allData = allStuff;
        scope.subCategories = SubCategories;
    });
}



/* These are the external callback functions for the Ajax Calls  */
function webStuff(data) {
    var web = data.GetAllWebStuffResult;
    getData(web, 'w');
}
function flashStuff(data) {
    var flash = data.GetAllFlashStuffResult;
    getData(flash, 'w');
}
function designStuff(data) {
    var design = data.GetAllDesignStuffResult;
    getData(design, 'd');
}