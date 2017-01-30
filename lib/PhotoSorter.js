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
class PhotoSorter extends events_1.EventEmitter {
    constructor(unsortedDir = "", sortedDir = "", targetWidth = 1600) {
        super();
        this.unsortedDir = unsortedDir;
        this.sortedDir = sortedDir;
        this.targetWidth = targetWidth;
        // https://github.com/lovell/sharp/issues/487
        // Disable cache to remove source file
        sharp.cache(false);
    }
    sort() {
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
    execAllFiles(files) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            for (let file of files) {
                _super("emit").call(this, "start-file", file);
                yield this.execFile(file);
                _super("emit").call(this, "ready-file", file);
            }
        });
    }
    execFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let sourcePath = file;
            let date = yield this.findDate(sourcePath);
            let targetDir = this.createTargetDir(this.sortedDir, date);
            let targetFile = path.basename(sourcePath);
            let targetPath = targetDir + path.sep + targetFile;
            yield this.copyAndResize(sourcePath, targetPath);
            fs.unlinkSync(sourcePath);
        });
    }
    createTargetDir(sortedDir, date) {
        let subDir = this.getSubdir(date);
        let targetDir = sortedDir + path.sep + subDir;
        mkdirp.sync(targetDir);
        return targetDir;
    }
    findDate(file) {
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
    getSubdir(date) {
        let year = date.getFullYear();
        return year + path.sep + moment(date).format("YYYY_MM_DD");
    }
    copyAndResize(fromPath, toPath) {
        return __awaiter(this, void 0, void 0, function* () {
            // return promise
            // http://sharp.dimens.io/en/stable/api-output/#tofile
            return sharp(fromPath)
                .resize(this.targetWidth)
                .withMetadata()
                .toFile(toPath);
        });
    }
    delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms);
            });
        });
    }
}
exports.PhotoSorter = PhotoSorter;
