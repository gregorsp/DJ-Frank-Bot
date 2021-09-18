const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: '9' }).setToken('ODg4ODEyODU4Nzk0NzI1Mzg3.YUYJeg.Ob5X9LtzF0Nb7acgyM3UVm_2WgE');

var ap = require('audioprovider.js');

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
      
      break;
    case 'ping':
      await interaction.reply("no u");  
      break;
  }
    
  console.log(clone);
});

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

