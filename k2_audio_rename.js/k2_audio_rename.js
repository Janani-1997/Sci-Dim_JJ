var fs = require('fs');
var final_split, keyname_split1, keyname_split2;
var mp3_file;

var data_uuid = "1ffc4a244fdd4db19bdc76a7a6af61e3";
var testFolder = '/Users/lw-dlf/Downloads/hmh_sdk2_813816_u1/OPS/assets/captions/audio/';
var Grade_band = "k-2"


renameFilesk2 = async(dataid,dirPath) =>{
    return new Promise(function(resolve, reject) {
        data_uuid = dataid ? dataid.split('.json')[0] : null;
        testFolder = dirPath;
        console.log(data_uuid,"  k2 audio  ",testFolder);
        fs.readdir(testFolder, (err, files) => {
            //debugger
            files.forEach(file => {
                if (file.search(data_uuid) > -1) {
                    console.log(file);
                    mp3_file = file;

                    keyname_split1 = mp3_file.split(".");
                    keyname_split2 = keyname_split1[0].split("-");
                    //debugger;
                    if (Grade_band = "k-2") {
                        if (keyname_split2.length > 2) {

                            final_split = "-" + keyname_split2[1] + "-" + keyname_split2[2];
                        } else {
                            final_split = "-" + keyname_split2[1];
                        }
                        if (data_uuid == keyname_split2[0]) {
                            switch (final_split) {
                                case '-final-wrong':

                                    fs.copyFile( testFolder + mp3_file ,  testFolder + keyname_split2[0] + "-" + "final-incorrect" + ".mp3", (err) => {
                                        if (err) throw err;
                                    });
                                    break;

                                case '-wrong':
                                debugger;

                                    fs.copyFile( testFolder + mp3_file, testFolder + keyname_split2[0] + "-" + "partially-correct" + ".mp3", (err) => {
                                        if (err) throw err;
                                    });
                                    fs.copyFile( testFolder + mp3_file, testFolder + keyname_split2[0] + "-" + "incorrect" + ".mp3", (err) => {
                                        if (err) throw err;
                                    });
                                    break;

                                default:
                                    console.log('Empty action received.');
                                    break;
                            }
                        } else {
                            console.log("done")
                        }

                        resolve("Stuff worked!");

                    } else {
                        reject(Error("It broke"));
                    }
                }
            });
        });

    });
}

module.exports.renameFilesk2 = renameFilesk2;
/*promise.then(function(result) {
    console.log(result); // "Stuff worked!"
}, function(err) {
    console.log(err); // Error: "It broke"
});*/
