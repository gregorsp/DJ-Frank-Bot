import { QueueHandler } from "./QueueHandler";
import discord = require("discord.js");
import { MessageHandler } from "./MessageHandler";
import { Message } from "discord.js";
import ytdl = require("ytdl-core");

export class Player {
    public static async tryPlay(voiceChannel, serverQueue, message: Message) {
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
    public static reallyPlay(guild: discord.Guild, song) {
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