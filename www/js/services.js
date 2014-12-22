/*global window*/
/*
 * TODO find a way to put those variables inside a 
 * config object
 * */
(function (angular) {
    "use strict";
    var serverLocation = "http://192.168.1.28:4000";

    angular
        .module("2440.services", ["ngCordova"])

        /**
         * the inital service that will takes care of loading all the
         * necessary datas for the app to work
         *
         * @return {Service}
         */
        .service("appLoader", function ($http, $q, $timeout, artistsManager) {
            this.load = function () {
                var artists = artistsManager.load();
                return $q.all([artists, $timeout(function () { return "loaded"; }, 1000)]);
            };
        })

        /**
         * manage all that is related to the artists
         *
         * @return {Service}
         */
        .service("artistsManager", function ($http, $q, $window) {
            var artists;

            /**
             * load
             *
             * @param {boolean} forceUpdate force downloading an update of the artists' list
             * @return {Promise} a promise that calls success when the artists list is ready
             */
            this.load = function (forceUpdate) {
                var storageValue = $window.localStorage.getItem("artists"),
                    deferred = $q.defer();
                if (!forceUpdate && storageValue) {
                    artists = JSON.parse(storageValue);
                    deferred.resolve(artists);
                    return deferred.promise;
                }

                //if not in cache or we want to force the update
                //then check online
                var c = $window.angular.callbacks.counter.toString(36);

                //as the datas are hosted on a statically generated site
                //they cannot adapt to a dynamic jsonp callback
                //so we need to override the auto-generated angular callback
                //by the one that is hard coded in the site jsonp
                $window.parseArtists = function (data) {
                    $window.angular.callbacks["_" + c](data);
                    delete $window["angularcallbacks_" + c];
                };
                artists = $http.jsonp(serverLocation + "/artists.json.js" + "?callback=JSON_CALLBACK");
                return artists.success(function (data) {
                    artists = data;
                    artists.map(function (art) {
                        var dateStr = (art.date + " " + art.hour)
                            .replace(/\w* /, "")
                            .replace("Mai", "May 2015");

                        art.datetime = new Date(dateStr + " UTC");

                        art.image = serverLocation + art.image;
                    });
                    $window.localStorage.setItem("artists", JSON.stringify(data));
                });
            };

            /**
             * getArtists - returns a copy of the artists list
             *
             * @return {Array} the artists list
             */
            this.getArtists = function () {
                return artists.map(function (element) { return element; });
            };

            this.getArtist = function (id) {
                for (var a in artists) {
                    if (artists[a].id === id) {
                        return artists[a];
                    }
                }
                return null;
            };
        })

        .service("calendarManager", function ($window, $cordovaCalendar) {
            var added = [];

            this.isAdded = function (artist) {
                return added.reduce(function (previous, current) {
                    return previous || current.id === artist.id;
                }, false);
            };

            this.add = function (artist) {
                added.push(artist);
                var endDate = new Date(artist.datetime);
                endDate.setHours(endDate.getHours() + 1);
                if (!$window.plugins) {
                    console.log("event added");
                    console.log(artist.datetime, endDate);
                    return;
                }
                $cordovaCalendar.createEvent({
                    title: artist.name,
                    location: "2440 Festival",
                    startDate: artist.datetime,
                    endDate: endDate
                }).then(function (result) {}, function (err) {});
            };
        })
        ;
}(window.angular));
