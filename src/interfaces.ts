import { DMChannel, NewsChannel, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";

export class Song {
  title: string;
  url: string;
  videoDetails: any;
  constructor(title: string = null, url: string = null, videoDetails: any = null) {
    this.title = title;
    this.url = url;
    this.videoDetails = videoDetails;
  }
}
export class Queue {
  textChannel: TextChannel | DMChannel | NewsChannel;
  voiceChannel: VoiceChannel;
  connection: VoiceConnection = null;
  songs: Song[] = [];
  volume = 5;
  playing: true;
}
