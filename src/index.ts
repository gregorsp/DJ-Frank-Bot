const { Client, Intents } = require("discord.js");

const fs = require("fs");

const token = fs.readFileSync("./discordtoken", "utf8"); //"ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE";
const prefix = ".";

const ytdl = require("ytdl-core");
var sql = require("mssql");

const CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");

const ytMusic = require("node-youtube-music");
const youtubesearchapi = require("youtube-search-api");
const {MessageEmbed } = require("discord.js");
var SpotifyWebApi = require("spotify-web-api-node");
const request = require("request");

const id = "a97738f2a1ba46aa9386d2f7f351dec5";
const secret = fs.readFileSync("./spotifysecret", "utf8");


const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

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
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  var serverQueue = queueGet(message.guild.id);

  const command = message.content.slice(prefix.length).split(" ")[0];
  switch (command) {
    case "debug":
      var matches = await debug(message, serverQueue, queueCommands);
      for (let i = 0; i < matches.length; i++) {
        var currentSong = matches[i].Title + " - " + matches[i].RawArtists;
        var PreferredYouTubeLink = matches[i].PreferredYouTubeLink;
        if (PreferredYouTubeLink != "") {
          currentSong = PreferredYouTubeLink;
        }
        message.content = ".p " + currentSong;
        // message.reply(message.content)
        serverQueue = queueGet(message.guild.id);

        await play(message, serverQueue, queueCommands)
      }
      break;
    case "p":
    case "play":
      if (message.length >= 6) return;
      play(message, serverQueue, queueCommands);
      break;
    case "playlist":
      playlist(message, serverQueue, queueCommands);
      break;
    case "skip":
    case "next":
    case "s":
      skip(message, serverQueue);
      break;
    case "stop":
    case "leave":
    case "quit":
    case "disconnect":
      clearQueue(message, serverQueue);
      break;
    case "say":
      say(message);
      break;
    case "repo":
      let link =  "https://www.github.com/gregorsp/DJ-Frank-Bot"
      message.reply(link);
      break;
    case "random":
    case "r":
      var length = message.content.length > 8 ? getNthWord(message.content, 2) : 1
      if (length > 10) length = 10;
      var titles = await spotify("30YalNqYddehoSL44yETCo", length);
      for (let i = 0; i < titles.length; i++){
        message.content = ".p " + titles[i]
        // message.reply(message.content)
        serverQueue = queueGet(message.guild.id);

        await play(message, serverQueue, queueCommands)
      }
      break;
    case "i":
      var titles = await fabian(message, serverQueue, queueCommands, "30YalNqYddehoSL44yETCo");
      if (titles.length == 0) {
        message.reply("Gibs keine Beweise");
      }
      for (let i = 0; i < titles.length; i++){
        message.content = ".p " + titles[i]
        // message.reply(message.content)
        serverQueue = queueGet(message.guild.id);

        await play(message, serverQueue, queueCommands)
      }
      break;
    case "spotify":
      var spotLink = getNthWord(message.content, 2);
      var spotId = getSpotifyPlaylistId(spotLink);
      var count = 1;
      try {
        count = getNthWord(message.content, 3);
      }
      catch (ex) {
        message.reply(ex);
      }

      var titles = await spotify(spotId, count);
      for (let i = 0; i < titles.length; i++){
        message.content = ".p " + titles[i]
        // message.reply(message.content)
        serverQueue = queueGet(message.guild.id);

        await play(message, serverQueue, queueCommands)
      }
      break;
    default:
      break;
  }
});

client.login(token);


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
  const songInfo = await getSongInfo(args.slice(1).join(" "));
  //console.log(songInfo2);
  const song = songInfoToSongObject(songInfo);

  if (!serverQueue) {
    serverQueue = setServerQueue(queueCommands, message);
    serverQueue.songs.push(song);
    tryPlay(voiceChannel, serverQueue, message, queueCommands);
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

function clearQueue(message, serverQueue) {
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

  const playlistInfo = await getPlaylistInfo(args.slice(1).join(" "));
  console.log(playlistInfo);
  var emptyQueue = false;
  if (!serverQueue) {
    serverQueue = setServerQueue(queueCommands, message);
    emptyQueue = true;
  }
  for (let i = 0; i < playlistInfo.length; i++) {
    await queueCommands.queueAdd(playlistInfo[i].id, serverQueue, message);
  }
  if (emptyQueue) {
    tryPlay(voiceChannel, serverQueue, message, queueCommands);
  }
  console.log(serverQueue.songs);
  //...
}

const say = (message) => {
  sayCommand(message);
};

const spotify = async (playlistId, amount) => {
  return await GetRandomSongsFromPlaylist(playlistId, amount)
}

const fabian = async (message, serverQueue, queueCommands, playlistId) => {
  const args = message.content.split(" ");
  var amount = args.slice(1)[0];
  var interprets = args.slice(2).join(" ").split("|")

  var matches = await GetMatchingSongsFromPlaylist(playlistId, interprets);
  var toQueue = [];
  if (matches.length == 0) return toQueue;
  if (amount >= matches.length) {
    toQueue = matches;
    //shuffle toQueue
    toQueue = toQueue.sort((a, b) => 0.5 - Math.random());

    for (let i = matches.length; i < amount; i++) {
      // add a random entry of matches to toQueue
      toQueue.push(matches[Math.floor(Math.random() * matches.length)]);
    }
  } else {
    toQueue = matches.sort((a, b) => 0.5 - Math.random()).slice(0, amount);
  }

  return toQueue;
}
const debug = async (message, serverQueue, queueCommands) => {
  const args = message.content.split(" ");
  const amount = args.slice(1)[0];
  const playlistId = args.slice(2)[0];
  var matches = await getPlaylistFromDatabase(playlistId);
  var toQueue = [];
  if (amount >= matches.length) {
    toQueue = matches;
    //shuffle toQueue
    toQueue = toQueue.sort((a, b) => 0.5 - Math.random());

    for (let i = matches.length; i < amount; i++) {
      // add a random entry of matches to toQueue
      toQueue.push(matches[Math.floor(Math.random() * matches.length)]);
    }
  } else {
    toQueue = matches.sort((a, b) => 0.5 - Math.random()).slice(0, amount);
  }
  return toQueue;
}

module.exports = { play, skip, clearQueue, playlist, say, spotify, fabian, debug };



const getPlaylistFromDatabase = async (playlistId) => {
  const QUERY = `DECLARE	@return_value int

  EXEC	@return_value = [dbo].[GetSongsByPlaylistId]
          @playlistId = ${playlistId}
  
  SELECT	'Return Value' = @return_value`;
  // connect to the MSSQL database
  const pool = await sql.connect(CONNECTIONSTRING);
  // query the database
  const result = await pool.request().query(QUERY);
  // return the result
  return result.recordset;
};

module.exports = { getPlaylistFromDatabase };

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const setServerQueue = (queueCommands, message) => {
  const queueContruct = {
    textChannel: message.channel,
    voiceChannel: message.member.voice.channel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
  };

  queueCommands.queueSet(message.guild.id, queueContruct);
  return queueCommands.queueGet(message.guild.id);
};

const songInfoToSongObject = (songInfo) => {
  return {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    videoDetails: songInfo.videoDetails,
  };
};

const getNthWord = (text, n) => {
  return text.split(" ")[n-1]
}

const getSpotifyPlaylistId = (link) => {
  // https://open.spotify.com/playlist/7ktaQvt898S3BYWkO90gFu?si=54b6547bf49a4d87
  var a = link.split("/");
  var b = a.slice(-1)[0];
  var c = b.split("?");
  var d = c.slice(0)[0];
  return d;
}

module.exports = { isValidHttpUrl, setServerQueue, songInfoToSongObject, getNthWord, getSpotifyPlaylistId };



async function tryPlay(voiceChannel, serverQueue, message, queueCommands) {
  let errCounter = 0;
  try {
    while (errCounter < 3) {
      try {
        var connection = await voiceChannel.join();
        connection.on("disconnect", (event) => {
          queueCommands.queueDelete(message.guild.id);
          message.channel.send("Die Party ist vorbei!")
        })
        serverQueue.connection = connection;
        reallyPlay(message.guild, serverQueue.songs[0], queueCommands);
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
    queueCommands.queueDelete(message.guild.id);
    return message.channel.send(err);
  }
}

function reallyPlay(guild, song, queueCommands) {
  const serverQueue = queueCommands.queueGet(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queueCommands.queueDelete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25 }))
    .on("finish", () => {
      serverQueue.songs.shift();
      reallyPlay(guild, serverQueue.songs[0], queueCommands);
    })
    .on("error", (error) => {
      console.error(error);
      serverQueue.textChannel.send("Fehler beim abspielen:\n" + error);
      // serverQueue.songs.shift();
      reallyPlay(guild, serverQueue.songs[0], queueCommands);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  sendSongToChat(serverQueue, song);
}

module.exports = { tryPlay };

const queue = new Map();

const queueGet = (guildId) => {
  return queue.get(guildId);
};

const queueSet = (guildId, queueContruct) => {
  return queue.set(guildId, queueContruct);
};

const queueDelete = (guildId) => {
  return queue.delete(guildId);
};

async function queueAdd(id, serverQueue, message) {
  let arg = "https://www.youtube.com/watch?v=" + id;

  const songInfo = await getSongInfo(arg);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    videoDetails: songInfo.videoDetails,
  };

  serverQueue.songs.push(song);
  return sendAddedToQueue(message.channel, song);
}

const queueCommands = { queueGet, queueSet, queueDelete, queueAdd };

module.exports = {
  queue,
  queueSet,
  queueGet,
  queueDelete,
  queueAdd,
  queueCommands,
};



const getSongInfo = async (arg) => {
  //arg += ' lyrics -live -karaoke';
  if (isValidHttpUrl(arg)) {
    return await ytdl.getInfo(arg);
    //TODO: handle youtube searcher
  } else {
    let liste = await ytMusic.searchMusics(arg);
    if (liste.length == 0) {
      return await ytdl.getInfo("https://www.youtube.com/watch?v=lYBUbBu4W08");
    }
    let url = "https://www.youtube.com/watch?v=" + liste[0].youtubeId;
    return await ytdl.getInfo(url);
  }
};

const getPlaylistInfo = async (arg) => {
  if (isValidHttpUrl(arg)) {
    let liste = await (
      await youtubesearchapi.GetPlaylistData(arg.split("=")[1])
    ).items;
    //const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;
    console.log(liste);
    return await liste; //ytdl.getInfo(url);
  }
};

module.exports = { getSongInfo, getPlaylistInfo };


const getMusicEmbed = (videoDetails, queue : any = []) => {
  console.log(videoDetails);

  let author = videoDetails.author.name;
  if (author.endsWith(" - Topic")) {
    author = author.slice(0, author.length - 8);
  }
  var count = queue.songs.length - 1;
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(videoDetails.title)
    .setURL(videoDetails.video_url)
    .setAuthor(
      author,
      videoDetails.author.thumbnails.slice(-1)[0].url,
      videoDetails.author.user_url
    )
    .setFooter("Noch "+count+" weitere Lieder in der Queue")
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
};

const sendSongToChat = (serverQueue, song) => {
  serverQueue.textChannel.send(`Jetzt: **${song.title}**`);
  serverQueue.textChannel.send(getMusicEmbed(song.videoDetails, serverQueue));

  if (Math.random() * 5 < 1) {
    serverQueue.textChannel.send(`Den Song mag ich besonders gern!`);
  }
};

const sendAddedToQueue = (channel, song) => {
  return channel.send(`${song.title} wurde zur Queue hinzugefügt!`);
};

const sayCommand = (message) => {
  const answer = message.content.slice(5);
  message.channel.send(answer);
  message.delete();
};

module.exports = { sendSongToChat, sayCommand, sendAddedToQueue };



var api = new SpotifyWebApi({
  clientId: id,
  clientSecret: secret,
  redirectUri: "http://www.example.com/callback",
});

const getAccesToken = async () => {
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " + new Buffer(id + ":" + secret).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };
  /*
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var token = body.access_token;
    }
  });*/
  var t = await doRequest(authOptions);
  const hacky : any = t;
  return hacky.access_token;
};

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request.post(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

const GetRandomSongsFromPlaylist = async (
  playlistId = "30YalNqYddehoSL44yETCo",
  amount = 1
  ) => {
  api.setAccessToken(await getAccesToken());
  let retval = [];
  var liste = await api.getPlaylist(playlistId); //https://open.spotify.com/playlist/30YalNqYddehoSL44yETCo?si=e7f2c7e83eef45f7
  var length = liste.body.tracks.total;
  let tracks = [];
  for (var i = 0; i < length; i = i + 100) {
    tracks.push.apply(
      tracks,
      (
        await api.getPlaylistTracks(playlistId, {
          offset: i,
          limit: 100,
        })
      ).body.items
    );
  }
  for (let i = 0; i < amount && i < 20; i++) {
    retval.push(apiTrackToText(tracks[Math.floor(Math.random() * tracks.length)]))
  }
  return retval;
};

const apiTrackToText = (track) => {
  var artist = track.track.artists[0].name;
  var title = track.track.name;
  return artist + " - " + title;
};

const GetMatchingSongsFromPlaylist = async (playlistId = "30YalNqYddehoSL44yETCo", interprets) => {
  api.setAccessToken(await getAccesToken());
  let retval = [];
  var liste: any = [];
  try {

    liste = await api.getPlaylist(playlistId); //https://open.spotify.com/playlist/30YalNqYddehoSL44yETCo?si=e7f2c7e83eef45f7
  } catch (e) {
    console.error(e);
  }
  var length = liste.body.tracks.total;
  let tracks = [];
  for (var i = 0; i < length; i = i + 100) {
    tracks.push.apply(
      tracks,
      (
        await api.getPlaylistTracks(playlistId, {
          offset: i,
          limit: 100,
        })
      ).body.items
    );
  }
  for (let i = 0; i < length; i++) {
    var song = apiTrackToText(tracks[i]);
    for (let j = 0; j < interprets.length; j++) {
      var currentArtist = tracks[i].track.artists[0].name.toLowerCase();
      var toFindArtist = interprets[j].toLowerCase().trim();
      if (currentArtist.includes(toFindArtist)) {
        retval.push(song);
        continue;
      }
    }
  }
  return retval;
}

module.exports = { GetRandomSongsFromPlaylist, GetMatchingSongsFromPlaylist };
