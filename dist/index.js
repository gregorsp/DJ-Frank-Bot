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
var _this = this;
var _a = require("discord.js"), Client = _a.Client, Intents = _a.Intents;
var fs = require("fs");
var token = fs.readFileSync("./discordtoken", "utf8"); //"ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE";
var prefix = ".";
var ytdl = require("ytdl-core");
var sql = require("mssql");
var CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");
var ytMusic = require("node-youtube-music");
var youtubesearchapi = require("youtube-search-api");
var MessageEmbed = require("discord.js").MessageEmbed;
var SpotifyWebApi = require("spotify-web-api-node");
var request = require("request");
var id = "a97738f2a1ba46aa9386d2f7f351dec5";
var secret = fs.readFileSync("./spotifysecret", "utf8");
var client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.once("ready", function () {
    console.log("Ready!");
});
client.once("reconnecting", function () {
    console.log("Reconnecting!");
});
client.once("disconnect", function () {
    console.log("Disconnect!");
});
client.on("message", function (message) { return __awaiter(_this, void 0, void 0, function () {
    var serverQueue, command, _a, matches, i, currentSong, PreferredYouTubeLink, link, length, titles, i, titles, i, spotLink, spotId, count, titles, i;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (message.author.bot)
                    return [2 /*return*/];
                if (!message.content.startsWith(prefix))
                    return [2 /*return*/];
                serverQueue = queueGet(message.guild.id);
                command = message.content.slice(prefix.length).split(" ")[0];
                _a = command;
                switch (_a) {
                    case "debug": return [3 /*break*/, 1];
                    case "p": return [3 /*break*/, 7];
                    case "play": return [3 /*break*/, 7];
                    case "playlist": return [3 /*break*/, 8];
                    case "skip": return [3 /*break*/, 9];
                    case "next": return [3 /*break*/, 9];
                    case "s": return [3 /*break*/, 9];
                    case "stop": return [3 /*break*/, 10];
                    case "leave": return [3 /*break*/, 10];
                    case "quit": return [3 /*break*/, 10];
                    case "disconnect": return [3 /*break*/, 10];
                    case "say": return [3 /*break*/, 11];
                    case "repo": return [3 /*break*/, 12];
                    case "random": return [3 /*break*/, 13];
                    case "r": return [3 /*break*/, 13];
                    case "i": return [3 /*break*/, 19];
                    case "spotify": return [3 /*break*/, 25];
                }
                return [3 /*break*/, 31];
            case 1: return [4 /*yield*/, debug(message, serverQueue, queueCommands)];
            case 2:
                matches = _b.sent();
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < matches.length)) return [3 /*break*/, 6];
                currentSong = matches[i].Title + " - " + matches[i].RawArtists;
                PreferredYouTubeLink = matches[i].PreferredYouTubeLink;
                if (PreferredYouTubeLink != "") {
                    currentSong = PreferredYouTubeLink;
                }
                message.content = ".p " + currentSong;
                // message.reply(message.content)
                serverQueue = queueGet(message.guild.id);
                return [4 /*yield*/, play(message, serverQueue, queueCommands)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 32];
            case 7:
                if (message.length >= 6)
                    return [2 /*return*/];
                play(message, serverQueue, queueCommands);
                return [3 /*break*/, 32];
            case 8:
                playlist(message, serverQueue, queueCommands);
                return [3 /*break*/, 32];
            case 9:
                skip(message, serverQueue);
                return [3 /*break*/, 32];
            case 10:
                clearQueue(message, serverQueue);
                return [3 /*break*/, 32];
            case 11:
                say(message);
                return [3 /*break*/, 32];
            case 12:
                link = "https://www.github.com/gregorsp/DJ-Frank-Bot";
                message.reply(link);
                return [3 /*break*/, 32];
            case 13:
                length = message.content.length > 8 ? getNthWord(message.content, 2) : 1;
                if (length > 10)
                    length = 10;
                return [4 /*yield*/, spotify("30YalNqYddehoSL44yETCo", length)];
            case 14:
                titles = _b.sent();
                i = 0;
                _b.label = 15;
            case 15:
                if (!(i < titles.length)) return [3 /*break*/, 18];
                message.content = ".p " + titles[i];
                // message.reply(message.content)
                serverQueue = queueGet(message.guild.id);
                return [4 /*yield*/, play(message, serverQueue, queueCommands)];
            case 16:
                _b.sent();
                _b.label = 17;
            case 17:
                i++;
                return [3 /*break*/, 15];
            case 18: return [3 /*break*/, 32];
            case 19: return [4 /*yield*/, fabian(message, serverQueue, queueCommands, "30YalNqYddehoSL44yETCo")];
            case 20:
                titles = _b.sent();
                if (titles.length == 0) {
                    message.reply("Gibs keine Beweise");
                }
                i = 0;
                _b.label = 21;
            case 21:
                if (!(i < titles.length)) return [3 /*break*/, 24];
                message.content = ".p " + titles[i];
                // message.reply(message.content)
                serverQueue = queueGet(message.guild.id);
                return [4 /*yield*/, play(message, serverQueue, queueCommands)];
            case 22:
                _b.sent();
                _b.label = 23;
            case 23:
                i++;
                return [3 /*break*/, 21];
            case 24: return [3 /*break*/, 32];
            case 25:
                spotLink = getNthWord(message.content, 2);
                spotId = getSpotifyPlaylistId(spotLink);
                count = 1;
                try {
                    count = getNthWord(message.content, 3);
                }
                catch (ex) {
                    message.reply(ex);
                }
                return [4 /*yield*/, spotify(spotId, count)];
            case 26:
                titles = _b.sent();
                i = 0;
                _b.label = 27;
            case 27:
                if (!(i < titles.length)) return [3 /*break*/, 30];
                message.content = ".p " + titles[i];
                // message.reply(message.content)
                serverQueue = queueGet(message.guild.id);
                return [4 /*yield*/, play(message, serverQueue, queueCommands)];
            case 28:
                _b.sent();
                _b.label = 29;
            case 29:
                i++;
                return [3 /*break*/, 27];
            case 30: return [3 /*break*/, 32];
            case 31: return [3 /*break*/, 32];
            case 32: return [2 /*return*/];
        }
    });
}); });
client.login(token);
function play(message, serverQueue, queueCommands) {
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
                    return [4 /*yield*/, getSongInfo(args.slice(1).join(" "))];
                case 1:
                    songInfo = _a.sent();
                    song = songInfoToSongObject(songInfo);
                    if (!serverQueue) {
                        serverQueue = setServerQueue(queueCommands, message);
                        serverQueue.songs.push(song);
                        tryPlay(voiceChannel, serverQueue, message, queueCommands);
                    }
                    else {
                        serverQueue.songs.push(song);
                        return [2 /*return*/, message.channel.send("".concat(song.title, " wurde zur Queue hinzugef\u00FCgt!"))];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("Du bist in keinem Voice!");
    if (!serverQueue)
        return message.channel.send("Queue ist leer!");
    serverQueue.connection.dispatcher.end();
}
function clearQueue(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("Du bist in keinem Voice!");
    if (!serverQueue)
        return message.channel.send("Queue ist leer!");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}
function playlist(message, serverQueue, queueCommands) {
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
                    return [4 /*yield*/, getPlaylistInfo(args.slice(1).join(" "))];
                case 1:
                    playlistInfo = _a.sent();
                    console.log(playlistInfo);
                    emptyQueue = false;
                    if (!serverQueue) {
                        serverQueue = setServerQueue(queueCommands, message);
                        emptyQueue = true;
                    }
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < playlistInfo.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, queueCommands.queueAdd(playlistInfo[i].id, serverQueue, message)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (emptyQueue) {
                        tryPlay(voiceChannel, serverQueue, message, queueCommands);
                    }
                    console.log(serverQueue.songs);
                    return [2 /*return*/];
            }
        });
    });
}
var say = function (message) {
    sayCommand(message);
};
var spotify = function (playlistId, amount) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, GetRandomSongsFromPlaylist(playlistId, amount)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var fabian = function (message, serverQueue, queueCommands, playlistId) { return __awaiter(_this, void 0, void 0, function () {
    var args, amount, interprets, matches, toQueue, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = message.content.split(" ");
                amount = args.slice(1)[0];
                interprets = args.slice(2).join(" ").split("|");
                return [4 /*yield*/, GetMatchingSongsFromPlaylist(playlistId, interprets)];
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
}); };
var debug = function (message, serverQueue, queueCommands) { return __awaiter(_this, void 0, void 0, function () {
    var args, amount, playlistId, matches, toQueue, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = message.content.split(" ");
                amount = args.slice(1)[0];
                playlistId = args.slice(2)[0];
                return [4 /*yield*/, getPlaylistFromDatabase(playlistId)];
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
}); };
module.exports = { play: play, skip: skip, clearQueue: clearQueue, playlist: playlist, say: say, spotify: spotify, fabian: fabian, debug: debug };
var getPlaylistFromDatabase = function (playlistId) { return __awaiter(_this, void 0, void 0, function () {
    var QUERY, pool, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                QUERY = "DECLARE\t@return_value int\n\n  EXEC\t@return_value = [dbo].[GetSongsByPlaylistId]\n          @playlistId = ".concat(playlistId, "\n  \n  SELECT\t'Return Value' = @return_value");
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
}); };
module.exports = { getPlaylistFromDatabase: getPlaylistFromDatabase };
function isValidHttpUrl(string) {
    var url;
    try {
        url = new URL(string);
    }
    catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}
var setServerQueue = function (queueCommands, message) {
    var queueContruct = {
        textChannel: message.channel,
        voiceChannel: message.member.voice.channel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
    };
    queueCommands.queueSet(message.guild.id, queueContruct);
    return queueCommands.queueGet(message.guild.id);
};
var songInfoToSongObject = function (songInfo) {
    return {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        videoDetails: songInfo.videoDetails,
    };
};
var getNthWord = function (text, n) {
    return text.split(" ")[n - 1];
};
var getSpotifyPlaylistId = function (link) {
    // https://open.spotify.com/playlist/7ktaQvt898S3BYWkO90gFu?si=54b6547bf49a4d87
    var a = link.split("/");
    var b = a.slice(-1)[0];
    var c = b.split("?");
    var d = c.slice(0)[0];
    return d;
};
module.exports = { isValidHttpUrl: isValidHttpUrl, setServerQueue: setServerQueue, songInfoToSongObject: songInfoToSongObject, getNthWord: getNthWord, getSpotifyPlaylistId: getSpotifyPlaylistId };
function tryPlay(voiceChannel, serverQueue, message, queueCommands) {
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
                        queueCommands.queueDelete(message.guild.id);
                        message.channel.send("Die Party ist vorbei!");
                    });
                    serverQueue.connection = connection;
                    reallyPlay(message.guild, serverQueue.songs[0], queueCommands);
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
                    queueCommands.queueDelete(message.guild.id);
                    return [2 /*return*/, message.channel.send(err_2)];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function reallyPlay(guild, song, queueCommands) {
    var serverQueue = queueCommands.queueGet(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queueCommands.queueDelete(guild.id);
        return;
    }
    var dispatcher = serverQueue.connection
        .play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25 }))
        .on("finish", function () {
        serverQueue.songs.shift();
        reallyPlay(guild, serverQueue.songs[0], queueCommands);
    })
        .on("error", function (error) {
        console.error(error);
        serverQueue.textChannel.send("Fehler beim abspielen:\n" + error);
        // serverQueue.songs.shift();
        reallyPlay(guild, serverQueue.songs[0], queueCommands);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    sendSongToChat(serverQueue, song);
}
module.exports = { tryPlay: tryPlay };
var queue = new Map();
var queueGet = function (guildId) {
    return queue.get(guildId);
};
var queueSet = function (guildId, queueContruct) {
    return queue.set(guildId, queueContruct);
};
var queueDelete = function (guildId) {
    return queue.delete(guildId);
};
function queueAdd(id, serverQueue, message) {
    return __awaiter(this, void 0, void 0, function () {
        var arg, songInfo, song;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    arg = "https://www.youtube.com/watch?v=" + id;
                    return [4 /*yield*/, getSongInfo(arg)];
                case 1:
                    songInfo = _a.sent();
                    song = {
                        title: songInfo.videoDetails.title,
                        url: songInfo.videoDetails.video_url,
                        videoDetails: songInfo.videoDetails,
                    };
                    serverQueue.songs.push(song);
                    return [2 /*return*/, sendAddedToQueue(message.channel, song)];
            }
        });
    });
}
var queueCommands = { queueGet: queueGet, queueSet: queueSet, queueDelete: queueDelete, queueAdd: queueAdd };
module.exports = {
    queue: queue,
    queueSet: queueSet,
    queueGet: queueGet,
    queueDelete: queueDelete,
    queueAdd: queueAdd,
    queueCommands: queueCommands,
};
var getSongInfo = function (arg) { return __awaiter(_this, void 0, void 0, function () {
    var liste, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isValidHttpUrl(arg)) return [3 /*break*/, 2];
                return [4 /*yield*/, ytdl.getInfo(arg)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, ytMusic.searchMusics(arg)];
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
}); };
var getPlaylistInfo = function (arg) { return __awaiter(_this, void 0, void 0, function () {
    var liste;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isValidHttpUrl(arg)) return [3 /*break*/, 4];
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
}); };
module.exports = { getSongInfo: getSongInfo, getPlaylistInfo: getPlaylistInfo };
var getMusicEmbed = function (videoDetails, queue) {
    if (queue === void 0) { queue = []; }
    console.log(videoDetails);
    var author = videoDetails.author.name;
    if (author.endsWith(" - Topic")) {
        author = author.slice(0, author.length - 8);
    }
    var count = queue.songs.length - 1;
    var embed = new MessageEmbed()
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
var sendSongToChat = function (serverQueue, song) {
    serverQueue.textChannel.send("Jetzt: **".concat(song.title, "**"));
    serverQueue.textChannel.send(getMusicEmbed(song.videoDetails, serverQueue));
    if (Math.random() * 5 < 1) {
        serverQueue.textChannel.send("Den Song mag ich besonders gern!");
    }
};
var sendAddedToQueue = function (channel, song) {
    return channel.send("".concat(song.title, " wurde zur Queue hinzugef\u00FCgt!"));
};
var sayCommand = function (message) {
    var answer = message.content.slice(5);
    message.channel.send(answer);
    message.delete();
};
module.exports = { sendSongToChat: sendSongToChat, sayCommand: sayCommand, sendAddedToQueue: sendAddedToQueue };
var api = new SpotifyWebApi({
    clientId: id,
    clientSecret: secret,
    redirectUri: "http://www.example.com/callback",
});
var getAccesToken = function () { return __awaiter(_this, void 0, void 0, function () {
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
                return [4 /*yield*/, doRequest(authOptions)];
            case 1:
                t = _a.sent();
                hacky = t;
                return [2 /*return*/, hacky.access_token];
        }
    });
}); };
function doRequest(url) {
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
}
var GetRandomSongsFromPlaylist = function (playlistId, amount) {
    if (playlistId === void 0) { playlistId = "30YalNqYddehoSL44yETCo"; }
    if (amount === void 0) { amount = 1; }
    return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, retval, liste, length, tracks, i, _c, _d, _e, i_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _b = (_a = api).setAccessToken;
                    return [4 /*yield*/, getAccesToken()];
                case 1:
                    _b.apply(_a, [_f.sent()]);
                    retval = [];
                    return [4 /*yield*/, api.getPlaylist(playlistId)];
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
                    return [4 /*yield*/, api.getPlaylistTracks(playlistId, {
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
                        retval.push(apiTrackToText(tracks[Math.floor(Math.random() * tracks.length)]));
                    }
                    return [2 /*return*/, retval];
            }
        });
    });
};
var apiTrackToText = function (track) {
    var artist = track.track.artists[0].name;
    var title = track.track.name;
    return artist + " - " + title;
};
var GetMatchingSongsFromPlaylist = function (playlistId, interprets) {
    if (playlistId === void 0) { playlistId = "30YalNqYddehoSL44yETCo"; }
    return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, retval, liste, e_1, length, tracks, i, _c, _d, _e, i_2, song, j, currentArtist, toFindArtist;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _b = (_a = api).setAccessToken;
                    return [4 /*yield*/, getAccesToken()];
                case 1:
                    _b.apply(_a, [_f.sent()]);
                    retval = [];
                    liste = [];
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, api.getPlaylist(playlistId)];
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
                    return [4 /*yield*/, api.getPlaylistTracks(playlistId, {
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
                        song = apiTrackToText(tracks[i_2]);
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
module.exports = { GetRandomSongsFromPlaylist: GetRandomSongsFromPlaylist, GetMatchingSongsFromPlaylist: GetMatchingSongsFromPlaylist };
//# sourceMappingURL=index.js.map