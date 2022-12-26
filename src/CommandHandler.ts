import discord = require("discord.js");
import { Client, Intents, Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import fs = require("fs");
import ytdl = require("ytdl-core");
import { DatabaseHandler } from "./DatabaseHandler";
import { Helper } from "./Helper";
import { MusicHandler } from "./MusicHandler";
import { QueueHandler } from './QueueHandler';
import { MessageHandler } from "./MessageHandler";

export class CommandHandler {
  public async debugCommand(message: discord.Message) {
    var matches = await this.debug(message);
    for (let i = 0; i < matches.length; i++) {
      var currentSong = matches[i].Title + " - " + matches[i].RawArtists;
      var PreferredYouTubeLink = matches[i].PreferredYouTubeLink;
      if (PreferredYouTubeLink != "") {
        currentSong = PreferredYouTubeLink;
      }
      message.content = ".p " + currentSong;
      // message.reply(message.content)

      await this.playCommand(message);
    }
  }

  private async debug(message: Message) {
    const args = message.content.split(" ");
    const amount = args.slice(1)[0];
    const playlistId = parseInt(args.slice(2)[0]);
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
    var length =
      message.content.length > 8
        ? parseInt(Helper.getNthWord(message.content, 2))
        : 1;
    if (length > 10) length = 10;
    var titles = await this.spotify("30YalNqYddehoSL44yETCo", length);
    for (let i = 0; i < titles.length; i++) {
      message.content = ".p " + titles[i];
      // message.reply(message.content)
      await this.playCommand(message);
    }
  }

  public async interpretCommand(message: discord.Message) {
    var titles = await this.fabian(message, "30YalNqYddehoSL44yETCo");
    if (titles.length == 0) {
      message.reply("Gibs keine Beweise");
    }
    for (let i = 0; i < titles.length; i++) {
      message.content = ".p " + titles[i];
      // message.reply(message.content)
      await this.playCommand(message);
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

    var titles = await this.spotify(spotId, count);
    for (let i = 0; i < titles.length; i++) {
      message.content = ".p " + titles[i];
      // message.reply(message.content)
      await this.playCommand(message);
    }
  }
  async playCommand(message: Message) {
    var serverQueue = QueueHandler.queueGet(message.guild.id);
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("Mir fehlen Rechte!");
    }

    //const songInfo = await ytdl.getInfo(args[1]);
    //const songInfo = await getInfo(args.slice(1).join(" "));
    const songInfo = await MusicHandler.getSongInfo(args.slice(1).join(" "));
    //console.log(songInfo2);
    const song = this.songInfoToSongObject(songInfo);

    if (!serverQueue) {
      serverQueue = QueueHandler.setServerQueue(message);
      serverQueue.songs.push(song);
      this.tryPlay(voiceChannel, serverQueue, message);
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} wurde zur Queue hinzugefügt!`);
    }
  }

  skipCommand(message: Message) {
    var serverQueue = QueueHandler.queueGet(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel.send("Du bist in keinem Voice!");
    if (!serverQueue) return message.channel.send("Queue ist leer!");
    serverQueue.connection.dispatcher.end();
  }

  clearQueueCommand(message: Message) {
    var serverQueue = QueueHandler.queueGet(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel.send("Du bist in keinem Voice!");

    if (!serverQueue) return message.channel.send("Queue ist leer!");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }

  async playlistCommand(message: Message) {
    var serverQueue = QueueHandler.queueGet(message.guild.id);
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("Mir fehlen Rechte!");
    }

    const playlistInfo = await MusicHandler.getPlaylistInfo(args.slice(1).join(" "));
    console.log(playlistInfo);
    var emptyQueue = false;
    if (!serverQueue) {
      serverQueue = QueueHandler.setServerQueue(message);
      emptyQueue = true;
    }
    for (let i = 0; i < playlistInfo.length; i++) {
      await QueueHandler.queueAdd(playlistInfo[i].id, serverQueue, message);
    }
    if (emptyQueue) {
      this.tryPlay(voiceChannel, serverQueue, message);
    }
  }

  sayCommand(message: Message) {
    const answer = message.content.slice(5);
    message.channel.send(answer);
    message.delete();
  }

  async spotify(playlistId: string, amount: number) {
    return await MusicHandler.GetRandomSongsFromPlaylist(playlistId, amount);
  }

  async fabian(message: Message, playlistId: string) {
    const args = message.content.split(" ");
    var amount: number = parseInt(args.slice(1)[0]);
    var interprets = args.slice(2).join(" ").split("|");

    var matches = await MusicHandler.GetMatchingSongsFromPlaylist(
      playlistId,
      interprets
    );
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

  songInfoToSongObject(songInfo) {
    return {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      videoDetails: songInfo.videoDetails,
    };
  }

  async tryPlay(voiceChannel, serverQueue, message: Message) {
    let errCounter = 0;
    try {
      while (errCounter < 3) {
        try {
          var connection = await voiceChannel.join();
          connection.on("disconnect", (event) => {
            QueueHandler.queueDelete(message.guild.id);
            message.channel.send("Die Party ist vorbei!");
          });
          serverQueue.connection = connection;
          this.reallyPlay(message.guild, serverQueue.songs[0]);
          errCounter = 10000;
        } catch (err) {
          if (errCounter == 3) {
            throw err;
          }
          console.log(err);

          errCounter++;
        }
      }
    } catch (err) {
      console.log(err);
      QueueHandler.queueDelete(message.guild.id);
      return message.channel.send(err);
    }
  }

  reallyPlay(guild: discord.Guild, song) {
    const serverQueue = QueueHandler.queueGet(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      QueueHandler.queueDelete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25 }))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.reallyPlay(guild, serverQueue.songs[0]);
      })
      .on("error", (error) => {
        console.error(error);
        serverQueue.textChannel.send("Fehler beim abspielen:\n" + error);
        // serverQueue.songs.shift();
        this.reallyPlay(guild, serverQueue.songs[0]);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    MessageHandler.sendSongToChat(serverQueue, song);
  }
}
