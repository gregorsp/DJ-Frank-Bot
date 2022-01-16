const ytdl = require("ytdl-core");
const sender = require("./sender.js");

async function tryPlay (voiceChannel, serverQueue, message, queueGet, queueDelete) {
  errCounter = 0;
  try {
    while (errCounter < 3) {
      try {
        var connection = await voiceChannel.join();
        serverQueue.connection = connection;
        play(message.guild, serverQueue.songs[0], queueGet, queueDelete);
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
    queueDelete(message.guild.id);
    return message.channel.send(err);
  }
};

function play(guild, song, queueGet, queueDelete) {
  const serverQueue = queueGet(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queueDelete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25 }))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0], queueGet, queueDelete);
    })
    .on("error", (error) => {
      console.error(error);
      serverQueue.textChannel.send("Fehler beim abspielen:\n" + error);
      // serverQueue.songs.shift();
      play(guild, serverQueue.songs[0], queueGet, queueDelete);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  sender.sendSongToChat(serverQueue, song);
}

module.exports = { tryPlay };
