'use strict';

angular.module('itosApp')
  .controller('MainCtrl', function ($scope, $http, $location, $base64, $sce, $window) {
    $scope.active = angular.lowercase($location.search().content || 'about');
    $scope.page = ($location.search().page || 'Course Content');
    $scope.mode = angular.lowercase($location.search().mode || 'nav');
    $scope.sha = angular.lowercase($location.search().sha || '0');

    $scope.type = 'html';
    $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/';

    $scope.height = $window.innerHeight;
    $scope.things = [
      {
        link:'https://github.com/rcos/CSCI2963-01',
        name: 'View it on GitHub'
      }
    ];

    $scope.resources = [
      {
        link:'about',
        name: 'About'
      },
      {
        link:'photos',
        name: 'Photos'
      },
      {
        link:'fall2015projects',
        name: 'Past Projects 2015'
      },
      {
        link:'howto',
        name: 'Howto'
      },
      {
        link:'lectures',
        name: 'Lectures'
      },
      {
        link:'labs',
        name: 'Labs'
      },
      {
        link:'outlines',
        name: 'Outlines'
      }
    ];
    $scope.classContentText = [];
    var config = {
      headers:{
        'Content-Type': 'application/vnd.github.v3.raw',
        'Accept': 'application/vnd.github.v3.html',
      }
    };
    if ($scope.mode === 'nav'){
      if ($scope.active === 'about'){
        $scope.link = 'https://github.com/rcos/CSCI2963-01';
        $scope.page = 'Course Content - About';

        $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/README.md',config ).then(function(response) {
          $scope.classContentText.push($sce.trustAsHtml(response.data));

          $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Syllabus.md',config).then(function(response) {
              $scope.classContentText.push($sce.trustAsHtml(response.data));
              $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Reading-Material.md',config).then(function(response) {
                  $scope.classContentText.push($sce.trustAsHtml(response.data));
              });
          });


        });
      }
      else if ($scope.active === 'photos'){
        $scope.link = 'https://github.com/rcos/CSCI2963-01/blob/master/Photos.Md';
        $scope.page = 'Course Content - Pictures';

        $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Photos.Md',config ).then(function(response) {
          $scope.classContentText.push($sce.trustAsHtml(response.data));
        });
      }
      else if ($scope.active === 'howto'){
        $scope.page = 'Course Content - Howto';

        $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Howto';
        $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Howto', config ).then(function(response) {
          for( var item of response.data){
            $scope.classContentText.push(item);

          }
        });
      }
      else if ($scope.active === 'fall2015projects'){
        $scope.page = 'Course Content - Fall 2015 Projects';
        $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Fall2015Projects.md';
        //
        // $http.get('https://api.github.com/repos/rcos/CSCI2963-01/Fall2015Projects.md',config).then(function(response) {
        //   console.log("response",response);
        //     $scope.classContentText.push($sce.trustAsHtml(response.data));
        // });

      $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Fall2015Projects.md',config ).then(function(response) {
        $scope.classContentText.push($sce.trustAsHtml(response.data));
      });


      }
      else if ($scope.active === 'labs'){
        $scope.page = 'Course Content - Labs';

        $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Labs';

        $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Labs', config ).then(function(response) {
          for( var item of response.data){
            $scope.classContentText.push(item);
          }
        });
      }
      else if ($scope.active === 'lectures'){
        $scope.page = 'Course Content - Lectures';

        $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Lectures';

        $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Lectures', config ).then(function(response) {
          for( var item of response.data){
            // console.log(item);
            if (angular.lowercase(item.name).endsWith('.pdf') || angular.lowercase(item.name).endsWith('.md') || angular.lowercase(item.name).endsWith('.txt') || item.name.endsWith('.html')){
              $scope.classContentText.push(item);
            }
          }
        });
      }
      else if ($scope.active === 'outlines'){
        $scope.page = 'Course Content - Outlines';

        $scope.link = 'https://github.com/rcos/CSCI2963-01/tree/master/Outlines';

        $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/Outlines', config ).then(function(response) {
          for( var item of response.data){
            $scope.classContentText.push(item);
          }
        });
      }
    }
    else{ //details
      $scope.link = 'https://github.com/rcos/CSCI2963-01/blob/master/'+$scope.page;

        if (angular.lowercase($scope.page).endsWith('.pdf')){
          config = {
            headers:{
              'Content-Type': 'application/vnd.github.v3.raw',
              'Accept': 'application/vnd.github.v3.raw',
            },
            responseType : 'arraybuffer'
          };

          $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/'+$scope.page , config).then(function(response) {
            $scope.type = 'pdf';
            var file = new Blob([(response.data)], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            // console.log(fileURL);
            $scope.classContentText.push($sce.trustAsResourceUrl(fileURL));
          }, function errorCallback(response) {
            // console.log(response);

            if (response.status === 403){
              // console.log('response.status == 403');

              $http.get('https://api.github.com/repos/rcos/CSCI2963-01/git/blobs/'+$scope.sha , config).then(function(response) {
                $scope.type = 'pdf';
                var file = new Blob([(response.data)], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                // console.log(fileURL);
                $scope.classContentText.push($sce.trustAsResourceUrl(fileURL));
              });
            }
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
        }
        else if (angular.lowercase($scope.page).endsWith('.md')){
          $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/'+$scope.page , config).then(function(response) {
            // console.log(response.data);
            $scope.type = 'html';
            $scope.classContentText.push($sce.trustAsHtml(response.data));
          });
        }
        else{
          $http.get('https://api.github.com/repos/rcos/CSCI2963-01/contents/'+$scope.page , config).then(function(response) {
            // console.log(response.data);
            $scope.type = 'html';
            $scope.classContentText.push($sce.trustAsHtml(response.data));
          });
        }


    }

    $scope.goToDetails = function(item) {
        // console.log(item);
        // console.log('/?mode=details&content='+$scope.active+'&page='+item.path+'&sha='+item.sha);
        $location.search('mode','details').search('page',item.path).search('sha',item.sha);
    };
    $scope.goToNav = function() {
        // console.log('/?content='+$scope.active);
        $location.url('/?content='+$scope.active);
    };

  });
