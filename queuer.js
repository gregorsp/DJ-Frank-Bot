const search = require("./search.js");
const sender = require("./sender.js");
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
  arg = "https://www.youtube.com/watch?v=" + id;

  const songInfo = await search.getSongInfo(arg);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    videoDetails: songInfo.videoDetails,
  };

  serverQueue.songs.push(song);
  return sender.sendAddedToQueue(message.channel, song);
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
