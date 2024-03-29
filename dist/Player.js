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
exports.Player = void 0;
var QueueHandler_1 = require("./QueueHandler");
var MessageHandler_1 = require("./MessageHandler");
var ytdl = require("ytdl-core");
var Player = /** @class */ (function () {
    function Player() {
    }
    Player.play_or_queue = function (voiceChannel, message, song) {
        return __awaiter(this, void 0, void 0, function () {
            var serverQueue;
            return __generator(this, function (_a) {
                serverQueue = QueueHandler_1.QueueHandler.queueGet(message.guild.id);
                if (!serverQueue) {
                    serverQueue = QueueHandler_1.QueueHandler.setServerQueue(message);
                    serverQueue.songs.push(song);
                    Player.tryPlay(voiceChannel, serverQueue, message);
                }
                else {
                    QueueHandler_1.QueueHandler.queueAdd(message, null, song);
                }
                return [2 /*return*/];
            });
        });
    };
    Player.AttachInFront = function (voiceChannel, message, song) {
        return __awaiter(this, void 0, void 0, function () {
            var serverQueue;
            return __generator(this, function (_a) {
                serverQueue = QueueHandler_1.QueueHandler.queueGet(message.guild.id);
                if (!serverQueue) {
                    console.log("No server queue");
                    console.log("war keine queue vorhanden?");
                    serverQueue = QueueHandler_1.QueueHandler.setServerQueue(message);
                    serverQueue.songs.push(song);
                    Player.tryPlay(voiceChannel, serverQueue, message);
                }
                else {
                    QueueHandler_1.QueueHandler.queueAddInFront(message, null, song);
                }
                return [2 /*return*/];
            });
        });
    };
    Player.tryPlay = function (voiceChannel, serverQueue, message) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, voiceChannel.join()];
                    case 1:
                        connection = _a.sent();
                        connection.on("disconnect", function (event) {
                            QueueHandler_1.QueueHandler.queueDelete(message.guild.id);
                            message.channel.send("Die Party ist vorbei!");
                        });
                        serverQueue.connection = connection;
                        this.reallyPlay(message.guild, serverQueue.songs[0]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Player.reallyPlay = function (guild, song) {
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
            var serverQueue = QueueHandler_1.QueueHandler.queueGet(guild.id);
            serverQueue.songs.shift();
            _this.reallyPlay(guild, serverQueue.songs[0]);
        })
            .on("error", function (error) {
            var serverQueue = QueueHandler_1.QueueHandler.queueGet(guild.id);
            console.error(error);
            serverQueue.textChannel.send("Fehler beim abspielen:\n" + error);
            // serverQueue.songs.shift();
            _this.reallyPlay(guild, serverQueue.songs[0]);
        });
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        MessageHandler_1.MessageHandler.sendSongToChat(serverQueue, song);
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=Player.js.map