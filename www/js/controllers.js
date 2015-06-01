var module = angular.module('spotify.controllers', []);

module.controller('DashCtrl', function($scope, CacheService, $timeout, Playback, Spotify) {
  $scope.user = CacheService.getVar('user');

  $scope.$on('$ionicView.enter', function(e) {
    $scope.playing = Playback.isPlaying();
    $scope.current = CacheService.getVar('currentTrack');
    var ms = $scope.current.duration_ms,
      min = Math.floor((ms/1000/60) << 0),
      sec = Math.floor((ms/1000) % 60);

    if (sec < 10) {
      sec = '0' + sec;
    }
    $scope.duration = min + ':' + sec;
    console.log($scope.current);
  });
});

module.controller('PlaylistCtrl', function($scope, $rootScope, Chats, Spotify, CacheService, Playback, spotify_user, spotify_playlist) {
  $scope.start = function(trackid) {
    console.log('playing');
    console.log(trackid);
    $scope.controlbar = true;
    $scope.playing = true;
    Playback.startPlaying(trackid)
  };

  $scope.play = function() {
    $scope.playing = true;
    Playback.resume()
  };

  $scope.pause = function() {
    $scope.playing = false;
    Playback.pause()
  };

  $rootScope.ended =  function() {
    $scope.controlbar = false;
    $scope.playing = false;
    //$scope.apply();
  };

  $scope.test = function() {
    $rootScope.ended();
  };

  $scope.playlist = CacheService.getVar('playlist');

  if (!$scope.playlist) {
    Spotify.getPlaylistTracks(spotify_user, spotify_playlist).then(function (data) {
      console.log(data.items[0].track);
      console.log(data.items[0].track.album);
      $scope.playlist = data;
    });
  }

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
});

module.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
});

module.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

module.controller('LoginCtrl', function($scope, $state, LoginService, $ionicPopup, CacheService) {
  $scope.data = {};

  if (LoginService.userLoggedIn()) {
    console.log('User is Logged In');
    // Load User information into Cache
    var user = localStorage.getItem('user');
    CacheService.setVar('user', JSON.parse(user));
    // Go to startscreen.
    $state.go('tab.dash');
  }

  $scope.login = function() {
    LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
      var user = {
        username: $scope.data.username
      };
      //DBService.insert(user);
      localStorage.setItem('userLoggedIn', true);
      localStorage.setItem('user', JSON.stringify(user));
      CacheService.setVar('user', user);
      $state.go('tab.dash');
    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  }
});
