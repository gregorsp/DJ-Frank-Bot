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
      commands.play(message, serverQueue, queuer.queueCommands);
      break;
    case "playlist":
      commands.playlist(message, serverQueue, queuer.queueCommands);
      break;
    case "s":
    case "skip":
      commands.skip(message, serverQueue);
      break;
    case "stop":
    case "leave":
    case "disconnect":
      commands.stop(message, serverQueue);
      break;
    case "say":
      commands.say(message);
      break;
    case "random":
      var titles = await commands.spotify("30YalNqYddehoSL44yETCo", helper.getNthWord(message.content, 2));
      for (let i = 0; i < titles.length; i++){
        message.content = ".p " + titles[i]
        // message.reply(message.content)
        serverQueue = queuer.queueGet(message.guild.id);

        await commands.play(message, serverQueue, queuer.queueCommands)
      }
      break;
    case "spotify":
      var titles = await commands.spotify(message);
      
      break;
    default:
      break;
  }
});

client.login(token);
