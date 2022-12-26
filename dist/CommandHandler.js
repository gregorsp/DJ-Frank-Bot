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
var discord_js_1 = require("discord.js");
var fs = require("fs");
var sql = require("mssql");
var ytMusic = require("node-youtube-music");
var request = require("request");
var SpotifyWebApi = require("spotify-web-api-node");
var youtubesearchapi = require("youtube-search-api");
var ytdl = require("ytdl-core");
var prefix = ".";
var id = "a97738f2a1ba46aa9386d2f7f351dec5";
var CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");
var secret = fs.readFileSync("./spotifysecret", "utf8");
var CommandHandler = /** @class */ (function () {
    function CommandHandler() {
        this.queue = new Map();
        this.api = new SpotifyWebApi({
            clientId: id,
            clientSecret: secret,
            redirectUri: "http://www.example.com/callback",
        });
    }
    CommandHandler.prototype.play = function (message, serverQueue) {
        return __awaiter(this, void 0, void 0, function () {
            var args, voiceChannel, permissions, songInfo, song;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = message.content.split(" ");
                        voiceChannel = message.member.voice.channel;
                        if (!voiceChannel)
                            return [2 /*return*/, message.channel.send("Du bist in keinem Voice.")];
                        permissions = voiceChannel.permissionsFor(message.client.user);
                        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                            return [2 /*return*/, message.channel.send("Mir fehlen Rechte!")];
                        }
                        return [4 /*yield*/, this.getSongInfo(args.slice(1).join(" "))];
                    case 1:
                        songInfo = _a.sent();
                        song = this.songInfoToSongObject(songInfo);
                        if (!serverQueue) {
                            serverQueue = this.setServerQueue(message);
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
    CommandHandler.prototype.skip = function (message, serverQueue) {
        if (!message.member.voice.channel)
            return message.channel.send("Du bist in keinem Voice!");
        if (!serverQueue)
            return message.channel.send("Queue ist leer!");
        serverQueue.connection.dispatcher.end();
    };
    CommandHandler.prototype.clearQueue = function (message, serverQueue) {
        if (!message.member.voice.channel)
            return message.channel.send("Du bist in keinem Voice!");
        if (!serverQueue)
            return message.channel.send("Queue ist leer!");
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    };
    CommandHandler.prototype.playlist = function (message, serverQueue) {
        return __awaiter(this, void 0, void 0, function () {
            var args, voiceChannel, permissions, playlistInfo, emptyQueue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = message.content.split(" ");
                        voiceChannel = message.member.voice.channel;
                        if (!voiceChannel)
                            return [2 /*return*/, message.channel.send("Du bist in keinem Voice.")];
                        permissions = voiceChannel.permissionsFor(message.client.user);
                        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                            return [2 /*return*/, message.channel.send("Mir fehlen Rechte!")];
                        }
                        return [4 /*yield*/, this.getPlaylistInfo(args.slice(1).join(" "))];
                    case 1:
                        playlistInfo = _a.sent();
                        console.log(playlistInfo);
                        emptyQueue = false;
                        if (!serverQueue) {
                            serverQueue = this.setServerQueue(message);
                            emptyQueue = true;
                        }
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < playlistInfo.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.queueAdd(playlistInfo[i].id, serverQueue, message)];
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
                        console.log(serverQueue.songs);
                        return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.say = function (message) {
        this.sayCommand(message);
    };
    CommandHandler.prototype.spotify = function (playlistId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetRandomSongsFromPlaylist(playlistId, amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommandHandler.prototype.fabian = function (message, serverQueue, playlistId) {
        return __awaiter(this, void 0, void 0, function () {
            var args, amount, interprets, matches, toQueue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = message.content.split(" ");
                        amount = parseInt(args.slice(1)[0]);
                        interprets = args.slice(2).join(" ").split("|");
                        return [4 /*yield*/, this.GetMatchingSongsFromPlaylist(playlistId, interprets)];
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
    CommandHandler.prototype.debug = function (message, serverQueue) {
        return __awaiter(this, void 0, void 0, function () {
            var args, amount, playlistId, matches, toQueue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = message.content.split(" ");
                        amount = args.slice(1)[0];
                        playlistId = parseInt(args.slice(2)[0]);
                        return [4 /*yield*/, this.getPlaylistFromDatabase(playlistId)];
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
    CommandHandler.prototype.getPlaylistFromDatabase = function (playlistId) {
        return __awaiter(this, void 0, void 0, function () {
            var QUERY, pool, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        QUERY = "DECLARE\t@return_value int\n    \n      EXEC\t@return_value = [dbo].[GetSongsByPlaylistId]\n              @playlistId = ".concat(playlistId, "\n      \n      SELECT\t'Return Value' = @return_value");
                        return [4 /*yield*/, sql.connect(CONNECTIONSTRING)];
                    case 1:
                        pool = _a.sent();
                        return [4 /*yield*/, pool.request().query(QUERY)];
                    case 2:
                        result = _a.sent();
                        // return the result
                        return [2 /*return*/, result.recordset];
                }
            });
        });
    };
    CommandHandler.prototype.isValidHttpUrl = function (string) {
        var url;
        try {
            url = new URL(string);
        }
        catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    };
    CommandHandler.prototype.setServerQueue = function (message) {
        var queueContruct = {
            textChannel: message.channel,
            voiceChannel: message.member.voice.channel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        this.queueSet(message.guild.id, queueContruct);
        return this.queueGet(message.guild.id);
    };
    CommandHandler.prototype.songInfoToSongObject = function (songInfo) {
        return {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            videoDetails: songInfo.videoDetails,
        };
    };
    CommandHandler.prototype.getNthWord = function (text, n) {
        return text.split(" ")[n - 1];
    };
    CommandHandler.prototype.getSpotifyPlaylistId = function (link) {
        // https://open.spotify.com/playlist/7ktaQvt898S3BYWkO90gFu?si=54b6547bf49a4d87
        var a = link.split("/");
        var b = a.slice(-1)[0];
        var c = b.split("?");
        var d = c.slice(0)[0];
        return d;
    };
    CommandHandler.prototype.tryPlay = function (voiceChannel, serverQueue, message) {
        return __awaiter(this, void 0, void 0, function () {
            var errCounter, connection, err_1, err_2;
            var _this = this;
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
                            _this.queueDelete(message.guild.id);
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
                        this.queueDelete(message.guild.id);
                        return [2 /*return*/, message.channel.send(err_2)];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.reallyPlay = function (guild, song) {
        var _this = this;
        var serverQueue = this.queueGet(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            this.queueDelete(guild.id);
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
        this.sendSongToChat(serverQueue, song);
    };
    CommandHandler.prototype.queueGet = function (guildId) {
        return this.queue.get(guildId);
    };
    CommandHandler.prototype.queueSet = function (guildId, queueContruct) {
        return this.queue.set(guildId, queueContruct);
    };
    CommandHandler.prototype.queueDelete = function (guildId) {
        return this.queue.delete(guildId);
    };
    CommandHandler.prototype.queueAdd = function (id, serverQueue, message) {
        return __awaiter(this, void 0, void 0, function () {
            var arg, songInfo, song;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arg = "https://www.youtube.com/watch?v=" + id;
                        return [4 /*yield*/, this.getSongInfo(arg)];
                    case 1:
                        songInfo = _a.sent();
                        song = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                            videoDetails: songInfo.videoDetails,
                        };
                        serverQueue.songs.push(song);
                        return [2 /*return*/, this.sendAddedToQueue(message.channel, song)];
                }
            });
        });
    };
    CommandHandler.prototype.getSongInfo = function (songArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var liste, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isValidHttpUrl(songArgs)) return [3 /*break*/, 2];
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
    CommandHandler.prototype.getPlaylistInfo = function (arg) {
        return __awaiter(this, void 0, void 0, function () {
            var liste;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isValidHttpUrl(arg)) return [3 /*break*/, 4];
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
    CommandHandler.prototype.getMusicEmbed = function (videoDetails, queue) {
        if (queue === void 0) { queue = []; }
        console.log(videoDetails);
        var author = videoDetails.author.name;
        if (author.endsWith(" - Topic")) {
            author = author.slice(0, author.length - 8);
        }
        var count = queue.songs.length - 1;
        var embed = new discord_js_1.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(videoDetails.title)
            .setURL(videoDetails.video_url)
            .setAuthor(author, videoDetails.author.thumbnails.slice(-1)[0].url, videoDetails.author.user_url)
            .setFooter("Noch " + count + " weitere Lieder in der Queue")
            //.setDescription(videoDetails.description)
            //.setThumbnail(videoDetails.thumbnails.slice(-1)[0].url)
            // .addFields(
            //   { name: 'Regular field title', value: 'Some value here' },
            //   { name: '\u200B', value: '\u200B' },
            //   { name: 'Inline field title', value: 'Some value here', inline: true },
            //   { name: 'Inline field title', value: 'Some value here', inline: true },
            // )
            //.addField('Inline field title', 'Some value here', true)
            .setImage(videoDetails.thumbnails.slice(-1)[0].url);
        //.setTimestamp()
        //.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
        return embed;
    };
    CommandHandler.prototype.sendSongToChat = function (serverQueue, song) {
        serverQueue.textChannel.send("Jetzt: **".concat(song.title, "**"));
        serverQueue.textChannel.send(this.getMusicEmbed(song.videoDetails, serverQueue));
        if (Math.random() * 5 < 1) {
            serverQueue.textChannel.send("Den Song mag ich besonders gern!");
        }
    };
    CommandHandler.prototype.sendAddedToQueue = function (channel, song) {
        return channel.send("".concat(song.title, " wurde zur Queue hinzugef\u00FCgt!"));
    };
    CommandHandler.prototype.sayCommand = function (message) {
        var answer = message.content.slice(5);
        message.channel.send(answer);
        message.delete();
    };
    CommandHandler.prototype.getAccesToken = function () {
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
                        return [4 /*yield*/, this.doRequest(authOptions)];
                    case 1:
                        t = _a.sent();
                        hacky = t;
                        return [2 /*return*/, hacky.access_token];
                }
            });
        });
    };
    CommandHandler.prototype.doRequest = function (url) {
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
    CommandHandler.prototype.GetRandomSongsFromPlaylist = function (playlistId, amount) {
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
    CommandHandler.prototype.apiTrackToText = function (track) {
        var artist = track.track.artists[0].name;
        var title = track.track.name;
        return artist + " - " + title;
    };
    CommandHandler.prototype.GetMatchingSongsFromPlaylist = function (playlistId, interprets) {
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
    return CommandHandler;
}());
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map