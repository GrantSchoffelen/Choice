angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $cordovaGeolocation, $ionicModal) {


$ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };


  $scope.bars;
  $scope.random;
  $scope.loca;
  $scope.dealSearch = false;
  $scope.counter = 0;
  $scope.search = 'bar'; 

  $cordovaGeolocation
    .getCurrentPosition()
    .then(function(position) {
      $scope.loca = position
      $scope.loca.search = $scope.search
      $scope.loca.offset = $scope.counter;
      $http.post('http://localhost:9000/api/yelps/yelp', $scope.loca).success(function(bars) {
        for (var i = 0; i < bars.businesses.length; i++) {
          var distance = (bars.businesses[i].distance * 0.00062137).toString()
          var miles = distance.substring(0, 4) + "  Miles Away"
          bars.businesses[i].distance = miles
        }
        $scope.bars = bars.businesses
        $scope.generateBar()
        $scope.wait = false;
        console.log(bars)
      })
    })


  $scope.dealToggle = function() {
    if ($scope.dealSearch === false) {
      $scope.dealSearch = true;
    } else {
      $scope.dealSearch = false
    }
    $scope.bars = []
    $scope.random = $scope.bars[0]
    $scope.generateBar()
  }

    $scope.food = function() {
    if ($scope.search === 'bar') {
      $scope.search = 'food';
    } else {
      $scope.search = 'bar'
    }
    $scope.bars = []
    $scope.random = $scope.bars[0]
    $scope.generateBar()
  }

  $scope.generateBar = function() {
    var index = Math.floor(Math.random() * $scope.bars.length);
    $scope.random = $scope.bars[index];
    $scope.bars.splice(index, 1)
    $scope.counter++
      if (!$scope.random) {
        $scope.loca.search = $scope.search
        $scope.loca.deal = $scope.dealSearch
        $scope.loca.offset = $scope.counter - 1;
        $scope.wait = true;
        $http.post('http://localhost:9000/api/yelps/yelp', $scope.loca).success(function(bars) {
          for (var i = 0; i < bars.businesses.length; i++) {
            var distance = (bars.businesses[i].distance * 0.00062137).toString()
            var miles = distance.substring(0, 4) + "  Miles Away"
            bars.businesses[i].distance = miles
          }
          console.log(bars.businesses)
          $scope.bars = bars.businesses
          $scope.generateBar()
          $scope.wait = false;
        })
      }
    $scope.address = false;
  }

  $scope.showAddress = function() {
    if ($scope.address === false) {
      $scope.address = true
    } else {
      $scope.address = false;
    }
  }
})



