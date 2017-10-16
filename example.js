let PhotoSorter = require("./lib").PhotoSorter;
let VideoSorter = require("./lib").VideoSorter;

const unsortedDir = "c:\\unsorted-photos";
const sortedDir = "c:\\photos";

let photoSorter = new PhotoSorter(unsortedDir, sortedDir);
addListeners(photoSorter);
photoSorter.sort();

let videoSorter = new VideoSorter(unsortedDir, sortedDir);
addListeners(videoSorter);
videoSorter.sort();

function addListeners(sorter) {
    sorter.on("complete", () => {
        console.log("Sort complete");
    });

    sorter.on("error", (error) => {
        console.log("Sort ERROR");
        console.log(error);
    });

    sorter.on("start-file", (file) => {
        console.log(`Start file ${file}`);
    });

    sorter.on("ready-file", (file) => {
        console.log(`Ready file ${file}`);
    });
}