angular
    .module("2440.services", [])

    /**
     * the inital service that will takes care of loading all the
     * necessary datas for the app to work
     *
     * @return {Service}
     */
    .service("appLoader", function ($http, $q, $window) {
        this.load = function () {
            var c = $window.angular.callbacks.counter.toString(36);

            //as the datas are hosted on a statically generated site
            //they cannot adapt to a dynamic jsonp callback
            //so we need to override the auto-generated angular callback
            //by the one that is hard coded in the site jsonp
            $window.parseArtists = function (data) {
                $window.angular.callbacks['_' + c](data);
                delete $window['angularcallbacks_' + c];
            };
            artists = $http.jsonp("http://localhost:4000/artists.json.js?callback=JSON_CALLBACK");

            return $q.all(artists);
        };
    })

    /**
     * manage all that is related to the artists
     *
     * @return {Service}
     */
    .service("artistsManager", function ($http) {
        var artists;

        this.setArtists = function (artists) {
            artists = artists;
        };

        this.getArtists = function () {
            return artists;
        };

        this.getArtist = function (id) {
            for (var a in artists) {
                if (artists[a].id == id) {
                    return artists[a];
                }
            }
            return null;
        };
    });
