/*global window*/

(function (angular) {
    "use strict";
    angular
        .module("2440.controllers", ["2440.services"])

        .controller("AppCtrl", function($scope) {
        })

        .controller("InfoController", function($scope) {
        })

        .controller("ArtistsController", function($scope, artistsManager, calendarManager) {
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

            $scope.refresh = function () {
                $scope.refreshing = true;
                artistsManager
                    .load(true)
                    .then(function () {
                        $scope.order("date");
                        $scope.refreshing = false;
                    });
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
                return calendarManager.isAdded(artist);
            };

            $scope.favorite = function (artist) {
                calendarManager.add(artist);
                $scope.favorites.push(artist);
            };

            $scope.order("date");
        })

        .controller("ArtistController", function($scope, $stateParams, artistsManager) {
            $scope.artist = artistsManager.getArtist($stateParams.artistId);
        });

}(window.angular));
