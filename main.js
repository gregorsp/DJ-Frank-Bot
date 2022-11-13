const { Client, Intents } = require("discord.js");
const fs = require("fs");

const token = fs.readFileSync("./discordtoken", "utf8"); //"ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE";
const prefix = ".";

const commands = require("./commands.js");
const queuer = require("./queuer.js");
const helper = require("./helper.js");

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
