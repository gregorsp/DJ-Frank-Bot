const search = require("./search.js");
const sender = require("./sender.js");
const helper = require("./helper.js");
const player = require("./player.js");
const spoti  = require("./spotify.js")

async function play(message, serverQueue, queueCommands) {
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
    serverQueue = helper.setServerQueue(queueCommands, message);
    serverQueue.songs.push(song);
    player.tryPlay(voiceChannel, serverQueue, message, queueCommands);
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

async function playlist(message, serverQueue, queueCommands) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("Mir fehlen Rechte!");
  }

  const playlistInfo = await search.getPlaylistInfo(args.slice(1).join(" "));
  console.log(playlistInfo);
  var emptyQueue = false;
  if (!serverQueue) {
    serverQueue = helper.setServerQueue(queueCommands, message);
    emptyQueue = true;
  }
  for (let i = 0; i < playlistInfo.length; i++) {
    await queueCommands.queueAdd(playlistInfo[i].id, serverQueue, message);
  }
  if (emptyQueue) {
    player.tryPlay(voiceChannel, serverQueue, message, queueCommands);
  }
  console.log(serverQueue.songs);
  //...
}

const say = (message) => {
  sender.sayCommand(message);
};

const spotify = async (playlistId, amount) => {
  return await spoti.GetRandomSongsFromPlaylist(playlistId, amount)
}

const fabian = async (message, serverQueue, queueCommands, playlistId) => {
  const args = message.content.split(" ");
  var amount = args.slice(1)[0];
  var interprets = args.slice(2).join(" ").split("|")

  var matches = await spoti.GetMatchingSongsFromPlaylist(playlistId, interprets);
  var toQueue = [];

  if (amount >= matches.length) {
    toQueue = matches;
    for (let i = matches.length; i < amount; i++) {
      // add a random entry of matches to toQueue
      toQueue.push(matches[Math.floor(Math.random() * matches.length)]);
    }
  } else {
    for (let i = 0; i < amount; i++) {
      // add a random entry of matches to toQueue
      toQueue.push(matches[Math.floor(Math.random() * matches.length)]);
    }
  }

  return toQueue;
}

module.exports = { play, skip, stop, playlist, say, spotify, fabian };
