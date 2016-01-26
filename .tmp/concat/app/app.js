'use strict';

angular.module('itosApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ui.bootstrap', 'base64', 'pdf']).config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
  $routeProvider.otherwise({
    redirectTo: '/?content=about'
  });

  $locationProvider.html5Mode(true);
}]);
//# sourceMappingURL=app.js.map

'use strict';

angular.module('itosApp').controller('MainCtrl', ["$scope", "$http", "$location", "$base64", "$sce", "$window", function ($scope, $http, $location, $base64, $sce, $window) {
  $scope.active = angular.lowercase($location.search().content || 'about');
  $scope.page = $location.search().page || 'Course Content';
  $scope.mode = angular.lowercase($location.search().mode || 'nav');
  $scope.sha = angular.lowercase($location.search().sha || '0');

  $scope.type = 'html';
  $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/';

  $scope.height = $window.innerHeight;
  $scope.things = [{
    link: 'https://github.com/rcos/CSCI2963-01',
    name: 'View it on GitHub'
  }];

  $scope.resources = [{
    link: 'about',
    name: 'About'
  }, {
    link: 'photos',
    name: 'Photos'
  }, {
    link: 'fall2015projects',
    name: 'Past Projects 2015'
  }, {
    link: 'howto',
    name: 'Howto'
  }, {
    link: 'lectures',
    name: 'Lectures'
  }, {
    link: 'labs',
    name: 'Labs'
  }, {
    link: 'outlines',
    name: 'Outlines'
  }];
  $scope.classContentText = [];
  var config = {
    headers: {
      'Content-Type': 'application/vnd.github.v3.raw',
      'Accept': 'application/vnd.github.v3.html'
    }
  };
  if ($scope.mode === 'nav') {
    if ($scope.active === 'about') {
      $scope.link = 'https://github.com/rcos/CSCI2963-01';
      $scope.page = 'Course Content - About';

      $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/README.md', config).then(function (response) {
        $scope.classContentText.push($sce.trustAsHtml(response.data));

        $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Syllabus.md', config).then(function (response) {
          $scope.classContentText.push($sce.trustAsHtml(response.data));
          $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Reading-Material.md', config).then(function (response) {
            $scope.classContentText.push($sce.trustAsHtml(response.data));
          });
        });
      });
    } else if ($scope.active === 'photos') {
      $scope.link = 'https://github.com/rcos/CSCI2963-01/blob/master/Photos.Md';
      $scope.page = 'Course Content - Pictures';

      $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Photos.Md', config).then(function (response) {
        $scope.classContentText.push($sce.trustAsHtml(response.data));
      });
    } else if ($scope.active === 'howto') {
      $scope.page = 'Course Content - Howto';

      $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Howto';
      $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Howto', config).then(function (response) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = response.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            $scope.classContentText.push(item);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
    } else if ($scope.active === 'fall2015projects') {
      $scope.page = 'Course Content - Fall 2015 Projects';
      $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Fall2015Projects.md';
      //
      // $http.get('https://api.github.com/repos/rcos/CSCI2963-01/Fall2015Projects.md',config).then(function(response) {
      //   console.log("response",response);
      //     $scope.classContentText.push($sce.trustAsHtml(response.data));
      // });

      $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Fall2015Projects.md', config).then(function (response) {
        $scope.classContentText.push($sce.trustAsHtml(response.data));
      });
    } else if ($scope.active === 'labs') {
      $scope.page = 'Course Content - Labs';

      $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Labs';

      $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Labs', config).then(function (response) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = response.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            $scope.classContentText.push(item);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      });
    } else if ($scope.active === 'lectures') {
      $scope.page = 'Course Content - Lectures';

      $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Lectures';

      $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Lectures', config).then(function (response) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = response.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var item = _step3.value;

            // console.log(item);
            if (angular.lowercase(item.name).endsWith('.pdf') || angular.lowercase(item.name).endsWith('.md') || angular.lowercase(item.name).endsWith('.txt') || item.name.endsWith('.html')) {
              $scope.classContentText.push(item);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3['return']) {
              _iterator3['return']();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      });
    } else if ($scope.active === 'outlines') {
      $scope.page = 'Course Content - Outlines';

      $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Outlines';

      $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Outlines', config).then(function (response) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = response.data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var item = _step4.value;

            $scope.classContentText.push(item);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
              _iterator4['return']();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      });
    }
  } else {
    //details
    $scope.link = 'https://github.com/rcos/CSCI2963-01/blob/master/' + $scope.page;

    if (angular.lowercase($scope.page).endsWith('.pdf')) {
      config = {
        headers: {
          'Content-Type': 'application/vnd.github.v3.raw',
          'Accept': 'application/vnd.github.v3.raw'
        },
        responseType: 'arraybuffer'
      };

      $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/' + $scope.page, config).then(function (response) {
        $scope.type = 'pdf';
        var file = new Blob([response.data], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        // console.log(fileURL);
        $scope.classContentText.push($sce.trustAsResourceUrl(fileURL));
      }, function errorCallback(response) {
        // console.log(response);

        if (response.status === 403) {
          // console.log('response.status == 403');

          $http.get('https://api.github.com/repos/rcos/CSCI2963-01/git/blobs/' + $scope.sha, config).then(function (response) {
            $scope.type = 'pdf';
            var file = new Blob([response.data], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            // console.log(fileURL);
            $scope.classContentText.push($sce.trustAsResourceUrl(fileURL));
          });
        }
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    } else if (angular.lowercase($scope.page).endsWith('.md')) {
        $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/' + $scope.page, config).then(function (response) {
          // console.log(response.data);
          $scope.type = 'html';
          $scope.classContentText.push($sce.trustAsHtml(response.data));
        });
      } else {
        $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/' + $scope.page, config).then(function (response) {
          // console.log(response.data);
          $scope.type = 'html';
          $scope.classContentText.push($sce.trustAsHtml(response.data));
        });
      }
  }

  $scope.goToDetails = function (item) {
    // console.log(item);
    // console.log('/?mode=details&content='+$scope.active+'&page='+item.path+'&sha='+item.sha);
    $location.search('mode', 'details').search('page', item.path).search('sha', item.sha);
  };
  $scope.goToNav = function () {
    // console.log('/?content='+$scope.active);
    $location.url('/?content=' + $scope.active);
  };
}]);
//# sourceMappingURL=main.controller.js.map

'use strict';

angular.module('itosApp').config(["$routeProvider", function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  });
}]);
//# sourceMappingURL=main.js.map

'use strict';

angular.module('itosApp').factory('Modal', ["$rootScope", "$modal", function ($rootScope, $modal) {
  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @return {Object}            - the instance $modal.open() returns
   */
  function openModal(scope, modalClass) {
    var modalScope = $rootScope.$new();
    scope = scope || {};
    modalClass = modalClass || 'modal-default';

    angular.extend(modalScope, scope);

    return $modal.open({
      templateUrl: 'components/modal/modal.html',
      windowClass: modalClass,
      scope: modalScope
    });
  }

  // Public API here
  return {

    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */
      'delete': function _delete(del) {
        del = del || angular.noop;

        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function () {
          var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click: function click(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function click(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          deleteModal.result.then(function (event) {
            del.apply(event, args);
          });
        };
      }
    }
  };
}]);
//# sourceMappingURL=modal.service.js.map

'use strict';

angular.module('itosApp').controller('NavbarCtrl', ["$scope", "$location", function ($scope, $location) {
  $scope.menu = [{
    'title': 'Home',
    'link': '/'
  }];

  $scope.isCollapsed = true;

  $scope.isActive = function (route) {
    return route === $location.path();
  };
}]);
//# sourceMappingURL=navbar.controller.js.map

angular.module('itosApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/main/main.html',
    "<div class=main><header class=\"hero-unit banner\" ng-class=\"{'small-banner': ('nav'!==mode)}\"><div class=container><h1>CSCI 2963-01</h1><h3 class=lead>Intro to Open Source - Spring 2016</h3><div class=text-center><ul class=\"nav center-pills nav-pills-inverse border-pills-inverse\" ng-repeat=\"item in things\"><li role=presentation><a ng-href={{item.link}}><div class=img-title>{{item.name}}</div></a></li></ul></div></div></header><div class=\"course-content banner\"><div class=container><div ng-show=\"mode == 'nav'\"><div class=nav-center><ul class=\"nav nav-tabs\"><li role=presentation ng-repeat=\"item in resources\" ng-class=\"{active: (active==item.link)}\"><a ng-href=\"?content={{item.link}}\">{{item.name}}</a></li></ul><h4 class=\"lead text-left\"><a href={{link}}>{{page}}</a>:</h4><div class=imported-md><div ng-show=\"(active == 'about' || active == 'photos' || active == 'fall2015projects')\"><div class=text-left ng-repeat=\"item in classContentText\"><div ng-bind-html=item></div><hr></div></div><div ng-show=\"(active == 'howto' || active == 'labs' || active == 'outlines')\" class=text-left><table class=\"table table-hover\"><tr ng-repeat=\"item in classContentText\" ng-click=goToDetails(item);><td ng-class=\"{'borderless':$first}\">{{item.name}}</td></tr></table></div><div ng-show=\"active == 'lectures'\" class=text-left><table class=\"table table-hover\"><tr ng-repeat=\"item in classContentText\" ng-click=goToDetails(item);><td ng-class=\"{'borderless':$first}\">{{item.name}}</td></tr></table></div></div></div></div><div ng-show=\"mode == 'details'\"><h4 class=lead><i class=\"fa fa-arrow-circle-o-left\" ng-click=goToNav()></i><a href={{link}}>{{page}}</a>:</h4><div class=imported-md><div class=text-left ng-repeat=\"item in classContentText\"><div ng-show=\"type == 'html'\"><div ng-bind-html=item></div></div><div ng-show=\"type == 'pdf'\"><object ng-show=item data={{item}} type=application/pdf style=\"width: 100%; height: {{height}}px\"></object></div></div></div></div></div></div><footer class=footer><div class=container><span class=site-footer-owner><a ng-href=https://github.com/rcos/CSCI2963-01>Csci2963-01</a> is maintained by <a ng-href=https://github.com/rcos>rcos</a>.</span></div></footer></div>"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat=\"button in modal.buttons\" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click=\"isCollapsed = !isCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href=\"/\" class=navbar-brand>itos</a></div><div collapse=isCollapsed class=\"navbar-collapse collapse\" id=navbar-main><ul class=\"nav navbar-nav\"><li ng-repeat=\"item in menu\" ng-class=\"{active: isActive(item.link)}\"><a ng-href={{item.link}}>{{item.title}}</a></li></ul></div></div></div>"
  );

}]);

