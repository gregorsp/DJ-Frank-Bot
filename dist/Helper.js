"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
var request = require("request");
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.doRequest = function (url) {
        return new Promise(function (resolve, reject) {
            request.post(url, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(body);
                }
                else {
                    reject(error);
                }
            });
        });
    };
    Helper.isValidHttpUrl = function (string) {
        var url;
        try {
            url = new URL(string);
        }
        catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    };
    Helper.getNthWord = function (text, n) {
        return text.split(" ")[n - 1];
    };
    Helper.getSpotifyPlaylistId = function (link) {
        // https://open.spotify.com/playlist/7ktaQvt898S3BYWkO90gFu?si=54b6547bf49a4d87
        var a = link.split("/");
        var b = a.slice(-1)[0];
        var c = b.split("?");
        var d = c.slice(0)[0];
        return d;
    };
    Helper.songInfoToSongObject = function (songInfo) {
        return {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            videoDetails: songInfo.videoDetails,
        };
    };
    return Helper;
}());
exports.Helper = Helper;
//# sourceMappingURL=Helper.js.map