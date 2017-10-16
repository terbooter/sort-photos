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
const events_1 = require("events");
const Disk_1 = require("./Disk");
const ImageProcessor_1 = require("./ImageProcessor");
class PhotoSorter extends events_1.EventEmitter {
    constructor(unsortedDir = "", sortedDir = "", targetWidth = 1600) {
        super();
        this.unsortedDir = unsortedDir;
        this.sortedDir = sortedDir;
        this.targetWidth = targetWidth;
        this.disk = new Disk_1.Disk(unsortedDir, sortedDir);
        this.imageProcessor = new ImageProcessor_1.ImageProcessor(this.disk);
    }
    sort() {
        const files = this.disk.getImages();
        this.execAllFiles(files)
            .then(() => {
            super.emit("complete");
        })
            .catch((error) => {
            super.emit("error", error);
        });
    }
    execAllFiles(files) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            for (let file of files) {
                _super("emit").call(this, "start-file", file);
                yield this.imageProcessor.exec(file);
                _super("emit").call(this, "ready-file", file);
            }
        });
    }
}
exports.PhotoSorter = PhotoSorter;
