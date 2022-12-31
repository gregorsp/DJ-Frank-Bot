import { MusicHandler } from "./MusicHandler";
import { MessageHandler } from "./MessageHandler";
import { Message } from "discord.js";
import { Song } from './interfaces';
import { Helper } from "./Helper";
import { Queue } from "./interfaces";
export class QueueHandler {
  private static queue: Map<string, Queue> = new Map();

  public static queueGet(guildId: string) : Queue{
    return this.queue.get(guildId);
  }

  public static queueSet(guildId: string, queueContruct) {
    return this.queue.set(guildId, queueContruct);
  }

  public static queueDelete(guildId: string) {
    return this.queue.delete(guildId);
  }

  public static async queueAdd(message: Message, id: string = null, song : Song = null) {
    if (id !== null) {
      song = await Helper.youtubeIdToSongObject(id);
    }
    let serverQueue = this.queueGet(message.guild.id);
    serverQueue.songs.push(song);
    return MessageHandler.sendAddedToQueue(message.channel, song);
  }
  public static async queueAddInFront(message: Message, id: string = null, song : Song = null) {
    if (id !== null) {
      song = await Helper.youtubeIdToSongObject(id);
    }
    let serverQueue = this.queueGet(message.guild.id);
    // serverQueue.songs = [song].concat(serverQueue.songs);
    // create a new array with the first song fromg serverQueue.songs, then song and then concat the rest of the array
    serverQueue.songs = [serverQueue.songs[0], song].concat(serverQueue.songs.slice(1));
    this.queueSet(message.guild.id, serverQueue);
    return MessageHandler.sendAddedToQueue(message.channel, song);
  }
  
  static setServerQueue(message: Message) : Queue {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    this.queueSet(message.guild.id, queueContruct);
    return this.queueGet(message.guild.id);
  }
}
