export class Song {
    title: string;
    url: string;
    videoDetails: any;
    constructor(title: string = null, url: string = null, videoDetails: any = null) {
        this.title = title;
        this.url = url;
        this.videoDetails = videoDetails;
    }
}