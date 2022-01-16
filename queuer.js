const search = require("./search.js")

const queue = new Map();

const queueGet = (guildId) => {
  return queue.get(guildId);
}

const queueSet = (guildId, queueContruct) => {
  return queue.set(guildId, queueContruct);
}

const queueDelete = (guildId) => {
  return queue.delete(guildId);
}

const queueCommands = {queueGet, queueGet,queueDelete}

async function queueAdd(id, serverQueue, message) {
    arg = "https://www.youtube.com/watch?v=" + id;
  
    const songInfo = await search.getInfo3(arg);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      videoDetails: songInfo.videoDetails,
    };
  
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} wurde zur Queue hinzugefügt!`);
  }


module.exports = {queue, queueSet, queueGet, queueDelete, queueAdd}