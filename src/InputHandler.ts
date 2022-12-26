import discord = require("discord.js");
import { Client, Intents, Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import fs = require("fs");
const sql = require("mssql");
import ytMusic = require("node-youtube-music");
import request = require("request");
const SpotifyWebApi = require("spotify-web-api-node");
import youtubesearchapi = require("youtube-search-api");
import ytdl = require("ytdl-core");

const prefix = ".";
const id = "a97738f2a1ba46aa9386d2f7f351dec5";
const CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");
const secret = fs.readFileSync("./spotifysecret", "utf8");

export class InputHandler {
  private queue: Map<string, any> = new Map();

  private api = new SpotifyWebApi({
    clientId: id,
    clientSecret: secret,
    redirectUri: "http://www.example.com/callback",
  });
  constructor() {

  }

  handleMessage = async (message : Message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    var serverQueue = this.queueGet(message.guild.id);

    const command = message.content.slice(prefix.length).split(" ")[0];
    switch (command) {
      case "debug":
        var matches = await this.debug(message, serverQueue);
        for (let i = 0; i < matches.length; i++) {
          var currentSong = matches[i].Title + " - " + matches[i].RawArtists;
          var PreferredYouTubeLink = matches[i].PreferredYouTubeLink;
          if (PreferredYouTubeLink != "") {
            currentSong = PreferredYouTubeLink;
          }
          message.content = ".p " + currentSong;
          // message.reply(message.content)
          serverQueue = this.queueGet(message.guild.id);

          await this.play(message, serverQueue);
        }
        break;
      case "p":
      case "play":
        if (message.content.length >= 6) return;
        this.play(message, serverQueue);
        break;
      case "playlist":
        this.playlist(message, serverQueue);
        break;
      case "skip":
      case "next":
      case "s":
        this.skip(message, serverQueue);
        break;
      case "stop":
      case "leave":
      case "quit":
      case "disconnect":
        this.clearQueue(message, serverQueue);
        break;
      case "say":
        this.say(message);
        break;
      case "repo":
        let link = "https://www.github.com/gregorsp/DJ-Frank-Bot";
        message.reply(link);
        break;
      case "random":
      case "r":
        var length =
          message.content.length > 8 ? this.getNthWord(message.content, 2) : 1;
        if (length > 10) length = 10;
        var titles = await this.spotify("30YalNqYddehoSL44yETCo", length);
        for (let i = 0; i < titles.length; i++) {
          message.content = ".p " + titles[i];
          // message.reply(message.content)
          serverQueue = this.queueGet(message.guild.id);

          await this.play(message, serverQueue);
        }
        break;
      case "i":
        var titles = await this.fabian(
          message,
          serverQueue,
          "30YalNqYddehoSL44yETCo"
        );
        if (titles.length == 0) {
          message.reply("Gibs keine Beweise");
        }
        for (let i = 0; i < titles.length; i++) {
          message.content = ".p " + titles[i];
          // message.reply(message.content)
          serverQueue = this.queueGet(message.guild.id);

          await this.play(message, serverQueue);
        }
        break;
      case "spotify":
        var spotLink = this.getNthWord(message.content, 2);
        var spotId = this.getSpotifyPlaylistId(spotLink);
        var count = 1;
        try {
          count = this.getNthWord(message.content, 3);
        } catch (ex) {
          message.reply(ex);
        }

        var titles = await this.spotify(spotId, count);
        for (let i = 0; i < titles.length; i++) {
          message.content = ".p " + titles[i];
          // message.reply(message.content)
          serverQueue = this.queueGet(message.guild.id);

          await this.play(message, serverQueue);
        }
        break;
      default:
        break;
    }
  }

  async play(message : Message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("Mir fehlen Rechte!");
    }

    //const songInfo = await ytdl.getInfo(args[1]);
    //const songInfo = await getInfo(args.slice(1).join(" "));
    const songInfo = await this.getSongInfo(args.slice(1).join(" "));
    //console.log(songInfo2);
    const song = this.songInfoToSongObject(songInfo);

    if (!serverQueue) {
      serverQueue = this.setServerQueue(message);
      serverQueue.songs.push(song);
      this.tryPlay(voiceChannel, serverQueue, message);
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} wurde zur Queue hinzugefügt!`);
    }
  }

  skip(message: Message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send("Du bist in keinem Voice!");
    if (!serverQueue) return message.channel.send("Queue ist leer!");
    serverQueue.connection.dispatcher.end();
  }

  clearQueue(message: Message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send("Du bist in keinem Voice!");

    if (!serverQueue) return message.channel.send("Queue ist leer!");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }

  async playlist(message: Message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Du bist in keinem Voice.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("Mir fehlen Rechte!");
    }

    const playlistInfo = await this.getPlaylistInfo(args.slice(1).join(" "));
    console.log(playlistInfo);
    var emptyQueue = false;
    if (!serverQueue) {
      serverQueue = this.setServerQueue(message);
      emptyQueue = true;
    }
    for (let i = 0; i < playlistInfo.length; i++) {
      await this.queueAdd(playlistInfo[i].id, serverQueue, message);
    }
    if (emptyQueue) {
      this.tryPlay(voiceChannel, serverQueue, message);
    }
    console.log(serverQueue.songs);
    //...
  }

  say(message: Message) {
    this.sayCommand(message);
  }

  async spotify(playlistId : string, amount : number) {
    return await this.GetRandomSongsFromPlaylist(playlistId, amount);
  }

  async fabian(message: Message, serverQueue, playlistId : string) {
    const args = message.content.split(" ");
    var amount : number = parseInt(args.slice(1)[0]);
    var interprets = args.slice(2).join(" ").split("|");

    var matches = await this.GetMatchingSongsFromPlaylist(
      playlistId,
      interprets
    );
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
  async debug(message: Message, serverQueue) {
    const args = message.content.split(" ");
    const amount = args.slice(1)[0];
    const playlistId = parseInt(args.slice(2)[0]);
    var matches = await this.getPlaylistFromDatabase(playlistId);
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

  async getPlaylistFromDatabase(playlistId : number) {
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
  }

  isValidHttpUrl(string : string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  setServerQueue(message : Message) {
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

  songInfoToSongObject(songInfo) {
    return {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      videoDetails: songInfo.videoDetails,
    };
  }

  getNthWord(text : string, n : number) {
    return text.split(" ")[n - 1];
  }

  getSpotifyPlaylistId(link : string) {
    // https://open.spotify.com/playlist/7ktaQvt898S3BYWkO90gFu?si=54b6547bf49a4d87
    var a = link.split("/");
    var b = a.slice(-1)[0];
    var c = b.split("?");
    var d = c.slice(0)[0];
    return d;
  }

  async tryPlay(voiceChannel, serverQueue, message : Message) {
    let errCounter = 0;
    try {
      while (errCounter < 3) {
        try {
          var connection = await voiceChannel.join();
          connection.on("disconnect", (event) => {
            this.queueDelete(message.guild.id);
            message.channel.send("Die Party ist vorbei!");
          });
          serverQueue.connection = connection;
          this.reallyPlay(message.guild, serverQueue.songs[0]);
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
      this.queueDelete(message.guild.id);
      return message.channel.send(err);
    }
  }

  reallyPlay(guild : discord.Guild, song) {
    const serverQueue = this.queueGet(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      this.queueDelete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25 }))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.reallyPlay(guild, serverQueue.songs[0]);
      })
      .on("error", (error) => {
        console.error(error);
        serverQueue.textChannel.send("Fehler beim abspielen:\n" + error);
        // serverQueue.songs.shift();
        this.reallyPlay(guild, serverQueue.songs[0]);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    this.sendSongToChat(serverQueue, song);
  }

  private queueGet(guildId : string) {
    return this.queue.get(guildId);
  }

  private queueSet(guildId : string, queueContruct) {
    return this.queue.set(guildId, queueContruct);
  }

  queueDelete(guildId : string) {
    return this.queue.delete(guildId);
  }

  async queueAdd(id : string, serverQueue, message : Message) {
    let arg = "https://www.youtube.com/watch?v=" + id;

    const songInfo = await this.getSongInfo(arg);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      videoDetails: songInfo.videoDetails,
    };

    serverQueue.songs.push(song);
    return this.sendAddedToQueue(message.channel, song);
  }

  async getSongInfo(songArgs : string) {
    //arg += ' lyrics -live -karaoke';
    if (this.isValidHttpUrl(songArgs)) {
      return await ytdl.getInfo(songArgs);
      //TODO: handle youtube searcher
    } else {
      let liste = await ytMusic.searchMusics(songArgs);
      if (liste.length == 0) {
        return await ytdl.getInfo(
          "https://www.youtube.com/watch?v=lYBUbBu4W08"
        );
      }
      let url = "https://www.youtube.com/watch?v=" + liste[0].youtubeId;
      return await ytdl.getInfo(url);
    }
  }

  async getPlaylistInfo(arg : string) {
    if (this.isValidHttpUrl(arg)) {
      let liste = await (
        await youtubesearchapi.GetPlaylistData(arg.split("=")[1])
      ).items;
      //const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;
      console.log(liste);
      return await liste; //ytdl.getInfo(url);
    }
  }

  getMusicEmbed(videoDetails, queue: any = []) {
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
      .setFooter("Noch " + count + " weitere Lieder in der Queue")
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

  sendSongToChat(serverQueue, song) {
    serverQueue.textChannel.send(`Jetzt: **${song.title}**`);
    serverQueue.textChannel.send(
      this.getMusicEmbed(song.videoDetails, serverQueue)
    );

    if (Math.random() * 5 < 1) {
      serverQueue.textChannel.send(`Den Song mag ich besonders gern!`);
    }
  }

  sendAddedToQueue(channel, song) {
    return channel.send(`${song.title} wurde zur Queue hinzugefügt!`);
  }
  sayCommand(message: Message) {
    const answer = message.content.slice(5);
    message.channel.send(answer);
    message.delete();
  }

  async getAccesToken() {
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
    var t = await this.doRequest(authOptions);
    const hacky: any = t;
    return hacky.access_token;
  }

  doRequest(url : string) {
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

  async GetRandomSongsFromPlaylist(
    playlistId = "30YalNqYddehoSL44yETCo",
    amount = 1
  ) {
    this.api.setAccessToken(await this.getAccesToken());
    let retval = [];
    var liste = await this.api.getPlaylist(playlistId); //https://open.spotify.com/playlist/30YalNqYddehoSL44yETCo?si=e7f2c7e83eef45f7
    var length = liste.body.tracks.total;
    let tracks = [];
    for (var i = 0; i < length; i = i + 100) {
      tracks.push.apply(
        tracks,
        (
          await this.api.getPlaylistTracks(playlistId, {
            offset: i,
            limit: 100,
          })
        ).body.items
      );
    }
    for (let i = 0; i < amount && i < 20; i++) {
      retval.push(
        this.apiTrackToText(tracks[Math.floor(Math.random() * tracks.length)])
      );
    }
    return retval;
  }

  apiTrackToText(track) {
    var artist = track.track.artists[0].name;
    var title = track.track.name;
    return artist + " - " + title;
  }

  async GetMatchingSongsFromPlaylist(
    playlistId = "30YalNqYddehoSL44yETCo",
    interprets
  ) {
    this.api.setAccessToken(await this.getAccesToken());
    let retval = [];
    var liste: any = [];
    try {
      liste = await this.api.getPlaylist(playlistId); //https://open.spotify.com/playlist/30YalNqYddehoSL44yETCo?si=e7f2c7e83eef45f7
    } catch (e) {
      console.error(e);
    }
    var length = liste.body.tracks.total;
    let tracks = [];
    for (var i = 0; i < length; i = i + 100) {
      tracks.push.apply(
        tracks,
        (
          await this.api.getPlaylistTracks(playlistId, {
            offset: i,
            limit: 100,
          })
        ).body.items
      );
    }
    for (let i = 0; i < length; i++) {
      var song = this.apiTrackToText(tracks[i]);
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
}
