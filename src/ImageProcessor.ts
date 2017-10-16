import * as fs from "fs";
import * as path from "path";
import * as moment from "moment";
import Moment = moment.Moment;
import { Disk } from "./Disk";

let ExifImage = require("exif").ExifImage;
let sharp = require("sharp");

export class ImageProcessor {
    private static TARGET_WIDTH = 1600;

    constructor(private disk: Disk) {

        // https://github.com/lovell/sharp/issues/487
        // Disable cache to remove source file
        sharp.cache(false);
    }

    public async exec(file) {
        let sourcePath = file;
        let date = await this.findDate(sourcePath);
        let targetDir = this.disk.createTargetDir(date);
        let targetFile = path.basename(sourcePath);
        let targetPath = targetDir + path.sep + targetFile;
        await this.copyAndResize(sourcePath, targetPath);
        fs.unlinkSync(sourcePath);
    }

    private async findDate(file): Promise<Date> {
        return new Promise<Date>((resolve, reject) => {
            new ExifImage({ image: file }, (error, exifData) => {
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

    private async copyAndResize(fromPath, toPath): Promise<any> {
        // return promise
        // http://sharp.dimens.io/en/stable/api-output/#tofile
        console.log(`${fromPath} -> ${toPath}`);
        return sharp(fromPath)
            .resize(ImageProcessor.TARGET_WIDTH)
            .withMetadata()
            .toFile(toPath);
    }
}