angular
.module("2440", ["ionic", "2440.controllers"])

.run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state("app", {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: "AppCtrl",
            resolve: {
                "datas": function (appLoader, artistsManager, $ionicLoading) {
                    var loading = appLoader.load();

                    $ionicLoading.show({
                        template: "loading..."
                    });

                    loading.then(function (datas) {
                        artistsManager.setArtists(datas[0].data);
                        $ionicLoading.hide();
                    });
                    return loading;
                }
            }
        })

        .state("app.search", {
            url: "/search",
            views: {
                "menuContent" :{
                    templateUrl: "templates/search.html"
                }
            }
        })

        .state("app.browse", {
            url: "/browse",
            views: {
                "menuContent" :{
                    templateUrl: "templates/browse.html"
                }
            }
        })
        .state("app.artists", {
            url: "/artists",
            views: {
                "menuContent" :{
                    templateUrl: "templates/artists.html",
                    controller: "ArtistsController"
                }
            }
        })

        .state("app.single", {
            url: "/artists/:artistId",
            views: {
                "menuContent" :{
                    templateUrl: "templates/artist.html",
                    controller: "ArtistController"
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/app/artists");
});

