"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const events_1 = require("events");
let ExifImage = require("exif").ExifImage;
let mkdirp = require("mkdirp");
let sharp = require("sharp");
let FileHound = require('filehound');
console.log("start");
const unsortedDir = "c:\\unsorted-photos";
const sortedDir = "c:\\photos";
const TARGET_WIDTH = 1600;
class PhotoSorter extends events_1.EventEmitter {
    constructor(unsortedDir, sortedDir) {
        super();
        this.unsortedDir = unsortedDir;
        this.sortedDir = sortedDir;
    }
    f() {
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
function execFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sourcePath = file;
            let date = yield findDate(sourcePath);
            let targetDir = createTargetDir(sortedDir, date);
            let targetFile = path.basename(sourcePath);
            let targetPath = targetDir + path.sep + targetFile;
            yield copyAndResize(sourcePath, targetPath);
            fs.unlinkSync(sourcePath);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function createTargetDir(sortedDir, date) {
    let subDir = getSubdir(date);
    let targetDir = sortedDir + path.sep + subDir;
    mkdirp.sync(targetDir);
    return targetDir;
}
function findDate(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            new ExifImage({ image: file }, (error, exifData) => {
                if (error) {
                    reject(error);
                }
                else {
                    let dateStr = exifData.exif.DateTimeOriginal;
                    let m = moment(dateStr, "YYYY:MM:DD h:m:s");
                    resolve(m.toDate());
                }
            });
        });
    });
}
function getSubdir(date) {
    let year = date.getFullYear();
    return year + path.sep + moment(date).format("YYYY_MM_DD");
}
function copyAndResize(fromPath, toPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // return promise
        // http://sharp.dimens.io/en/stable/api-output/#tofile
        return sharp(fromPath)
            .resize(TARGET_WIDTH)
            .withMetadata()
            .toFile(toPath);
    });
}
