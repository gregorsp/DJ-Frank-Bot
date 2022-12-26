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
exports.InputHandler = void 0;
var fs = require("fs");
var sql = require("mssql");
var SpotifyWebApi = require("spotify-web-api-node");
var prefix = ".";
var id = "a97738f2a1ba46aa9386d2f7f351dec5";
var CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");
var secret = fs.readFileSync("./spotifysecret", "utf8");
var CommandHandler_1 = require("./CommandHandler");
var InputHandler = /** @class */ (function () {
    function InputHandler() {
        var _this = this;
        this.cmd = new CommandHandler_1.CommandHandler();
        this.handleMessage = function (message) { return __awaiter(_this, void 0, void 0, function () {
            var serverQueue, command, _a, matches, i, currentSong, PreferredYouTubeLink, link, length, titles, i, titles, i, spotLink, spotId, count, titles, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (message.author.bot)
                            return [2 /*return*/];
                        if (!message.content.startsWith(prefix))
                            return [2 /*return*/];
                        serverQueue = this.cmd.queueGet(message.guild.id);
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
                    case 1: return [4 /*yield*/, this.cmd.debug(message, serverQueue)];
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
                        serverQueue = this.cmd.queueGet(message.guild.id);
                        return [4 /*yield*/, this.cmd.play(message, serverQueue)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 32];
                    case 7:
                        if (message.content.length >= 6)
                            return [2 /*return*/];
                        this.cmd.play(message, serverQueue);
                        return [3 /*break*/, 32];
                    case 8:
                        this.cmd.playlist(message, serverQueue);
                        return [3 /*break*/, 32];
                    case 9:
                        this.cmd.skip(message, serverQueue);
                        return [3 /*break*/, 32];
                    case 10:
                        this.cmd.clearQueue(message, serverQueue);
                        return [3 /*break*/, 32];
                    case 11:
                        this.cmd.say(message);
                        return [3 /*break*/, 32];
                    case 12:
                        link = "https://www.github.com/gregorsp/DJ-Frank-Bot";
                        message.reply(link);
                        return [3 /*break*/, 32];
                    case 13:
                        length = message.content.length > 8 ? parseInt(this.cmd.getNthWord(message.content, 2)) : 1;
                        if (length > 10)
                            length = 10;
                        return [4 /*yield*/, this.cmd.spotify("30YalNqYddehoSL44yETCo", length)];
                    case 14:
                        titles = _b.sent();
                        i = 0;
                        _b.label = 15;
                    case 15:
                        if (!(i < titles.length)) return [3 /*break*/, 18];
                        message.content = ".p " + titles[i];
                        // message.reply(message.content)
                        serverQueue = this.cmd.queueGet(message.guild.id);
                        return [4 /*yield*/, this.cmd.play(message, serverQueue)];
                    case 16:
                        _b.sent();
                        _b.label = 17;
                    case 17:
                        i++;
                        return [3 /*break*/, 15];
                    case 18: return [3 /*break*/, 32];
                    case 19: return [4 /*yield*/, this.cmd.fabian(message, serverQueue, "30YalNqYddehoSL44yETCo")];
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
                        serverQueue = this.cmd.queueGet(message.guild.id);
                        return [4 /*yield*/, this.cmd.play(message, serverQueue)];
                    case 22:
                        _b.sent();
                        _b.label = 23;
                    case 23:
                        i++;
                        return [3 /*break*/, 21];
                    case 24: return [3 /*break*/, 32];
                    case 25:
                        spotLink = this.cmd.getNthWord(message.content, 2);
                        spotId = this.cmd.getSpotifyPlaylistId(spotLink);
                        count = 1;
                        try {
                            count = parseInt(this.cmd.getNthWord(message.content, 3));
                        }
                        catch (ex) {
                            message.reply(ex);
                        }
                        return [4 /*yield*/, this.cmd.spotify(spotId, count)];
                    case 26:
                        titles = _b.sent();
                        i = 0;
                        _b.label = 27;
                    case 27:
                        if (!(i < titles.length)) return [3 /*break*/, 30];
                        message.content = ".p " + titles[i];
                        // message.reply(message.content)
                        serverQueue = this.cmd.queueGet(message.guild.id);
                        return [4 /*yield*/, this.cmd.play(message, serverQueue)];
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
        }); };
    }
    return InputHandler;
}());
exports.InputHandler = InputHandler;
//# sourceMappingURL=InputHandler.js.map