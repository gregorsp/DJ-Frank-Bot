import { MusicHandler } from "./MusicHandler";
import { MessageHandler } from "./MessageHandler";
import { Message } from "discord.js";
import { Song } from './interfaces';
import { Helper } from "./Helper";
export class QueueHandler {
  private static queue: Map<string, any> = new Map();

  public static queueGet(guildId: string) {
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
    serverQueue.songs = [song].concat(serverQueue.songs);
    this.queueSet(message.guild.id, serverQueue);
    return MessageHandler.sendAddedToQueue(message.channel, song);
  }
  
  static setServerQueue(message: Message) {
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
