/*global window*/

(function (angular) {
    "use strict";
    angular
        .module("2440.controllers", ["2440.services"])

        .controller("AppCtrl", function($scope) {
        })

        .controller("InfoController", function($scope) {
        })

        .controller("ArtistsController", function($scope, artistsManager) {
            $scope.favorites = [];

            $scope.availableSorts = {
                "date": {
                    name: "Dates",
                    property: "date"
                },

                "stage": {
                    name: "Scènes",
                    property: "stage"
                }
            };

            $scope.order = function (method) {
                var sortConfig = $scope.availableSorts[method], 
                    sections = {},
                    artists = artistsManager.getArtists();

                for (var i in artists) {
                    var section = artists[i][sortConfig.property];
                    if (!sections[section]) { sections[section] = []; }
                    sections[section].push(artists[i]);
                }

                $scope.sections = sections;
                $scope.currentOrder = method;
            };

            $scope.isFavorited = function (artist) {
                return $scope.favorites.indexOf(artist) !== -1;
            };

            $scope.favorite = function (artist) {
                $scope.favorites.push(artist);
            };

            $scope.order("date");

        })

        .controller("ArtistController", function($scope, $stateParams, artistsManager) {
            $scope.artist = artistsManager.getArtist($stateParams.artistId);
        });

}(window.angular));
