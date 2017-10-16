import * as path from "path";
import * as moment from "moment";
import * as mkdirp from "mkdirp";
import Moment = moment.Moment;

let FileHound = require("filehound");

export class Disk {
    constructor(private unsortedDir = "", private sortedDir = "") {

    }

    public getImages(): string[] {
        const files = FileHound.create()
            .paths(this.unsortedDir)
            .match("*.+(JPG|jpeg|jpg)")
            .findSync();

        return files;
    }

    public getVideos(): string[] {
        const files = FileHound.create()
            .paths(this.unsortedDir)
            .match("*.+(MOV)")
            .findSync();

        return files;
    }

    public createTargetDir(date: Date): string {
        let subDir = this.getSubdir(date);
        let targetDir = this.sortedDir + path.sep + subDir;
        mkdirp.sync(targetDir);
        return targetDir;
    }

    private getSubdir(date: Date): string {
        let year = date.getFullYear();
        return year + path.sep + moment(date).format("YYYY_MM_DD");
    }
}