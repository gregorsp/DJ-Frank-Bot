const search = require("./search.js");

const sender = require("./sender.js");
const helper = require("./helper.js");
const player = require("./player.js")
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
  const songInfo = await search.getSongInfo(args.slice(1).join(" "));
  //console.log(songInfo2);
  const song = helper.songInfoToSongObject(songInfo);

  if (!serverQueue) {
    serverQueue = helper.setServerQueue(
      queueSet,
      queueGet,
      message.guild.id,
      message
    );
    serverQueue.songs.push(song);
    player.tryPlay(voiceChannel, serverQueue, message, queueGet, queueDelete);
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

async function playlist(message, serverQueue, queueSet, queueGet, queueAdd, queueDelete) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("Mir fehlen Rechte!");
  }

  const playlistInfo = await search.getPlaylistInfo(args.slice(1).join(" "));
  console.log(playlistInfo);
  var emptyQueue = false
  if (!serverQueue) {
    serverQueue = helper.setServerQueue(queueSet, queueGet, message.guild.id, message);
    emptyQueue = true
  }
  for (let i = 0; i < playlistInfo.length; i++) {
    await queueAdd(playlistInfo[i].id, serverQueue, message);
  }
  if (emptyQueue) {
    player.tryPlay(voiceChannel, serverQueue, message, queueGet, queueDelete);
  }
  console.log(serverQueue.songs);
  //...
}

const say = (message) => {
  sender.sayCommand(message);
};

module.exports = { execute, skip, stop, playlist, say };
