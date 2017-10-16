#Photo Sorter
Берет рекурсивно файлы с фотографиями из исходного каталога.
Изменяет размер. Создает в целевом каталоге подкаталоги по значению даты снимка вида
`2017/2017_01_31`
Сохраняет новый файл в целевой каталог.
#Sample
```js
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
```

Download exiftool
http://owl.phy.queensu.ca/~phil/exiftool/