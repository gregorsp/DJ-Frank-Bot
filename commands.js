const search = require("./search.js");
const ytdl = require("ytdl-core");

const sender = require("./sender.js");
const helper = require("./helper.js")
async function execute(message, serverQueue, queueGet, queueSet, queueDelete) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("Mir fehlen Rechte!");
  }

  //const songInfo = await ytdl.getInfo(args[1]);
  //const songInfo = await getInfo(args.slice(1).join(" "));
  const songInfo = await search.getInfo3(args.slice(1).join(" "));
  //console.log(songInfo2);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    videoDetails: songInfo.videoDetails,
  };

  if (!serverQueue) {
    serverQueue = helper.setServerQueue(queueSet, queueGet, message.guild.id, message)
    serverQueue.songs.push(song);
    errCounter = 0;
    try {
      while (errCounter < 3) {
        try {
          var connection = await voiceChannel.join();
          serverQueue.connection = connection;
          play(message.guild, serverQueue.songs[0], queueGet, queueDelete);
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
      queueDelete(message.guild.id);
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
function play(guild, song, queueGet, queueDelete) {
  const serverQueue = queueGet(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queueDelete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25 }))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0], queueGet, queueDelete);
    })
    .on("error", (error) => {
      console.error(error);
      serverQueue.textChannel.send("Fehler beim abspielen:\n" + error);
      // serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  sender.sendSongToChat(serverQueue, song);
}

async function playlist(message, serverQueue, queueAdd) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("Mir fehlen Rechte!");
  }

  const playlistInfo = await search.getPlaylistInfo(args.slice(1).join(" "));
  console.log(playlistInfo);
  if (!serverQueue) {helper.setServerQueue(queueSet, queueGet, message.guild.id, message)}
  for (let i = 0; i < playlistInfo.length; i++) {
    await queueAdd(playlistInfo[i].id, serverQueue, message);
  }

  console.log(serverQueue.songs);
  //...
}

const say = (message) => {
  sender.sayCommand(message);
};


module.exports = { execute, skip, stop, playlist, say };
