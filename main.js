const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: '9' }).setToken('ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE');

const ytdl = require('ytdl-core');

//https://github.com/MonsterMannen/DiscordBotNodeJs/blob/master/commands/play.js
var ap = require('./audioprovider.js');

const commands = [{
  name: 'ping',
  description: 'Replies with Pong!'
},
{
  name:'play',
  description: 'Play the specified Song',
  options: [
    {
     type: 3,
     name: 'song',
     description: 'The Song',
     required: true
  }]
}]; 

client.login('ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE'); //token

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  //if (!interaction.isCommand()) return;
  const clone = Object.assign({}, interaction);
  switch (clone.commandName) {
    case 'play':
      let songName = clone.options.data[0].value;
      console.log(songName);
      await interaction.reply('du wünscht dir: ' + songName);
      
      break;
    case 'ping':
      await interaction.reply("no u");  
      break;
  }
    
  console.log(clone);
});
/*
client.on("messageCreate", async (msg) => {
  console.log(msg);
  if(!m.startsWith(".")) return;
  var args = m.substring(1).split(" ");
  var cmdName = args[0].toLowerCase();
  var cmdOptions = args.slice(1);
  var cmdOption  = cmdOptions.join(" ");
  console.log(cmdOption);
  switch (cmdName) {
    case 'play':
      await ap.queueSong(msg, cmdOption);

      break;
  }
  msg.reply(cmdOption);
});/**/ 

//register commands
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    /*await rest.put(
      Routes.applicationGuildCommands(888812858794725387, 569927638337192016), //CLIENT_ID, GUILD_ID
      { body: commands },
    );/**/ 

    await rest.put(
      Routes.applicationCommands('888812858794725387'),
      { body: commands}
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();  

