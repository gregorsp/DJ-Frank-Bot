const search = require("./search.js");

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const setServerQueue = (queueSet, queueGet, guildId, message) => {
  const queueContruct = {
    textChannel: message.channel,
    voiceChannel: message.member.voice.channel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
  };

  queueSet(guildId, queueContruct);
  return queueGet(guildId);
};

const songInfoToSongObject = (songInfo) => {
  return {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    videoDetails: songInfo.videoDetails,
  };
}

module.exports = { isValidHttpUrl, setServerQueue, songInfoToSongObject };
