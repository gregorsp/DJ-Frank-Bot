function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const setServerQueue = (queueCommands, message) => {
  const queueContruct = {
    textChannel: message.channel,
    voiceChannel: message.member.voice.channel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
  };

  queueCommands.queueSet(message.guild.id, queueContruct);
  return queueCommands.queueGet(message.guild.id);
};

const songInfoToSongObject = (songInfo) => {
  return {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    videoDetails: songInfo.videoDetails,
  };
};

const getNthWord = (text, n) => {
  return text.split(" ")[n-1]
}

module.exports = { isValidHttpUrl, setServerQueue, songInfoToSongObject, getNthWord };
