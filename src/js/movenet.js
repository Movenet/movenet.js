var movenet = (function() {
    var internalConfig = {
        apiKey: "AIzaSyAuFypseM3j0A6OcnX3H1MOnv3vYboDBQs",
        authDomain: "movenet-apis.firebaseapp.com",
        databaseURL: "https://movenet-apis.firebaseio.com",
        projectId: "movenet-apis",
        storageBucket: "movenet-apis.appspot.com",
        messagingSenderId: "864507894049"
    };

    movenetinternal.initializeApp(internalConfig);

    function constructAPIEnding(name, callback) {
        movenetinternal.database().ref("apilist/" + name).once("value").then(function(snapshot) {
            if (snapshot.val()["-type"] == "query") {
                var stringBuild = "";

                for (var key in snapshot.val()) {
                    if (snapshot.val().hasOwnProperty(key) && key != "-type") {
                        stringBuild += "&" + key + "=" + snapshot.val()[key];
                    }
                }

                callback(stringBuild);
            }
        });
    }

    return {
        properties: {
            apiKey: null
        },

/*
 * @function movenet.init
 * @params [{"name": "config", "struct": {"apiKey": "string"}}]
 * @info Initialises movenet.js keys.
 */

        init: function(config) {
            this.properties = config;
        },

/*
 * @function movenet.getNearbyStops
 * @params [{"name": "location", "struct": {"latitude": "number", "longitude": "number"}}, {"name": "callback", "struct": "function"}]
 * @return [{"type": "bus/train/metro/tram/ferry/plane/other", "name": "data", "location": {"latitude": "number", "longitude": "number", "accuracy": "number", "hrname": "string"}}]
 * @info Gets nearby stops around location.
 */

        getNearbyStops: function(location, callback) {
            constructAPIEnding("transportapi", function(ending) {
                $.getJSON("https://transportapi.com/v3/uk/places.json?lat=" + location.latitude + "&lon=" + location.longitude + "&type=bus_stop" + ending, function(json) {
                    var build = [];    
                    var typeTranslator = {
                        "bus_stop": "bus",
                        "train_station": "train"
                    };
                
                    for (var i = 0; i < json.member.length; i++) {
                        build.push({
                            "type": typeTranslator[json.member[i].type],
                            "name": json.member[i].name,
                            "location": {
                                "latitude": json.member[i].latitude,
                                "longitude": json.member[i].longitude,
                                "accuracy": json.member[i].accuracy,
                                "hrname": json.member[i].description
                            }
                        });
                    }

                    callback(build);
                });
            });
        }
    };
})();