import fs = require("fs");
import youtubesearchapi = require("youtube-search-api");
import ytdl = require("ytdl-core");
import ytMusic = require("node-youtube-music");

import { Helper } from "./Helper";

const SpotifyWebApi = require("spotify-web-api-node");
const id = "a97738f2a1ba46aa9386d2f7f351dec5";
const secret = fs.readFileSync("./spotifysecret", "utf8");

export class MusicHandler {
  private static api = new SpotifyWebApi({
    clientId: id,
    clientSecret: secret,
    redirectUri: "http://www.example.com/callback",
  });
  static async GetRandomSongsFromPlaylist(
    playlistId = "30YalNqYddehoSL44yETCo",
    amount = 1
  ) {
    this.api.setAccessToken(await this.getAccesToken());
    let retval = [];
    var liste = await this.api.getPlaylist(playlistId); //https://open.spotify.com/playlist/30YalNqYddehoSL44yETCo?si=e7f2c7e83eef45f7
    var length = liste.body.tracks.total;
    let tracks = [];
    for (var i = 0; i < length; i = i + 100) {
      tracks.push.apply(
        tracks,
        (
          await this.api.getPlaylistTracks(playlistId, {
            offset: i,
            limit: 100,
          })
        ).body.items
      );
    }
    for (let i = 0; i < amount && i < 20; i++) {
      retval.push(
        this.apiTrackToText(tracks[Math.floor(Math.random() * tracks.length)])
      );
    }
    return retval;
  }

  static apiTrackToText(track) {
    var artist = track.track.artists[0].name;
    var title = track.track.name;
    return artist + " - " + title;
  }

  static async GetMatchingSongsFromPlaylist(
    playlistId = "30YalNqYddehoSL44yETCo",
    interprets
  ) {
    this.api.setAccessToken(await this.getAccesToken());
    let retval = [];
    var liste: any = [];
    try {
      liste = await this.api.getPlaylist(playlistId); //https://open.spotify.com/playlist/30YalNqYddehoSL44yETCo?si=e7f2c7e83eef45f7
    } catch (e) {
      console.error(e);
    }
    var length = liste.body.tracks.total;
    let tracks = [];
    for (var i = 0; i < length; i = i + 100) {
      tracks.push.apply(
        tracks,
        (
          await this.api.getPlaylistTracks(playlistId, {
            offset: i,
            limit: 100,
          })
        ).body.items
      );
    }
    for (let i = 0; i < length; i++) {
      var song = this.apiTrackToText(tracks[i]);
      for (let j = 0; j < interprets.length; j++) {
        var currentArtist = tracks[i].track.artists[0].name.toLowerCase();
        var toFindArtist = interprets[j].toLowerCase().trim();
        if (currentArtist.includes(toFindArtist)) {
          retval.push(song);
          continue;
        }
      }
    }
    return retval;
  }
  static async getAccesToken() {
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
    var t = await Helper.doRequest(authOptions);
    const hacky: any = t;
    return hacky.access_token;
  }
  public static async getSongInfo(songArgs: string) {
    //arg += ' lyrics -live -karaoke';
    if (Helper.isValidHttpUrl(songArgs)) {
      return await ytdl.getInfo(songArgs);
      //TODO: handle youtube searcher
    } else {
      let liste = await ytMusic.searchMusics(songArgs);
      if (liste.length == 0) {
        return await ytdl.getInfo(
          "https://www.youtube.com/watch?v=lYBUbBu4W08"
        );
      }
      let url = "https://www.youtube.com/watch?v=" + liste[0].youtubeId;
      return await ytdl.getInfo(url);
    }
  }

  public static async getPlaylistInfo(arg: string) {
    if (Helper.isValidHttpUrl(arg)) {
      let liste = await (
        await youtubesearchapi.GetPlaylistData(arg.split("=")[1])
      ).items;
      //const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;
      console.log(liste);
      return await liste; //ytdl.getInfo(url);
    }
  }
}
