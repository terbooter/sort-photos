let PhotoSorter = require("./lib").PhotoSorter;

const unsortedDir = "c:\\unsorted-photos";
const sortedDir = "c:\\photos";

let sorter = new PhotoSorter(unsortedDir, sortedDir);
sorter.sort();

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
