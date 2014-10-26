angular
    .module('2440.controllers', ["2440.services"])

    .controller('AppCtrl', function($scope, artistsManager) {
    })

    .controller('InfoController', function($scope) {
    })

    .controller('ArtistsController', function($scope, artistsManager) {
        $scope.artists = artistsManager.getArtists();
    })

    .controller('ArtistController', function($scope, $stateParams, artistsManager) {
        $scope.artist = artistsManager.getArtist($stateParams.artistId);
    });
