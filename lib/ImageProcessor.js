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
let ExifImage = require("exif").ExifImage;
let sharp = require("sharp");
class ImageProcessor {
    constructor(disk) {
        this.disk = disk;
        // https://github.com/lovell/sharp/issues/487
        // Disable cache to remove source file
        sharp.cache(false);
    }
    exec(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let sourcePath = file;
            let date = yield this.findDate(sourcePath);
            let targetDir = this.disk.createTargetDir(date);
            let targetFile = path.basename(sourcePath);
            let targetPath = targetDir + path.sep + targetFile;
            yield this.copyAndResize(sourcePath, targetPath);
            fs.unlinkSync(sourcePath);
        });
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
    copyAndResize(fromPath, toPath) {
        return __awaiter(this, void 0, void 0, function* () {
            // return promise
            // http://sharp.dimens.io/en/stable/api-output/#tofile
            console.log(`${fromPath} -> ${toPath}`);
            return sharp(fromPath)
                .resize(ImageProcessor.TARGET_WIDTH)
                .withMetadata()
                .toFile(toPath);
        });
    }
}
ImageProcessor.TARGET_WIDTH = 1600;
exports.ImageProcessor = ImageProcessor;
