import * as moment from "moment";
import { EventEmitter } from "events";
import { Disk } from "./Disk";
import { ImageProcessor } from "./ImageProcessor";
import Moment = moment.Moment;

export class PhotoSorter extends EventEmitter {
    private disk: Disk;
    private imageProcessor: ImageProcessor;

    constructor(private unsortedDir = "", private sortedDir = "", private targetWidth = 1600) {
        super();
        this.disk = new Disk(unsortedDir, sortedDir);
        this.imageProcessor = new ImageProcessor(this.disk);
    }

    public sort() {
        const files = this.disk.getImages();

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
            await this.imageProcessor.exec(file);
            super.emit("ready-file", file);
        }
    }
}
