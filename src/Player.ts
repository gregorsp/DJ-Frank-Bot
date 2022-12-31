import { QueueHandler } from "./QueueHandler";
import discord = require("discord.js");
import { MessageHandler } from "./MessageHandler";
import { Message, VoiceChannel } from 'discord.js';
import ytdl = require("ytdl-core");
import { Song } from "./interfaces";
import { Queue } from "./interfaces";
export class Player {
  public static async play_or_queue(voiceChannel :VoiceChannel, message, song : Song) {
    var serverQueue = QueueHandler.queueGet(message.guild.id);
    if (!serverQueue) {
      serverQueue = QueueHandler.setServerQueue(message);
      serverQueue.songs.push(song);
      Player.tryPlay(voiceChannel, serverQueue, message);
    } else {
      QueueHandler.queueAdd(message, null, song);
    }
  }
  public static async AttachInFront(voiceChannel,message : Message, song :Song) {
    var serverQueue = QueueHandler.queueGet(message.guild.id);
    if (!serverQueue) {
      console.log("No server queue");
      console.log("war keine queue vorhanden?")
      serverQueue = QueueHandler.setServerQueue(message);
      serverQueue.songs.push(song);
      Player.tryPlay(voiceChannel, serverQueue, message);
    } else {
      QueueHandler.queueAddInFront(message, null, song);
    }
  }

  private static async tryPlay(voiceChannel:VoiceChannel, serverQueue : Queue, message: Message) {
    var connection = await voiceChannel.join();
    connection.on("disconnect", (event) => {
      QueueHandler.queueDelete(message.guild.id);
      message.channel.send("Die Party ist vorbei!");
    });
    serverQueue.connection = connection;
    this.reallyPlay(message.guild, serverQueue.songs[0]);
  }
  private static reallyPlay(guild: discord.Guild, song) {
    let serverQueue = QueueHandler.queueGet(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      QueueHandler.queueDelete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25 }))
      .on("finish", () => {
        let serverQueue = QueueHandler.queueGet(guild.id);
        serverQueue.songs.shift();
        this.reallyPlay(guild, serverQueue.songs[0]);
      })
      .on("error", (error) => {
        let serverQueue = QueueHandler.queueGet(guild.id);
        console.error(error);
        serverQueue.textChannel.send("Fehler beim abspielen:\n" + error);
        // serverQueue.songs.shift();
        this.reallyPlay(guild, serverQueue.songs[0]);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    MessageHandler.sendSongToChat(serverQueue, song);
  }
}
