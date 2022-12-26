"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var fs = require("fs");
var sql = require("mssql");
var SpotifyWebApi = require("spotify-web-api-node");
var inputhandler_1 = require("./inputhandler");
var token = fs.readFileSync("./discordtoken", "utf8"); //"ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE";
var prefix = ".";
var id = "a97738f2a1ba46aa9386d2f7f351dec5";
var CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");
var secret = fs.readFileSync("./spotifysecret", "utf8");
var client = new discord_js_1.Client();
var handler = new inputhandler_1.InputHandler();
client.once("ready", function () {
    console.log("Ready!");
});
client.once("reconnecting", function () {
    console.log("Reconnecting!");
});
client.once("disconnect", function () {
    console.log("Disconnect!");
});
client.on("message", handler.handleMessage);
client.login(token);
//# sourceMappingURL=index.js.map