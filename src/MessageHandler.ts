import { MessageEmbed } from "discord.js";
import { Queue, Song } from "./interfaces";
export class MessageHandler {
  static sendSongToChat(serverQueue: Queue, song: Song) {
    serverQueue.textChannel.send(`Jetzt: **${song.title}**`);
    serverQueue.textChannel.send(this.getMusicEmbed(song.videoDetails, serverQueue));

    if (Math.random() * 5 < 1) {
      serverQueue.textChannel.send(`Den Song mag ich besonders gern!`);
    }
  }

  public static sendAddedToQueue(channel, song : Song) {
    return channel.send(`${song.title} wurde zur Queue hinzugefügt!`);
  }
  static getMusicEmbed(videoDetails, queue: any = []) {
    console.log(videoDetails);

    let author = videoDetails.author.name;
    if (author.endsWith(" - Topic")) {
      author = author.slice(0, author.length - 8);
    }
    var count = queue.songs.length - 1;
    var next = "Noch " + count + " weitere Lieder in der Queue";
    if ( count > 1) {
      next += ", als nächstes kommt: " + queue.songs[1].title;
    }
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(videoDetails.title)
      .setURL(videoDetails.video_url)
      .setAuthor(author, videoDetails.author.thumbnails.slice(-1)[0].url, videoDetails.author.user_url)
      .setFooter(next)
      //.setDescription(videoDetails.description)
      //.setThumbnail(videoDetails.thumbnails.slice(-1)[0].url)
      // .addFields(
      //   { name: 'Regular field title', value: 'Some value here' },
      //   { name: '\u200B', value: '\u200B' },
      //   { name: 'Inline field title', value: 'Some value here', inline: true },
      //   { name: 'Inline field title', value: 'Some value here', inline: true },
      // )
      //.addField('Inline field title', 'Some value here', true)
      .setImage(videoDetails.thumbnails.slice(-1)[0].url);
    //.setTimestamp()
    //.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

    return embed;
  }
}
