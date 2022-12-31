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
exports.CommandHandler = void 0;
var DatabaseHandler_1 = require("./DatabaseHandler");
var Helper_1 = require("./Helper");
var MusicHandler_1 = require("./MusicHandler");
var QueueHandler_1 = require("./QueueHandler");
var Player_1 = require("./Player");
var CommandHandler = /** @class */ (function () {
    function CommandHandler() {
    }
    CommandHandler.prototype.queueCommand = function (message) {
        var serverQueue = QueueHandler_1.QueueHandler.queueGet(message.guild.id);
        if (!serverQueue) {
            return message.channel.send("Es wird nichts abgespielt...");
        }
        else {
            var returnString = "In der Warteschlange:\n";
            for (var i = 1; i < serverQueue.songs.length; i++) {
                returnString += i + ". : " + serverQueue.songs[i].title + "\n";
            }
            message.reply(returnString);
        }
    };
    CommandHandler.prototype.debugCommand = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var matches, i, currentSong, PreferredYouTubeLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.debug(message)];
                    case 1:
                        matches = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < matches.length)) return [3 /*break*/, 5];
                        currentSong = matches[i].Title + " - " + matches[i].RawArtists;
                        PreferredYouTubeLink = matches[i].PreferredYouTubeLink;
                        if (PreferredYouTubeLink != "") {
                            currentSong = PreferredYouTubeLink;
                        }
                        message.content = ".p " + currentSong;
                        // message.reply(message.content)
                        return [4 /*yield*/, this.playCommand(message)];
                    case 3:
                        // message.reply(message.content)
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.debug = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, playlistId, matches, toQueue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amount = Helper_1.Helper.getArgSlice(message, 1);
                        playlistId = parseInt(Helper_1.Helper.getArgSlice(message, 1));
                        return [4 /*yield*/, DatabaseHandler_1.DatabaseHandler.getPlaylistFromDatabase(playlistId)];
                    case 1:
                        matches = _a.sent();
                        toQueue = [];
                        if (amount >= matches.length) {
                            toQueue = matches;
                            //shuffle toQueue
                            toQueue = toQueue.sort(function (a, b) { return 0.5 - Math.random(); });
                            for (i = matches.length; i < amount; i++) {
                                // add a random entry of matches to toQueue
                                toQueue.push(matches[Math.floor(Math.random() * matches.length)]);
                            }
                        }
                        else {
                            toQueue = matches.sort(function (a, b) { return 0.5 - Math.random(); }).slice(0, amount);
                        }
                        return [2 /*return*/, toQueue];
                }
            });
        });
    };
    CommandHandler.prototype.randomCommand = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var length, titles, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        length = message.content.length > 8 ? parseInt(Helper_1.Helper.getNthWord(message.content, 2)) : 1;
                        if (length > 10)
                            length = 10;
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.spotify("30YalNqYddehoSL44yETCo", length)];
                    case 1:
                        titles = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < titles.length)) return [3 /*break*/, 5];
                        message.content = ".p " + titles[i];
                        // message.reply(message.content)
                        return [4 /*yield*/, this.playCommand(message)];
                    case 3:
                        // message.reply(message.content)
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.interpretCommand = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var titles, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fabian(message, "30YalNqYddehoSL44yETCo")];
                    case 1:
                        titles = _a.sent();
                        if (titles.length == 0) {
                            message.reply("Gibs keine Beweise");
                        }
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < titles.length)) return [3 /*break*/, 5];
                        message.content = ".p " + titles[i];
                        // message.reply(message.content)
                        return [4 /*yield*/, this.playCommand(message)];
                    case 3:
                        // message.reply(message.content)
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.spotifyCommand = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var spotLink, spotId, count, titles, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spotLink = Helper_1.Helper.getNthWord(message.content, 2);
                        spotId = Helper_1.Helper.getSpotifyPlaylistId(spotLink);
                        count = 1;
                        try {
                            count = parseInt(Helper_1.Helper.getNthWord(message.content, 3));
                        }
                        catch (ex) {
                            message.reply(ex);
                        }
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.spotify(spotId, count)];
                    case 1:
                        titles = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < titles.length)) return [3 /*break*/, 5];
                        message.content = ".p " + titles[i];
                        // message.reply(message.content)
                        return [4 /*yield*/, this.playCommand(message)];
                    case 3:
                        // message.reply(message.content)
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.playCommand = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var voiceChannel, permissions, songInfo, song;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        voiceChannel = message.member.voice.channel;
                        if (!voiceChannel)
                            return [2 /*return*/, message.channel.send("Du bist in keinem Voice.")];
                        permissions = voiceChannel.permissionsFor(message.client.user);
                        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                            return [2 /*return*/, message.channel.send("Mir fehlen Rechte!")];
                        }
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.getSongInfo(Helper_1.Helper.getArgSlices(message, 1).join(" "))];
                    case 1:
                        songInfo = _a.sent();
                        song = Helper_1.Helper.songInfoToSongObject(songInfo);
                        Player_1.Player.play_or_queue(voiceChannel, message, song);
                        return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.forcePlayCommand = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var voiceChannel, permissions, songInfo, song;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        voiceChannel = message.member.voice.channel;
                        if (!voiceChannel)
                            return [2 /*return*/, message.channel.send("Du bist in keinem Voice.")];
                        permissions = voiceChannel.permissionsFor(message.client.user);
                        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                            return [2 /*return*/, message.channel.send("Mir fehlen Rechte!")];
                        }
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.getSongInfo(Helper_1.Helper.getArgSlices(message, 1).join(" "))];
                    case 1:
                        songInfo = _a.sent();
                        song = Helper_1.Helper.songInfoToSongObject(songInfo);
                        Player_1.Player.AttachInFront(voiceChannel, message, song);
                        return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.skipCommand = function (message) {
        var serverQueue = QueueHandler_1.QueueHandler.queueGet(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send("Du bist in keinem Voice!");
        if (!serverQueue)
            return message.channel.send("Queue ist leer!");
        serverQueue.connection.dispatcher.end();
    };
    CommandHandler.prototype.clearQueueCommand = function (message) {
        var serverQueue = QueueHandler_1.QueueHandler.queueGet(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send("Du bist in keinem Voice!");
        if (!serverQueue)
            return message.channel.send("Queue ist leer!");
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    };
    CommandHandler.prototype.playlistCommand = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var voiceChannel, permissions, playlistInfo, i, song;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        voiceChannel = message.member.voice.channel;
                        if (!voiceChannel)
                            return [2 /*return*/, message.channel.send("Du bist in keinem Voice.")];
                        permissions = voiceChannel.permissionsFor(message.client.user);
                        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                            return [2 /*return*/, message.channel.send("Mir fehlen Rechte!")];
                        }
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.getPlaylistInfo(Helper_1.Helper.getArgSlices(message, 1).join(" "))];
                    case 1:
                        playlistInfo = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < playlistInfo.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, Helper_1.Helper.youtubeIdToSongObject(playlistInfo[i].id)];
                    case 3:
                        song = _a.sent();
                        Player_1.Player.play_or_queue(voiceChannel, message, song);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.sayCommand = function (message) {
        var answer = message.content.slice(5);
        message.channel.send(answer);
        message.delete();
    };
    CommandHandler.prototype.fabian = function (message, playlistId) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, interprets, matches, toQueue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amount = parseInt(Helper_1.Helper.getArgSlice(message, 1));
                        interprets = Helper_1.Helper.getArgSlices(message, 2).join(" ").split("|");
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.GetMatchingSongsFromPlaylist(playlistId, interprets)];
                    case 1:
                        matches = _a.sent();
                        toQueue = [];
                        if (matches.length == 0)
                            return [2 /*return*/, toQueue];
                        if (amount >= matches.length) {
                            toQueue = matches;
                            //shuffle toQueue
                            toQueue = toQueue.sort(function (a, b) { return 0.5 - Math.random(); });
                            for (i = matches.length; i < amount; i++) {
                                // add a random entry of matches to toQueue
                                toQueue.push(matches[Math.floor(Math.random() * matches.length)]);
                            }
                        }
                        else {
                            toQueue = matches.sort(function (a, b) { return 0.5 - Math.random(); }).slice(0, amount);
                        }
                        return [2 /*return*/, toQueue];
                }
            });
        });
    };
    return CommandHandler;
}());
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map