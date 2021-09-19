const Discord = require('discord.js');
const token =  'AIzaSyC86aNGNpvAjj-o5Cv9iiDkplENL4BeS9Q';
const ytdl = require('ytdl-core');

const queue = new Map();

const play = exports.play = async (guild, songname) => {
    const songinfo = await ytdl.getInfo(songname);
    const song = {
        title: songinfo.videoDetails.title,
        url: songinfo.videoDetails.video_url
    };


    return song;
}