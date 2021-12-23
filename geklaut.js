const { Client, Intents, MessageEmbed } = require("discord.js");
const prefix = ".";
const token = "ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE";
const ytdl = require("ytdl-core");
const YTF = require("youtube-finder");
const util = require('util');
const fs = require('fs');
const youtubesearchapi=require('youtube-search-api');
const ytMusic = require('node-youtube-music');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const ytclient = YTF.createClient({
  key: "AIzaSyC-sh8qoiYS1hIw2eauhjJmAF_1L_AKZ7k",
});

const queue = new Map();

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async (message) => {
  //console.log(message);
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play `)|message.content.startsWith(`${prefix}p `)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}say`)) {
    say(message);
    return;
  } else if (message.content.startsWith(`${prefix}playlist`)) {
    playlist(message, serverQueue);
  }
  // else {
  //     message.channel.send("You need to enter a valid command!");
  // }
}); /** */

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const getInfo = async (arg) => {
  arg += ' lyrics -live -karaoke';
  if (isValidHttpUrl(arg)) {
    return await ytdl.getInfo(arg);
  //TODO: handle youtube searcher
  } else {
    const search = (arg) => {
        return new Promise((resolve, reject) => {
            ytclient.search(arg, (err, data) => {
                if (err) {
                    return reject(err)
                }

                resolve(data)
            });
        });
    }
    var params = {
        part: 'id',
        q: arg,
        maxResults: 1,
        type: 'video'
    }
    const searchresult = await search(params);
    console.log("Ergebnis:");
    console.log(searchresult);
    const url = "https://www.youtube.com/watch?v=" + searchresult.items[0].id.videoId;

    return await ytdl.getInfo(url);
  }
};

const getInfo2 = async (arg) => {
  //arg += ' lyrics -live -karaoke';
  if (isValidHttpUrl(arg)) {
    return await ytdl.getInfo(arg);
  //TODO: handle youtube searcher
  } else {
    let liste = await youtubesearchapi.GetListByKeyword(arg, true);
    const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;

    return await ytdl.getInfo(url);
  }
}

const getInfo3 = async (arg) => {
  //arg += ' lyrics -live -karaoke';
  if (isValidHttpUrl(arg)) {
    return await ytdl.getInfo(arg);
  //TODO: handle youtube searcher
  } else {
    let liste = await ytMusic.searchMusics(arg);
    const url = "https://www.youtube.com/watch?v=" + liste[0].youtubeId;

    return await ytdl.getInfo(url);
  }
}

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("Mir fehlen Rechte!");
  }

  //const songInfo = await ytdl.getInfo(args[1]);
  //const songInfo = await getInfo(args.slice(1).join(" "));
  const songInfo = await getInfo3(args.slice(1).join(" "));
  //console.log(songInfo2);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    videoDetails: songInfo.videoDetails,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);
    errCounter = 0;
    try {
      while (errCounter < 3) {
        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          play(message.guild, queueContruct.songs[0]);
          errCounter = 10000;
        } catch(err) {
          if (errCounter == 3) {
            throw (err)
          }
          console.log(err);

          errCounter++;
        }
      }
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} wurde zur Queue hinzugefügt!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send("Du bist in keinem Voice!");
  if (!serverQueue) return message.channel.send("Queue ist leer!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send("Du bist in keinem Voice!");

  if (!serverQueue) return message.channel.send("Queue ist leer!");

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}
function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url, {quality: "highestaudio", highWaterMark: 1 << 25}))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => { 
      console.error(error);
      serverQueue.textChannel.send("Fehler beim abspielen:\n"+error);
      // serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);});
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Jetzt: **${song.title}**`);
  serverQueue.textChannel.send(getMusicEmbed(song.videoDetails));

  if (Math.random()*5 <1 ) {
    serverQueue.textChannel.send(`Den Song mag ich besonders gern!`);
  }
}

async function playlist(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("Mir fehlen Rechte!");
  }

  const playlistInfo = await getPlaylistInfo(args.slice(1).join(" "));
  console.log(playlistInfo)
  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);
    serverQueue = queue.get(message.guild.id);
  }
  for (let i = 0; i < playlistInfo.length; i++) {
    await addToQueue(playlistInfo[i].id, serverQueue, message);
  }
  
  console.log(serverQueue.songs);
  //...
}

const getPlaylistInfo = async (arg) => {
  if (isValidHttpUrl(arg)) {
    let liste = await (await youtubesearchapi.GetPlaylistData(arg.split("=")[1])).items
    //const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;
    console.log(liste);
    return await liste;//ytdl.getInfo(url);
  }
}

async function addToQueue(id, serverQueue, message){
  arg = "https://www.youtube.com/watch?v=" + id

  const songInfo = await getInfo3(arg);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    videoDetails: songInfo.videoDetails,
  };


  serverQueue.songs.push(song);
  return message.channel.send(`${song.title} wurde zur Queue hinzugefügt!`);

}

const say = (message) => {
  const answer = message.content.slice(5);
  message.channel.send(answer);
  message.delete();
}

const getMusicEmbed = (videoDetails) => {
  console.log(videoDetails);

  let author = videoDetails.author.name;
  if (author.endsWith(" - Topic")){
    author = author.slice(0, author.length - 8);
  }

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(videoDetails.title)
    .setURL(videoDetails.video_url)
    .setAuthor(author, videoDetails.author.thumbnails.slice(-1)[0].url, videoDetails.author.user_url)
    //.setDescription(videoDetails.description)
    //.setThumbnail(videoDetails.thumbnails.slice(-1)[0].url)
    // .addFields(
    //   { name: 'Regular field title', value: 'Some value here' },
    //   { name: '\u200B', value: '\u200B' },
    //   { name: 'Inline field title', value: 'Some value here', inline: true },
    //   { name: 'Inline field title', value: 'Some value here', inline: true },
    // )
    //.addField('Inline field title', 'Some value here', true)
    .setImage(videoDetails.thumbnails.slice(-1)[0].url)
    //.setTimestamp()
    //.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
  
    return embed
}

client.login(token);
