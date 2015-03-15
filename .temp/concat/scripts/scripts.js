// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(["$ionicPlatform", function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}])

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

}]);

angular.module('starter.controllers', [])

.controller('DashCtrl', ["$scope", "$http", "$cordovaGeolocation", "$ionicModal", function($scope, $http, $cordovaGeolocation, $ionicModal) {


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
      $http.post('https://barsies.herokuapp.com/api/yelps/yelp', $scope.loca).success(function(bars) {
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
        $http.post('https://barsies.herokuapp.com/api/yelps/yelp', $scope.loca).success(function(bars) {
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
}])




angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});

"use strict";

 angular.module('config', [])

.constant('ENV', {name:'production',apiEndpoint:'http://api.yoursite.com/'})

;