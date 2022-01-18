var SpotifyWebApi = require("spotify-web-api-node");
const fs = require("fs");
const request = require("request");

const id = "a97738f2a1ba46aa9386d2f7f351dec5";
const secret = fs.readFileSync("./spotifysecret", "utf8");

let tracks = [];

var api = new SpotifyWebApi({
  clientId: id,
  clientSecret: secret,
  redirectUri: "http://www.example.com/callback",
});

const getAccesToken = async () => {
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " + new Buffer(id + ":" + secret).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };
  /*
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var token = body.access_token;
    }
  });*/
  var t = await doRequest(authOptions);
  return t.access_token;
};

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request.post(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

const test = async (message) => {
  if (tracks.length == 0) {
    api.setAccessToken(await getAccesToken());
    var liste = await api.getPlaylist("30YalNqYddehoSL44yETCo"); //https://open.spotify.com/playlist/30YalNqYddehoSL44yETCo?si=e7f2c7e83eef45f7
    var length = liste.body.tracks.total;
    tracks = [];
    for (var i = 0; i < length; i = i + 100) {
      tracks.push.apply(
        tracks,
        (
          await api.getPlaylistTracks("30YalNqYddehoSL44yETCo", {
            offset: i,
            limit: 100,
          })
        ).body.items
      );
    }
  }
  return apiTrackToText(tracks[Math.floor(Math.random() * tracks.length)]);
};

const apiTrackToText = (track) => {
  var artist = track.track.artists[0].name;
  var title = track.track.name;
  return artist + " - " + title;
};
module.exports = { test };
