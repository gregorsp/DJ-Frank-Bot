import discord = require("discord.js");
import { Client, Intents, Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import fs = require("fs");
import { DatabaseHandler } from "./DatabaseHandler";
import { Helper } from "./Helper";
import { MusicHandler } from "./MusicHandler";
import { QueueHandler } from "./QueueHandler";
import { Player } from "./Player";
import { Song } from "./interfaces";
import { videoInfo } from "ytdl-core";
export class CommandHandler {
  queueCommand(message: discord.Message) {
    let serverQueue = QueueHandler.queueGet(message.guild.id);
    if (!serverQueue) {
      return message.channel.send("Es wird nichts abgespielt...");
    } else {
      let returnString = "In der Warteschlange:\n";
      for (let i = 1; i < serverQueue.songs.length; i++) {
        returnString += i + ". : " + serverQueue.songs[i].title + "\n";
      }
      message.reply(returnString);
    }
  }
  public async debugCommand(message: discord.Message) {
    var matches = await this.debug(message);
    for (let i = 0; i < matches.length; i++) {
      let song = await Helper.dbSongToSongObject(matches[i]);

      Player.play_or_queue(message, song);
    }
  }

  private async debug(message: Message) {
    const amount = parseInt(Helper.getArgSlice(message, 2));
    const playlistId = parseInt(Helper.getArgSlice(message, 1));
    var matches = await DatabaseHandler.getPlaylistFromDatabase(playlistId);
    var toQueue = [];
    if (amount >= matches.length) {
      toQueue = matches;
      //shuffle toQueue
      toQueue = toQueue.sort((a, b) => 0.5 - Math.random());

      for (let i = matches.length; i < amount; i++) {
        // add a random entry of matches to toQueue
        toQueue.push(matches[Math.floor(Math.random() * matches.length)]);
      }
    } else {
      toQueue = matches.sort((a, b) => 0.5 - Math.random()).slice(0, amount);
    }
    return toQueue;
  }

  public async randomCommand(message: discord.Message) {
    var length = message.content.length > 8 ? parseInt(Helper.getNthWord(message.content, 2)) : 1;
    if (length > 10) length = 10;
    var titles = await MusicHandler.spotify("30YalNqYddehoSL44yETCo", length);
    for (let i = 0; i < titles.length; i++) {
      let song = await Helper.songnameToSongObject(titles[i]);
      Player.play_or_queue(message, song);
    }
  }

  public async interpretCommand(message: discord.Message) {
    var titles = await this.fabian(message, "30YalNqYddehoSL44yETCo");
    if (titles.length == 0) {
      message.reply("Gibs keine Beweise");
    }
    for (let i = 0; i < titles.length; i++) {
      let song = await Helper.songnameToSongObject(titles[i]);
      Player.play_or_queue(message, song);
    }
  }

  public async spotifyCommand(message: discord.Message) {
    var spotLink = Helper.getNthWord(message.content, 2);
    var spotId = Helper.getSpotifyPlaylistId(spotLink);
    var count = 1;
    try {
      count = parseInt(Helper.getNthWord(message.content, 3));
    } catch (ex) {
      message.reply(ex);
    }

    var titles = await MusicHandler.spotify(spotId, count);
    for (let i = 0; i < titles.length; i++) {
      let song = await Helper.songnameToSongObject(titles[i]);
      Player.play_or_queue(message, song);
    }
  }
  async playCommand(message: Message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("Mir fehlen Rechte!");
    }

    //const songInfo = await ytdl.getInfo(args[1]);
    //const songInfo = await getInfo(args.slice(1).join(" "));
    const songInfo = await MusicHandler.getSongInfo(Helper.getArgSlices(message, 1).join(" "));
    //console.log(songInfo2);
    const song = Helper.songInfoToSongObject(songInfo);

    Player.play_or_queue(message, song);
  }

  async forcePlayCommand(message: Message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("Mir fehlen Rechte!");
    }

    const songInfo = await MusicHandler.getSongInfo(Helper.getArgSlices(message, 1).join(" "));
    //console.log(songInfo2);
    const song = Helper.songInfoToSongObject(songInfo);

    Player.AttachInFront(voiceChannel, message, song);
  }

  skipCommand(message: Message) {
    var serverQueue = QueueHandler.queueGet(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send("Du bist in keinem Voice!");
    if (!serverQueue) return message.channel.send("Queue ist leer!");
    serverQueue.connection.dispatcher.end();
  }

  clearQueueCommand(message: Message) {
    var serverQueue = QueueHandler.queueGet(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send("Du bist in keinem Voice!");

    if (!serverQueue) return message.channel.send("Queue ist leer!");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }

  async playlistCommand(message: Message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("Mir fehlen Rechte!");
    }

    const playlistInfo = await MusicHandler.getPlaylistInfo(Helper.getArgSlices(message, 1).join(" "));

    for (let i = 0; i < playlistInfo.length; i++) {
      let song = await Helper.youtubeIdToSongObject(playlistInfo[i].id);
      Player.play_or_queue(message, song);
    }
  }

  sayCommand(message: Message) {
    const answer = message.content.slice(5);
    message.channel.send(answer);
    message.delete();
  }

  async fabian(message: Message, playlistId: string) {
    var amount: number = parseInt(Helper.getArgSlice(message, 1));
    var interprets = Helper.getArgSlices(message, 2).join(" ").split("|");

    var matches = await MusicHandler.GetMatchingSongsFromPlaylist(playlistId, interprets);
    var toQueue = [];
    if (matches.length == 0) return toQueue;
    if (amount >= matches.length) {
      toQueue = matches;
      //shuffle toQueue
      toQueue = toQueue.sort((a, b) => 0.5 - Math.random());

      for (let i = matches.length; i < amount; i++) {
        // add a random entry of matches to toQueue
        toQueue.push(matches[Math.floor(Math.random() * matches.length)]);
      }
    } else {
      toQueue = matches.sort((a, b) => 0.5 - Math.random()).slice(0, amount);
    }

    return toQueue;
  }
}
