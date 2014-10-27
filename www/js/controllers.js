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
            $scope.artists = artistsManager.getArtists();

            $scope.currentOrder = "stage";

            $scope.order = function (method) {
                switch (method) {
                    case "stage":
                        var stages = {},
                            art = artistsManager.getArtists().sort(function (a1, a2) {
                                if (a1.stage === a2.stage) { return 0; }
                                return a1.stage > a2.stage ? 1 : -1;
                            });

                        for (var i in art) {
                            var stage = art[i].stage;
                            if (!stages[stage]) { stages[stage] = i; }
                            stages[stage] = Math.min(stages[stage], i);
                        }

                        for (i in stages) {
                            art.splice(stages[i] - 1, 0, { type: "stage", name: i });
                        }
                        $scope.artists = art;
                        break;
                    case "alpha":
                        $scope.artists = artistsManager.getArtists().sort(function (a1, a2) {
                            if (a1.name === a2.name) { return 0; }
                            return a1.name > a2.name ? 1 : -1;
                        });
                        break;
                }
            };

            $scope.$watch("currentOrder", function (newOrder, oldOrder, scope) {
                scope.order(newOrder);
            });

        })

        .controller("ArtistController", function($scope, $stateParams, artistsManager) {
            $scope.artist = artistsManager.getArtist($stateParams.artistId);
        });

}(window.angular));
