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
var ytdl = require("ytdl-core");
var DatabaseHandler_1 = require("./DatabaseHandler");
var Helper_1 = require("./Helper");
var MusicHandler_1 = require("./MusicHandler");
var QueueHandler_1 = require("./QueueHandler");
var MessageHandler_1 = require("./MessageHandler");
var CommandHandler = /** @class */ (function () {
    function CommandHandler() {
    }
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
            var args, amount, playlistId, matches, toQueue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = message.content.split(" ");
                        amount = args.slice(1)[0];
                        playlistId = parseInt(args.slice(2)[0]);
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
                        length = message.content.length > 8
                            ? parseInt(Helper_1.Helper.getNthWord(message.content, 2))
                            : 1;
                        if (length > 10)
                            length = 10;
                        return [4 /*yield*/, this.spotify("30YalNqYddehoSL44yETCo", length)];
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
                        return [4 /*yield*/, this.spotify(spotId, count)];
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
            var serverQueue, args, voiceChannel, permissions, songInfo, song;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serverQueue = QueueHandler_1.QueueHandler.queueGet(message.guild.id);
                        args = message.content.split(" ");
                        voiceChannel = message.member.voice.channel;
                        if (!voiceChannel)
                            return [2 /*return*/, message.channel.send("Du bist in keinem Voice.")];
                        permissions = voiceChannel.permissionsFor(message.client.user);
                        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                            return [2 /*return*/, message.channel.send("Mir fehlen Rechte!")];
                        }
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.getSongInfo(args.slice(1).join(" "))];
                    case 1:
                        songInfo = _a.sent();
                        song = this.songInfoToSongObject(songInfo);
                        if (!serverQueue) {
                            serverQueue = QueueHandler_1.QueueHandler.setServerQueue(message);
                            serverQueue.songs.push(song);
                            this.tryPlay(voiceChannel, serverQueue, message);
                        }
                        else {
                            serverQueue.songs.push(song);
                            return [2 /*return*/, message.channel.send("".concat(song.title, " wurde zur Queue hinzugef\u00FCgt!"))];
                        }
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
            var serverQueue, args, voiceChannel, permissions, playlistInfo, emptyQueue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serverQueue = QueueHandler_1.QueueHandler.queueGet(message.guild.id);
                        args = message.content.split(" ");
                        voiceChannel = message.member.voice.channel;
                        if (!voiceChannel)
                            return [2 /*return*/, message.channel.send("Du bist in keinem Voice.")];
                        permissions = voiceChannel.permissionsFor(message.client.user);
                        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                            return [2 /*return*/, message.channel.send("Mir fehlen Rechte!")];
                        }
                        return [4 /*yield*/, MusicHandler_1.MusicHandler.getPlaylistInfo(args.slice(1).join(" "))];
                    case 1:
                        playlistInfo = _a.sent();
                        console.log(playlistInfo);
                        emptyQueue = false;
                        if (!serverQueue) {
                            serverQueue = QueueHandler_1.QueueHandler.setServerQueue(message);
                            emptyQueue = true;
                        }
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < playlistInfo.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, QueueHandler_1.QueueHandler.queueAdd(playlistInfo[i].id, serverQueue, message)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (emptyQueue) {
                            this.tryPlay(voiceChannel, serverQueue, message);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.sayCommand = function (message) {
        var answer = message.content.slice(5);
        message.channel.send(answer);
        message.delete();
    };
    CommandHandler.prototype.spotify = function (playlistId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MusicHandler_1.MusicHandler.GetRandomSongsFromPlaylist(playlistId, amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommandHandler.prototype.fabian = function (message, playlistId) {
        return __awaiter(this, void 0, void 0, function () {
            var args, amount, interprets, matches, toQueue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = message.content.split(" ");
                        amount = parseInt(args.slice(1)[0]);
                        interprets = args.slice(2).join(" ").split("|");
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
    CommandHandler.prototype.songInfoToSongObject = function (songInfo) {
        return {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            videoDetails: songInfo.videoDetails,
        };
    };
    CommandHandler.prototype.tryPlay = function (voiceChannel, serverQueue, message) {
        return __awaiter(this, void 0, void 0, function () {
            var errCounter, connection, err_1, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errCounter = 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        _a.label = 2;
                    case 2:
                        if (!(errCounter < 3)) return [3 /*break*/, 7];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, voiceChannel.join()];
                    case 4:
                        connection = _a.sent();
                        connection.on("disconnect", function (event) {
                            QueueHandler_1.QueueHandler.queueDelete(message.guild.id);
                            message.channel.send("Die Party ist vorbei!");
                        });
                        serverQueue.connection = connection;
                        this.reallyPlay(message.guild, serverQueue.songs[0]);
                        errCounter = 10000;
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        if (errCounter == 3) {
                            throw err_1;
                        }
                        console.log(err_1);
                        errCounter++;
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_2 = _a.sent();
                        console.log(err_2);
                        QueueHandler_1.QueueHandler.queueDelete(message.guild.id);
                        return [2 /*return*/, message.channel.send(err_2)];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.reallyPlay = function (guild, song) {
        var _this = this;
        var serverQueue = QueueHandler_1.QueueHandler.queueGet(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            QueueHandler_1.QueueHandler.queueDelete(guild.id);
            return;
        }
        var dispatcher = serverQueue.connection
            .play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25 }))
            .on("finish", function () {
            serverQueue.songs.shift();
            _this.reallyPlay(guild, serverQueue.songs[0]);
        })
            .on("error", function (error) {
            console.error(error);
            serverQueue.textChannel.send("Fehler beim abspielen:\n" + error);
            // serverQueue.songs.shift();
            _this.reallyPlay(guild, serverQueue.songs[0]);
        });
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        MessageHandler_1.MessageHandler.sendSongToChat(serverQueue, song);
    };
    return CommandHandler;
}());
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map