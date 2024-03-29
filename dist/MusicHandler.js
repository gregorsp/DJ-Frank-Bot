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
exports.MusicHandler = void 0;
var fs = require("fs");
var youtubesearchapi = require("youtube-search-api");
var ytdl = require("ytdl-core");
var ytMusic = require("node-youtube-music");
var Helper_1 = require("./Helper");
var SpotifyWebApi = require("spotify-web-api-node");
var id = "a97738f2a1ba46aa9386d2f7f351dec5";
var secret = fs.readFileSync("./spotifysecret", "utf8");
var MusicHandler = /** @class */ (function () {
    function MusicHandler() {
    }
    MusicHandler.GetRandomSongsFromPlaylist = function (playlistId, amount) {
        if (playlistId === void 0) { playlistId = "30YalNqYddehoSL44yETCo"; }
        if (amount === void 0) { amount = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, retval, liste, length, tracks, i, _c, _d, _e, i_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _b = (_a = this.api).setAccessToken;
                        return [4 /*yield*/, this.getAccesToken()];
                    case 1:
                        _b.apply(_a, [_f.sent()]);
                        retval = [];
                        return [4 /*yield*/, this.api.getPlaylist(playlistId)];
                    case 2:
                        liste = _f.sent();
                        length = liste.body.tracks.total;
                        tracks = [];
                        i = 0;
                        _f.label = 3;
                    case 3:
                        if (!(i < length)) return [3 /*break*/, 6];
                        _d = (_c = tracks.push).apply;
                        _e = [tracks];
                        return [4 /*yield*/, this.api.getPlaylistTracks(playlistId, {
                                offset: i,
                                limit: 100,
                            })];
                    case 4:
                        _d.apply(_c, _e.concat([(_f.sent()).body.items]));
                        _f.label = 5;
                    case 5:
                        i = i + 100;
                        return [3 /*break*/, 3];
                    case 6:
                        for (i_1 = 0; i_1 < amount && i_1 < 20; i_1++) {
                            retval.push(this.apiTrackToText(tracks[Math.floor(Math.random() * tracks.length)]));
                        }
                        return [2 /*return*/, retval];
                }
            });
        });
    };
    MusicHandler.apiTrackToText = function (track) {
        var artist = track.track.artists[0].name;
        var title = track.track.name;
        return artist + " - " + title;
    };
    MusicHandler.GetMatchingSongsFromPlaylist = function (playlistId, interprets) {
        if (playlistId === void 0) { playlistId = "30YalNqYddehoSL44yETCo"; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, retval, liste, e_1, length, tracks, i, _c, _d, _e, i_2, song, j, currentArtist, toFindArtist;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _b = (_a = this.api).setAccessToken;
                        return [4 /*yield*/, this.getAccesToken()];
                    case 1:
                        _b.apply(_a, [_f.sent()]);
                        retval = [];
                        liste = [];
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.api.getPlaylist(playlistId)];
                    case 3:
                        liste = _f.sent(); //https://open.spotify.com/playlist/30YalNqYddehoSL44yETCo?si=e7f2c7e83eef45f7
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _f.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        length = liste.body.tracks.total;
                        tracks = [];
                        i = 0;
                        _f.label = 6;
                    case 6:
                        if (!(i < length)) return [3 /*break*/, 9];
                        _d = (_c = tracks.push).apply;
                        _e = [tracks];
                        return [4 /*yield*/, this.api.getPlaylistTracks(playlistId, {
                                offset: i,
                                limit: 100,
                            })];
                    case 7:
                        _d.apply(_c, _e.concat([(_f.sent()).body.items]));
                        _f.label = 8;
                    case 8:
                        i = i + 100;
                        return [3 /*break*/, 6];
                    case 9:
                        for (i_2 = 0; i_2 < length; i_2++) {
                            song = this.apiTrackToText(tracks[i_2]);
                            for (j = 0; j < interprets.length; j++) {
                                currentArtist = tracks[i_2].track.artists[0].name.toLowerCase();
                                toFindArtist = interprets[j].toLowerCase().trim();
                                if (currentArtist.includes(toFindArtist)) {
                                    retval.push(song);
                                    continue;
                                }
                            }
                        }
                        return [2 /*return*/, retval];
                }
            });
        });
    };
    MusicHandler.getAccesToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authOptions, t, hacky;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authOptions = {
                            url: "https://accounts.spotify.com/api/token",
                            headers: {
                                Authorization: "Basic " + new Buffer(id + ":" + secret).toString("base64"),
                            },
                            form: {
                                grant_type: "client_credentials",
                            },
                            json: true,
                        };
                        return [4 /*yield*/, Helper_1.Helper.doRequest(authOptions)];
                    case 1:
                        t = _a.sent();
                        hacky = t;
                        return [2 /*return*/, hacky.access_token];
                }
            });
        });
    };
    MusicHandler.getSongInfo = function (songArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var liste, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Helper_1.Helper.isValidHttpUrl(songArgs)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ytdl.getInfo(songArgs)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, ytMusic.searchMusics(songArgs)];
                    case 3:
                        liste = _a.sent();
                        if (!(liste.length == 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, ytdl.getInfo("https://www.youtube.com/watch?v=lYBUbBu4W08")];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        url = "https://www.youtube.com/watch?v=" + liste[0].youtubeId;
                        return [4 /*yield*/, ytdl.getInfo(url)];
                    case 6: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MusicHandler.getPlaylistInfo = function (arg) {
        return __awaiter(this, void 0, void 0, function () {
            var liste;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Helper_1.Helper.isValidHttpUrl(arg)) return [3 /*break*/, 4];
                        return [4 /*yield*/, youtubesearchapi.GetPlaylistData(arg.split("=")[1])];
                    case 1: return [4 /*yield*/, (_a.sent()).items];
                    case 2:
                        liste = _a.sent();
                        //const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;
                        console.log(liste);
                        return [4 /*yield*/, liste];
                    case 3: return [2 /*return*/, _a.sent()]; //ytdl.getInfo(url);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MusicHandler.spotify = function (playlistId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MusicHandler.GetRandomSongsFromPlaylist(playlistId, amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MusicHandler.api = new SpotifyWebApi({
        clientId: id,
        clientSecret: secret,
        redirectUri: "http://www.example.com/callback",
    });
    return MusicHandler;
}());
exports.MusicHandler = MusicHandler;
//# sourceMappingURL=MusicHandler.js.map