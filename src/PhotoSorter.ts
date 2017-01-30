import * as fs from "fs";
import * as path from "path";
import * as moment from "moment";
import {EventEmitter} from "events";
import Moment = moment.Moment;

let ExifImage = require("exif").ExifImage;
let mkdirp = require("mkdirp");
let sharp = require("sharp");
let FileHound = require('filehound');

export class PhotoSorter extends EventEmitter {
    constructor(private unsortedDir = "", private sortedDir = "", private targetWidth = 1600) {
        super();

        // https://github.com/lovell/sharp/issues/487
        // Disable cache to remove source file
        sharp.cache(false);
    }

    public sort() {
        const files = FileHound.create()
            .paths(this.unsortedDir)
            .match("*.+(JPG|jpeg|jpg)")
            .findSync();

        this.execAllFiles(files).then(() => {
            super.emit("complete");
        }).catch((error) => {
            super.emit("error", error);
        });
    }

    private async execAllFiles(files: string[]): Promise<void> {
        for (let file of files) {
            super.emit("start-file", file);
            await this.execFile(file);
            super.emit("ready-file", file);

        }
    }

    private async execFile(file) {
        let sourcePath = file;
        let date = await this.findDate(sourcePath);
        let targetDir = this.createTargetDir(this.sortedDir, date);
        let targetFile = path.basename(sourcePath);
        let targetPath = targetDir + path.sep + targetFile;
        await this.copyAndResize(sourcePath, targetPath);
        fs.unlinkSync(sourcePath);
    }

    private createTargetDir(sortedDir: string, date: Date): string {
        let subDir = this.getSubdir(date);
        let targetDir = sortedDir + path.sep + subDir;
        mkdirp.sync(targetDir);
        return targetDir;
    }

    private async findDate(file): Promise<Date> {
        return new Promise<Date>((resolve, reject) => {
            new ExifImage({image: file}, (error, exifData) => {
                if (error) {
                    reject(error);
                } else {
                    let dateStr = exifData.exif.DateTimeOriginal;
                    let m: Moment = moment(dateStr, "YYYY:MM:DD h:m:s");
                    resolve(m.toDate());
                }
            });
        });
    }

    private getSubdir(date: Date): string {
        let year = date.getFullYear();
        return year + path.sep + moment(date).format("YYYY_MM_DD");
    }

    private async copyAndResize(fromPath, toPath): Promise<any> {
        // return promise
        // http://sharp.dimens.io/en/stable/api-output/#tofile
        return sharp(fromPath)
            .resize(this.targetWidth)
            .withMetadata()
            .toFile(toPath);
    }

    private async delay(ms: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            setTimeout(resolve, ms);
        })
    }
}
