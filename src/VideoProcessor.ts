import * as fs from "fs";
import * as path from "path";
import * as moment from "moment";
import { MetadataVO } from "./MetadataVO";
import { Disk } from "./Disk";
import Moment = moment.Moment;
let exif = require("exiftool");

export class VideoProcessor {
    constructor(private disk: Disk) {

    }

    public async exec(file) {
        let sourcePath = file;
        let metadata: MetadataVO = await this.getMetadata(file);
        let date: Date = await this.getCreationDate(metadata);
        let targetDir = this.disk.createTargetDir(date);
        let targetFile = path.basename(sourcePath);
        let targetPath = targetDir + path.sep + targetFile;
        console.log(`${sourcePath} -> ${targetPath}`);
        fs.copyFileSync(sourcePath, targetPath);
        fs.unlinkSync(sourcePath);
    }

    private async getMetadata(file): Promise<MetadataVO> {
        return new Promise<MetadataVO>((resolve, reject) => {
            fs.readFile(file, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    exif.metadata(data, function (err, metadata) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(metadata);
                        }
                    });
                }
            });
        });
    }

    private getCreationDate(meta: MetadataVO): Date {
        let dateString;
        if (meta.fileType == "JPEG") {
            dateString = meta["date/timeOriginal"];
        } else if (meta.fileType == "MOV") {
            dateString = meta.trackCreateDate;
        } else {
            throw new Error("Unknown fileType");
        }

        let m: Moment = moment(dateString, "YYYY:MM:DD h:m:s");
        return m.toDate();
    }
}