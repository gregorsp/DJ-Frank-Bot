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
exports.QueueHandler = void 0;
var MessageHandler_1 = require("./MessageHandler");
var Helper_1 = require("./Helper");
var QueueHandler = /** @class */ (function () {
    function QueueHandler() {
    }
    QueueHandler.queueGet = function (guildId) {
        return this.queue.get(guildId);
    };
    QueueHandler.queueSet = function (guildId, queueContruct) {
        return this.queue.set(guildId, queueContruct);
    };
    QueueHandler.queueDelete = function (guildId) {
        return this.queue.delete(guildId);
    };
    QueueHandler.queueAdd = function (message, id, song) {
        if (id === void 0) { id = null; }
        if (song === void 0) { song = null; }
        return __awaiter(this, void 0, void 0, function () {
            var serverQueue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Helper_1.Helper.youtubeIdToSongObject(id)];
                    case 1:
                        song = _a.sent();
                        _a.label = 2;
                    case 2:
                        serverQueue = this.queueGet(message.guild.id);
                        serverQueue.songs.push(song);
                        return [2 /*return*/, MessageHandler_1.MessageHandler.sendAddedToQueue(message.channel, song)];
                }
            });
        });
    };
    QueueHandler.queueAddInFront = function (message, id, song) {
        if (id === void 0) { id = null; }
        if (song === void 0) { song = null; }
        return __awaiter(this, void 0, void 0, function () {
            var serverQueue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Helper_1.Helper.youtubeIdToSongObject(id)];
                    case 1:
                        song = _a.sent();
                        _a.label = 2;
                    case 2:
                        serverQueue = this.queueGet(message.guild.id);
                        // serverQueue.songs = [song].concat(serverQueue.songs);
                        // create a new array with the first song fromg serverQueue.songs, then song and then concat the rest of the array
                        serverQueue.songs = [serverQueue.songs[0], song].concat(serverQueue.songs.slice(1));
                        this.queueSet(message.guild.id, serverQueue);
                        return [2 /*return*/, MessageHandler_1.MessageHandler.sendAddedToQueue(message.channel, song)];
                }
            });
        });
    };
    QueueHandler.setServerQueue = function (message) {
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
    QueueHandler.queue = new Map();
    return QueueHandler;
}());
exports.QueueHandler = QueueHandler;
//# sourceMappingURL=QueueHandler.js.map