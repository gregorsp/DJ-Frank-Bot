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

const prefix = ".";
const id = "a97738f2a1ba46aa9386d2f7f351dec5";
const CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");
const secret = fs.readFileSync("./spotifysecret", "utf8");

import { CommandHandler } from "./CommandHandler";

export class InputHandler {
  private cmd = new CommandHandler();

  handleMessage = async (message : Message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    var serverQueue = this.cmd.queueGet(message.guild.id);

    const command = message.content.slice(prefix.length).split(" ")[0];
    switch (command) {
      case "debug":
        await this.cmd.debugCommand(message);
        break;
      case "p":
      case "play":
        if (message.content.length >= 6) return;
        this.cmd.play(message, serverQueue);
        break;
      case "playlist":
        this.cmd.playlist(message, serverQueue);
        break;
      case "skip":
      case "next":
      case "s":
        this.cmd.skip(message, serverQueue);
        break;
      case "stop":
      case "leave":
      case "quit":
      case "disconnect":
        this.cmd.clearQueue(message, serverQueue);
        break;
      case "say":
        this.cmd.say(message);
        break;
      case "repo":
        let link = "https://www.github.com/gregorsp/DJ-Frank-Bot";
        message.reply(link);
        break;
      case "random":
      case "r":
        var length =
          message.content.length > 8 ? parseInt(this.cmd.getNthWord(message.content, 2)) : 1;
        if (length > 10) length = 10;
        var titles = await this.cmd.spotify("30YalNqYddehoSL44yETCo", length);
        for (let i = 0; i < titles.length; i++) {
          message.content = ".p " + titles[i];
          // message.reply(message.content)
          serverQueue = this.cmd.queueGet(message.guild.id);

          await this.cmd.play(message, serverQueue);
        }
        break;
      case "i":
        var titles = await this.cmd.fabian(
          message,
          serverQueue,
          "30YalNqYddehoSL44yETCo"
        );
        if (titles.length == 0) {
          message.reply("Gibs keine Beweise");
        }
        for (let i = 0; i < titles.length; i++) {
          message.content = ".p " + titles[i];
          // message.reply(message.content)
          serverQueue = this.cmd.queueGet(message.guild.id);

          await this.cmd.play(message, serverQueue);
        }
        break;
      case "spotify":
        var spotLink = this.cmd.getNthWord(message.content, 2);
        var spotId = this.cmd.getSpotifyPlaylistId(spotLink);
        var count = 1;
        try {
          count = parseInt(this.cmd.getNthWord(message.content, 3));
        } catch (ex) {
          message.reply(ex);
        }

        var titles = await this.cmd.spotify(spotId, count);
        for (let i = 0; i < titles.length; i++) {
          message.content = ".p " + titles[i];
          // message.reply(message.content)
          serverQueue = this.cmd.queueGet(message.guild.id);

          await this.cmd.play(message, serverQueue);
        }
        break;
      default:
        break;
    }
  }
  


}
