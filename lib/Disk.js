"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const moment = require("moment");
const mkdirp = require("mkdirp");
let FileHound = require("filehound");
class Disk {
    constructor(unsortedDir = "", sortedDir = "") {
        this.unsortedDir = unsortedDir;
        this.sortedDir = sortedDir;
    }
    getImages() {
        const files = FileHound.create()
            .paths(this.unsortedDir)
            .match("*.+(JPG|jpeg|jpg)")
            .findSync();
        return files;
    }
    getVideos() {
        const files = FileHound.create()
            .paths(this.unsortedDir)
            .match("*.+(MOV)")
            .findSync();
        return files;
    }
    createTargetDir(date) {
        let subDir = this.getSubdir(date);
        let targetDir = this.sortedDir + path.sep + subDir;
        mkdirp.sync(targetDir);
        return targetDir;
    }
    getSubdir(date) {
        let year = date.getFullYear();
        return year + path.sep + moment(date).format("YYYY_MM_DD");
    }
}
exports.Disk = Disk;
