const { Client, Intents } = require("discord.js");

const fs = require("fs");

const token = fs.readFileSync("./discordtoken", "utf8"); //"ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE";
const prefix = ".";

const commands = require("./commands.ts");
const queuer = require("./queuer.ts");
const helper = require("./helper.ts");
const ytdl = require("ytdl-core");
const sender = require("./sender.ts");
var sql = require("mssql");

const CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");

const ytMusic = require("node-youtube-music");
const youtubesearchapi = require("youtube-search-api");
const {MessageEmbed } = require("discord.js");
var SpotifyWebApi = require("spotify-web-api-node");
const request = require("request");

const id = "a97738f2a1ba46aa9386d2f7f351dec5";
const secret = fs.readFileSync("./spotifysecret", "utf8");
const search = require("./search.ts");
const player = require("./player.ts");
const spoti  = require("./spotify.ts")
const database = require("./database.ts");


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

  var serverQueue = queuer.queueGet(message.guild.id);

  const command = message.content.slice(prefix.length).split(" ")[0];
  switch (command) {
    case "debug":
      var matches = await commands.debug(message, serverQueue, queuer.queueCommands);
      for (let i = 0; i < matches.length; i++) {
        var currentSong = matches[i].Title + " - " + matches[i].RawArtists;
        var PreferredYouTubeLink = matches[i].PreferredYouTubeLink;
        if (PreferredYouTubeLink != "") {
          currentSong = PreferredYouTubeLink;
        }
        message.content = ".p " + currentSong;
        // message.reply(message.content)
        serverQueue = queuer.queueGet(message.guild.id);

        await commands.play(message, serverQueue, queuer.queueCommands)
      }
      break;
    case "p":
    case "play":
      if (message.length >= 6) return;
      commands.play(message, serverQueue, queuer.queueCommands);
      break;
    case "playlist":
      commands.playlist(message, serverQueue, queuer.queueCommands);
      break;
    case "skip":
    case "next":
    case "s":
      commands.skip(message, serverQueue);
      break;
    case "stop":
    case "leave":
    case "quit":
    case "disconnect":
      commands.stop(message, serverQueue);
      break;
    case "say":
      commands.say(message);
      break;
    case "repo":
      let link =  "https://www.github.com/gregorsp/DJ-Frank-Bot"
      message.reply(link);
      break;
    case "random":
    case "r":
      var length = message.content.length > 8 ? helper.getNthWord(message.content, 2) : 1
      if (length > 10) length = 10;
      var titles = await commands.spotify("30YalNqYddehoSL44yETCo", length);
      for (let i = 0; i < titles.length; i++){
        message.content = ".p " + titles[i]
        // message.reply(message.content)
        serverQueue = queuer.queueGet(message.guild.id);

        await commands.play(message, serverQueue, queuer.queueCommands)
      }
      break;
    case "i":
      var titles = await commands.fabian(message, serverQueue, queuer.queueCommands, "30YalNqYddehoSL44yETCo");
      if (titles.length == 0) {
        message.reply("Gibs keine Beweise");
      }
      for (let i = 0; i < titles.length; i++){
        message.content = ".p " + titles[i]
        // message.reply(message.content)
        serverQueue = queuer.queueGet(message.guild.id);

        await commands.play(message, serverQueue, queuer.queueCommands)
      }
      break;
    case "spotify":
      var spotLink = helper.getNthWord(message.content, 2);
      var spotId = helper.getSpotifyPlaylistId(spotLink);
      var count = 1;
      try {
        count = helper.getNthWord(message.content, 3);
      }
      catch (ex) {
        message.reply(ex);
      }

      var titles = await commands.spotify(spotId, count);
      for (let i = 0; i < titles.length; i++){
        message.content = ".p " + titles[i]
        // message.reply(message.content)
        serverQueue = queuer.queueGet(message.guild.id);

        await commands.play(message, serverQueue, queuer.queueCommands)
      }
      break;
    default:
      break;
  }
});

client.login(token);
