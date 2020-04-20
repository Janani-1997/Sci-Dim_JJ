/* var fs = require('fs');
 
fs.renameSync('sample.txt', 'sample_old_new.txt');
console.log('File Renamed.'); */


const fs = require("fs")

// Read directory
fs.readdir("../renameMe/", (err, files) => {
  // Cicle files on current folder
  console.log(files);
  for (const file of files) {
    // Test regular expression
    if (/sam_c_vv/g.test(file)) {
      // Add more logic to rename file
      fs.rename(file, '../newFile.txt', (err) => {
        console.log('Renaming', file, "to", "newFile.txt")
        if (err) throw err
      })
    }
  }
})