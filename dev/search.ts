

const getSongInfo = async (arg) => {
  //arg += ' lyrics -live -karaoke';
  if (helper.isValidHttpUrl(arg)) {
    return await ytdl.getInfo(arg);
    //TODO: handle youtube searcher
  } else {
    let liste = await ytMusic.searchMusics(arg);
    if (liste.length == 0) {
      return await ytdl.getInfo("https://www.youtube.com/watch?v=lYBUbBu4W08");
    }
    let url = "https://www.youtube.com/watch?v=" + liste[0].youtubeId;
    return await ytdl.getInfo(url);
  }
};

const getPlaylistInfo = async (arg) => {
  if (helper.isValidHttpUrl(arg)) {
    let liste = await (
      await youtubesearchapi.GetPlaylistData(arg.split("=")[1])
    ).items;
    //const url = "https://www.youtube.com/watch?v=" + liste.items[0].id;
    console.log(liste);
    return await liste; //ytdl.getInfo(url);
  }
};

module.exports = { getSongInfo, getPlaylistInfo };
