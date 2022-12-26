"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
var discord_js_1 = require("discord.js");
var MessageHandler = /** @class */ (function () {
    function MessageHandler() {
    }
    MessageHandler.sendSongToChat = function (serverQueue, song) {
        serverQueue.textChannel.send("Jetzt: **".concat(song.title, "**"));
        serverQueue.textChannel.send(this.getMusicEmbed(song.videoDetails, serverQueue));
        if (Math.random() * 5 < 1) {
            serverQueue.textChannel.send("Den Song mag ich besonders gern!");
        }
    };
    MessageHandler.sendAddedToQueue = function (channel, song) {
        return channel.send("".concat(song.title, " wurde zur Queue hinzugef\u00FCgt!"));
    };
    MessageHandler.getMusicEmbed = function (videoDetails, queue) {
        if (queue === void 0) { queue = []; }
        console.log(videoDetails);
        var author = videoDetails.author.name;
        if (author.endsWith(" - Topic")) {
            author = author.slice(0, author.length - 8);
        }
        var count = queue.songs.length - 1;
        var embed = new discord_js_1.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(videoDetails.title)
            .setURL(videoDetails.video_url)
            .setAuthor(author, videoDetails.author.thumbnails.slice(-1)[0].url, videoDetails.author.user_url)
            .setFooter("Noch " + count + " weitere Lieder in der Queue")
            //.setDescription(videoDetails.description)
            //.setThumbnail(videoDetails.thumbnails.slice(-1)[0].url)
            // .addFields(
            //   { name: 'Regular field title', value: 'Some value here' },
            //   { name: '\u200B', value: '\u200B' },
            //   { name: 'Inline field title', value: 'Some value here', inline: true },
            //   { name: 'Inline field title', value: 'Some value here', inline: true },
            // )
            //.addField('Inline field title', 'Some value here', true)
            .setImage(videoDetails.thumbnails.slice(-1)[0].url);
        //.setTimestamp()
        //.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
        return embed;
    };
    return MessageHandler;
}());
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map