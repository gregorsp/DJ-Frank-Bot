const { Client, Intents } = require("discord.js");
const util = require("util");
const fs = require("fs");

const token = "ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE";
const prefix = ".";

const commands = require("./commands.js");
const queuer = require("./queuer.js");

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
  //console.log(message);
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  var serverQueue = queuer.queueGet(message.guild.id);

  if (
    message.content.startsWith(`${prefix}play `) |
    message.content.startsWith(`${prefix}p `)
  ) {
    commands.execute(
      message,
      serverQueue,
      queuer.queueGet,
      queuer.queueSet,
      queuer.queueDelete
    );
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    commands.skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    commands.stop(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}say`)) {
    commands.say(message);
    return;
  } else if (message.content.startsWith(`${prefix}playlist`)) {
    commands.playlist(message, serverQueue, queuer.queueSet, queuer.queueGet, queuer.queueAdd, queuer.queueDelete);
    return;
  }
  // else {
  //     message.channel.send("You need to enter a valid command!");
  // }
}); /** */

client.login(token);
