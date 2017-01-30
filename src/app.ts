import * as fs from "fs";
import * as path from "path";
import * as moment from "moment";
import {EventEmitter} from "events";
import Moment = moment.Moment;

let ExifImage = require("exif").ExifImage;
let mkdirp = require("mkdirp");
let sharp = require("sharp");
let FileHound = require('filehound');

console.log("start");
const unsortedDir = "c:\\unsorted-photos";
const sortedDir = "c:\\photos";
const TARGET_WIDTH = 1600;
class PhotoSorter extends EventEmitter {
    constructor(private unsortedDir, private sortedDir) {
        super();
    }

    public f(){

    }
}
module.exports.PhotoSorter = PhotoSorter;

const files = FileHound.create()
    .paths(unsortedDir)
    .match("*.+(JPG|jpeg|jpg)")
    .findSync();

console.log(files);

for (let file of files) {
    console.log("EXEC " + file);
    execFile(file).then(() => {
        console.log("READY " + file);
    }).catch((error) => {
        console.log("CATCH ERROR");
        console.log(error);
    });
}

async function execFile(file) {
    try {
        let sourcePath = file;
        let date = await findDate(sourcePath);
        let targetDir = createTargetDir(sortedDir, date);
        let targetFile = path.basename(sourcePath);
        let targetPath = targetDir + path.sep + targetFile;
        await copyAndResize(sourcePath, targetPath);
        fs.unlinkSync(sourcePath);
    } catch (error) {
        console.log(error);
    }
}

function createTargetDir(sortedDir: string, date: Date): string {
    let subDir = getSubdir(date);
    let targetDir = sortedDir + path.sep + subDir;
    mkdirp.sync(targetDir);
    return targetDir;
}

async function findDate(file): Promise<Date> {
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

function getSubdir(date: Date): string {
    let year = date.getFullYear();
    return year + path.sep + moment(date).format("YYYY_MM_DD");
}

async function copyAndResize(fromPath, toPath): Promise<any> {

    // return promise
    // http://sharp.dimens.io/en/stable/api-output/#tofile
    return sharp(fromPath)
        .resize(TARGET_WIDTH)
        .withMetadata()
        .toFile(toPath);
}