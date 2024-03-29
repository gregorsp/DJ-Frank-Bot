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
var CommandHandler_1 = require("./CommandHandler");
var InputHandler = /** @class */ (function () {
    function InputHandler() {
        var _this = this;
        this.prefix = ".";
        this.cmd = new CommandHandler_1.CommandHandler();
        this.handleMessage = function (message) { return __awaiter(_this, void 0, void 0, function () {
            var command, _a, link;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (message.author.bot)
                            return [2 /*return*/];
                        if (!message.content.startsWith(this.prefix))
                            return [2 /*return*/];
                        command = message.content.slice(this.prefix.length).split(" ")[0];
                        _a = command;
                        switch (_a) {
                            case "debug": return [3 /*break*/, 1];
                            case "p": return [3 /*break*/, 3];
                            case "play": return [3 /*break*/, 3];
                            case "forceplay": return [3 /*break*/, 4];
                            case "playlist": return [3 /*break*/, 5];
                            case "q": return [3 /*break*/, 6];
                            case "queue": return [3 /*break*/, 6];
                            case "inqueue": return [3 /*break*/, 6];
                            case "warteschlange": return [3 /*break*/, 6];
                            case "next": return [3 /*break*/, 6];
                            case "skip": return [3 /*break*/, 7];
                            case "next": return [3 /*break*/, 7];
                            case "s": return [3 /*break*/, 7];
                            case "stop": return [3 /*break*/, 8];
                            case "leave": return [3 /*break*/, 8];
                            case "quit": return [3 /*break*/, 8];
                            case "disconnect": return [3 /*break*/, 8];
                            case "say": return [3 /*break*/, 9];
                            case "repo": return [3 /*break*/, 10];
                            case "random": return [3 /*break*/, 11];
                            case "r": return [3 /*break*/, 11];
                            case "i": return [3 /*break*/, 13];
                            case "spotify": return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 17];
                    case 1: return [4 /*yield*/, this.cmd.debugCommand(message)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 18];
                    case 3:
                        if (message.content.length <= 6)
                            return [2 /*return*/];
                        this.cmd.playCommand(message);
                        return [3 /*break*/, 18];
                    case 4:
                        this.cmd.forcePlayCommand(message);
                        return [3 /*break*/, 18];
                    case 5:
                        this.cmd.playlistCommand(message);
                        return [3 /*break*/, 18];
                    case 6:
                        this.cmd.queueCommand(message);
                        return [3 /*break*/, 18];
                    case 7:
                        this.cmd.skipCommand(message);
                        return [3 /*break*/, 18];
                    case 8:
                        this.cmd.clearQueueCommand(message);
                        return [3 /*break*/, 18];
                    case 9:
                        this.cmd.sayCommand(message);
                        return [3 /*break*/, 18];
                    case 10:
                        link = "https://www.github.com/gregorsp/DJ-Frank-Bot";
                        message.reply(link);
                        return [3 /*break*/, 18];
                    case 11: return [4 /*yield*/, this.cmd.randomCommand(message)];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 18];
                    case 13: return [4 /*yield*/, this.cmd.interpretCommand(message)];
                    case 14:
                        _b.sent();
                        return [3 /*break*/, 18];
                    case 15: return [4 /*yield*/, this.cmd.spotifyCommand(message)];
                    case 16:
                        _b.sent();
                        return [3 /*break*/, 18];
                    case 17: return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        }); };
    }
    return InputHandler;
}());
exports.InputHandler = InputHandler;
//# sourceMappingURL=InputHandler.js.map