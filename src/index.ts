
import discord = require("discord.js");
import { Client, Intents, Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import fs = require("fs");
const sql = require("mssql");
import ytMusic = require("node-youtube-music");
import request = require("request");
const SpotifyWebApi = require("spotify-web-api-node");
import youtubesearchapi = require("youtube-search-api");
import ytdl = require("ytdl-core");

import { InputHandler } from "./inputhandler";


const token = fs.readFileSync("./discordtoken", "utf8"); //"ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE";
const prefix = ".";
const id = "a97738f2a1ba46aa9386d2f7f351dec5";
const CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");
const secret = fs.readFileSync("./spotifysecret", "utf8");

const client = new Client();
var handler = new InputHandler();

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", handler.handleMessage);

client.login(token);
