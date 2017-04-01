var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require("fs")

var action = process.argv[2];
var endNumber = process.argv.length;
var value = process.argv.slice(3, endNumber);

var getKeys = require("./keys.js");
var keyList = getKeys.twitterKeys;

//FUNCTIONS=========================================================
//myTweets FUNCTION DEFINITION
function myTweets() {
    var client = new Twitter({
        consumer_key: keyList.consumer_key,
        consumer_secret: keyList.consumer_secret,
        access_token_key: keyList.access_token_key,
        access_token_secret: keyList.access_token_secret
    });

    var params = {
        screen_name: "jennyryn96",
        count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log("==========MY TweetStory (Get it? Tweets + History?!)=================");
            for (i = 0; i < tweets.length; i++) {
                console.log("TWEET: " + tweets[i].text + "\nDATE: " + tweets[i].created_at
                    + "\n----------------------------------------");
            } // end of for loop
        }
    }); // end of .get
} // end of myTweets function
//myTweets();

// spotifyThis FUNCTION DEFINITION 
function spotifyThis(songName) {
    if (songName.length === 0) {
        var defaultSong = "The Sign Ace of Base";
        spotify.search({ type: 'track', query: defaultSong }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            } else {
                var songInfo = data.tracks.items[0];
                console.log("===============SPOTIFY THE DEFAULT SONG================")
                console.log("SONG: " + songInfo.name + "\nARTIST: " + songInfo.artists[0].name + "\nALBUM: "
                    + songInfo.album.name + "\nSPOTIFY LINK: " + songInfo.href);
            }; //end of songName null else
        });  //end of spotify.search for null
    } else {
        spotify.search({ type: "track", query: songName }, function (err, data) {
            if (err) {
                console.log("error occurred: " + err);
                return;
            } else {
                var songInfo = data.tracks.items[0];
                console.log("===============SPOTIFY THIS SONG=================")
                console.log("SONG: " + songInfo.name + "\nARTIST: " + songInfo.artists[0].name + "\nALBUM: "
                    + songInfo.album.name + "\nSPOTIFY LINK: " + songInfo.href);
            } // end of else for spotify.search with song
        }); //end of spotify.search with song name input 
    } //end of overall else
};  // end of spotify function 
//spotifyThis(value);

//OMDB FUNCTION DEFINITION
function movieThis(movieQuery) {
    var movieName = "";
    var rottenName = "";
    if (movieQuery.length == 0) {
        movieName = "Mr+Nobody";
        rottenName = "Mr_Nobody";
    } else if (movieQuery.length == 1) {
        movieName = movieQuery;
        rottenName = movieQuery;
    } else {
        movieName = movieQuery[0];
        for (var i = 1; i < movieQuery.length; i++) {
            movieName = movieName + "+" + movieQuery[i];
        }; // end of movieName for loop
        rottenName = movieQuery[0];
        for (var i = 1; i < movieQuery.length; i++) {
            rottenName = rottenName + "_" + movieQuery[i];
        }; // end of RT for loop
    }; // end of final else

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("==============MOVIE THIS===================")
            console.log("TITLE: " + JSON.parse(body).Title +
                "\nRELEASE YEAR: " + JSON.parse(body).Released +
                "\nIMDB RATING: " + JSON.parse(body).imdbRating +
                "\nCOUNTRY OF RELEASE: " + JSON.parse(body).Country +
                "\nLANGUAGE: " + JSON.parse(body).Language +
                "\nPLOT: " + JSON.parse(body).Plot +
                "\nACTORS: " + JSON.parse(body).Actors +
                "\nROTTEN TOMATOES RATING: " + JSON.parse(body).Ratings[1].Value +
                "\nROTTEN TOMATOES LINK: " + "https://www.rottentomatoes.com/m/" + rottenName)
        };
    }); //end of request
}; //end of moviethis function
//movieThis(value);

//doWhat FUNCTION DEFINITION
function doWhat() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        data = data.split(',');
        console.log(data[0]);
        console.log(data[1]);
        action = data[0];
        value = data[1];
        spotifyThis(value);
    }) // end of doWhat readFile function
}

//MAIN PROCESS--switch cases to call function depending on user input=======================
switch (action) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifyThis(value);
        break;

    case "movie-this":
        movieThis(value);
        break;

    case "do-what-it-says":
        doWhat(value);
        break;
}