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
  $scope.deal = "False"
  $scope.counter = 0;
  $scope.search = 'Bar'; 
  $scope.loading =true; 
  $cordovaGeolocation
    .getCurrentPosition()
    .then(function(position) {
      console.log(position)
      $scope.loca = position
      $scope.loca.search = $scope.search
      $scope.loca.offset = $scope.counter;
      $http.post('http://localhost:9000/api/yelps/yelp', $scope.loca).success(function(bars) {
        for (var i = 0; i < bars.length; i++) {
          var distance = (bars[i].distance * 0.00062137).toString()
          var miles = distance.substring(0, 4) + "  Miles Away"
          bars[i].distance = miles
        }
        $scope.bars = bars
        $scope.generateBar()
        $scope.wait = false;
        $scope.loading = false;
      })
    })


  $scope.dealToggle = function() {
    if ($scope.dealSearch === false) {
      $scope.dealSearch = true;
      $scope.deal = "True"
    } else {
      $scope.dealSearch = false
      $scope.deal = "False"
    }
    $scope.bars = []
    $scope.random = $scope.bars[0]
    $scope.generateBar()
  }

    $scope.food = function() {
    if ($scope.search === 'Bar') {
      $scope.search = 'Food';
    } else {
      $scope.search = 'Bar'
    }
    $scope.bars = []
    $scope.random = $scope.bars[0]
    $scope.generateBar()
  }

  $scope.generateBar = function() {
   
    var index = Math.floor(Math.random() * $scope.bars.length);
    $scope.random = $scope.bars[index];
    console.log($scope.random)
    $scope.bars.splice(index, 1)
    $scope.counter++
      if (!$scope.random) {
        $scope.loading = true; 
        $scope.loca.search = $scope.search
        $scope.loca.deal = $scope.dealSearch
        $scope.loca.offset = $scope.counter - 1;
        $scope.wait = true;
        $http.post('http://localhost:9000/api/yelps/yelp', $scope.loca).success(function(bars) {
          for (var i = 0; i < bars.length; i++) {
            var distance = (bars[i].distance * 0.00062137).toString()
            var miles = distance.substring(0, 4) + "  Miles Away"
            bars[i].distance = miles
          }
          $scope.bars = bars
          $scope.loading = false; 
          $scope.generateBar()
          $scope.wait = false; 
        })
      }
      
    $scope.deals = false;
  }

  $scope.showDeals = function() {
    if ($scope.deals === false) {
      $scope.deals = true
    } else {
      $scope.deals = false;
    }
  }
})



