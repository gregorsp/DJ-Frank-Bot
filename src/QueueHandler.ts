import { MusicHandler } from "./MusicHandler";
import { MessageHandler } from "./MessageHandler";
import { Message } from "discord.js";

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

  public static async queueAdd(id: string, serverQueue, message: Message) {
    let arg = "https://www.youtube.com/watch?v=" + id;

    const songInfo = await MusicHandler.getSongInfo(arg);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      videoDetails: songInfo.videoDetails,
    };

    serverQueue.songs.push(song);
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
