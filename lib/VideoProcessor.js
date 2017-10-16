"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const moment = require("moment");
let exif = require("exiftool");
class VideoProcessor {
    constructor(disk) {
        this.disk = disk;
    }
    exec(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let sourcePath = file;
            let metadata = yield this.getMetadata(file);
            let date = yield this.getCreationDate(metadata);
            let targetDir = this.disk.createTargetDir(date);
            let targetFile = path.basename(sourcePath);
            let targetPath = targetDir + path.sep + targetFile;
            console.log(`${sourcePath} -> ${targetPath}`);
            fs.copyFileSync(sourcePath, targetPath);
            fs.unlinkSync(sourcePath);
        });
    }
    getMetadata(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs.readFile(file, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        exif.metadata(data, function (err, metadata) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(metadata);
                            }
                        });
                    }
                });
            });
        });
    }
    getCreationDate(meta) {
        let dateString;
        if (meta.fileType == "JPEG") {
            dateString = meta["date/timeOriginal"];
        }
        else if (meta.fileType == "MOV") {
            dateString = meta.trackCreateDate;
        }
        else {
            throw new Error("Unknown fileType");
        }
        let m = moment(dateString, "YYYY:MM:DD h:m:s");
        return m.toDate();
    }
}
exports.VideoProcessor = VideoProcessor;
