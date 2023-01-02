"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
var request = require("request");
var interfaces_1 = require("./interfaces");
var MusicHandler_1 = require("./MusicHandler");
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
    Helper.youtubeIdToSongObject = function (youtubeId) {
        return __awaiter(this, void 0, void 0, function () {
            var arg, songInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arg = "https://www.youtube.com/watch?v=" + youtubeId;
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.getSongInfo(arg)];
                    case 1:
                        songInfo = _a.sent();
                        return [2 /*return*/, new interfaces_1.Song(songInfo.videoDetails.title, songInfo.videoDetails.video_url, songInfo.videoDetails)];
                }
            });
        });
    };
    Helper.getArgSlice = function (message, i, skipFirst) {
        if (skipFirst === void 0) { skipFirst = false; }
        if (skipFirst) {
            i++;
        }
        return message.content.split(" ")[i];
    };
    Helper.getArgSlices = function (message, skipAmount, skipFirst) {
        if (skipAmount === void 0) { skipAmount = 0; }
        if (skipFirst === void 0) { skipFirst = false; }
        if (skipFirst) {
            skipAmount++;
        }
        return message.content.split(" ").slice(skipAmount);
    };
    Helper.dbSongToSongObject = function (dbSong) {
        return __awaiter(this, void 0, void 0, function () {
            var songInfo, song;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(dbSong.PreferredYouTubeLink != "")) return [3 /*break*/, 2];
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.getSongInfo(dbSong.PreferredYouTubeLink)];
                    case 1:
                        songInfo = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, MusicHandler_1.MusicHandler.getSongInfo(dbSong.Title + " - " + dbSong.RawArtists)];
                    case 3:
                        songInfo = _a.sent();
                        _a.label = 4;
                    case 4:
                        song = Helper.songInfoToSongObject(songInfo);
                        return [2 /*return*/, song];
                }
            });
        });
    };
    return Helper;
}());
exports.Helper = Helper;
//# sourceMappingURL=Helper.js.map