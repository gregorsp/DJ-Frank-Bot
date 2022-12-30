"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = void 0;
var Song = /** @class */ (function () {
    function Song(title, url, videoDetails) {
        if (title === void 0) { title = null; }
        if (url === void 0) { url = null; }
        if (videoDetails === void 0) { videoDetails = null; }
        this.title = title;
        this.url = url;
        this.videoDetails = videoDetails;
    }
    return Song;
}());
exports.Song = Song;
//# sourceMappingURL=interfaces.js.map