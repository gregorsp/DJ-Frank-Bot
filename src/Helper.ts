import request = require("request");

export class Helper {
  static doRequest(url) {
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
  static isValidHttpUrl(string: string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }
  static getNthWord(text: string, n: number) {
    return text.split(" ")[n - 1];
  }
  static getSpotifyPlaylistId(link: string) {
    // https://open.spotify.com/playlist/7ktaQvt898S3BYWkO90gFu?si=54b6547bf49a4d87
    var a = link.split("/");
    var b = a.slice(-1)[0];
    var c = b.split("?");
    var d = c.slice(0)[0];
    return d;
  }
}
