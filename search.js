const helper = require("./helper")

const ytdl = require("ytdl-core");
const YTF = require("youtube-finder");
const ytMusic = require("node-youtube-music");
const youtubesearchapi = require("youtube-search-api");
const ytclient = YTF.createClient({
    key: "AIzaSyC-sh8qoiYS1hIw2eauhjJmAF_1L_AKZ7k",
  });

const getInfo = async (arg) => {
  arg += " lyrics -live -karaoke";
  if (isValidHttpUrl(arg)) {
    return await ytdl.getInfo(arg);
    //TODO: handle youtube searcher
  } else {
    const search = (arg) => {
      return new Promise((resolve, reject) => {
        ytclient.search(arg, (err, data) => {
          if (err) {
            return reject(err);
          }

          resolve(data);
        });
      });
    };
    var params = {
      part: "id",
      q: arg,
      maxResults: 1,
      type: "video",
    };
    const searchresult = await search(params);
    console.log("Ergebnis:");
    console.log(searchresult);
    const url =
      "https://www.youtube.com/watch?v=" + searchresult.items[0].id.videoId;

    return await ytdl.getInfo(url);
  }
};

const getInfo2 = async (arg) => {
  //arg += ' lyrics -live -karaoke';
  if (isValidHttpUrl(arg)) {
    return await ytdl.getInfo(arg);
    //TODO: handle youtube searcher
  } else {
    let liste = await youtubesearchapi.GetListByKeyword(arg, true);
    const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;

    return await ytdl.getInfo(url);
  }
};

const getInfo3 = async (arg) => {
  //arg += ' lyrics -live -karaoke';
  if (helper.isValidHttpUrl(arg)) {
    return await ytdl.getInfo(arg);
    //TODO: handle youtube searcher
  } else {
    let liste = await ytMusic.searchMusics(arg);
    const url = "https://www.youtube.com/watch?v=" + liste[0].youtubeId;

    return await ytdl.getInfo(url);
  }
};

const getPlaylistInfo = async (arg) => {
    if (helper.isValidHttpUrl(arg)) {
      let liste = await (await youtubesearchapi.GetPlaylistData(arg.split("=")[1])).items
      //const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;
      console.log(liste);
      return await liste;//ytdl.getInfo(url);
    }
  }

module.exports = { getInfo3, getPlaylistInfo };
