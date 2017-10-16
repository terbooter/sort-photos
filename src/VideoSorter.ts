import * as moment from "moment";
import { EventEmitter } from "events";
import { Disk } from "./Disk";
import { VideoProcessor } from "./VideoProcessor";
import Moment = moment.Moment;

let mkdirp = require("mkdirp");

export class VideoSorter extends EventEmitter {
    private disk: Disk;
    private videoProcessor: VideoProcessor;

    constructor(private unsortedDir = "", private sortedDir = "", private targetWidth = 1600) {
        super();
        this.disk = new Disk(unsortedDir, sortedDir);
        this.videoProcessor = new VideoProcessor(this.disk);
    }

    public sort() {
        const files = this.disk.getVideos();

        this.execAllFiles(files)
            .then(() => {
                super.emit("complete");
            })
            .catch((error) => {
                super.emit("error", error);
            });
    }

    private async execAllFiles(files: string[]): Promise<void> {
        for (let file of files) {
            super.emit("start-file", file);
            await this.videoProcessor.exec(file);
            super.emit("ready-file", file);
        }
    }
}
