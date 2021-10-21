const { Client, Intents } = require("discord.js");
const prefix = ".";
const token = "ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE";
const ytdl = require("ytdl-core");
const YTF = require("youtube-finder");
const util = require('util');
const fs = require('fs');
const youtubesearchapi=require('youtube-search-api');


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
  console.log(message);
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
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
  arg += ' lyrics -live -karaoke';
  if (isValidHttpUrl(arg)) {
    return await ytdl.getInfo(arg);
  //TODO: handle youtube searcher
  } else {
    let liste = await youtubesearchapi.GetListByKeyword(arg, false);
    const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;

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
  const songInfo = await getInfo2(args.slice(1).join(" "));
  //console.log(songInfo2);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
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

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
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
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Jetzt: **${song.title}**`);
  serverQueue.textChannel.send(`Den Song mag ich besonders gern!`);
}

const say = (message) => {
  const answer = message.content.slice(5);
  message.channel.send(answer);
  message.delete();
}

client.login(token);
