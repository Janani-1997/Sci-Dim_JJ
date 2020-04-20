const fs = require('fs-extra');

writeJSON = async(path,data) => {
    return new Promise((resolve,reject)=>{
        fs.writeFile(path, data , 'utf-8',function (err) {
            //let jsonObj = json;
            if (err) {
                console.log("Json update failed   ",err);
                messageLogs.push("Json update failed   ",err);
                throw err;
            } else {
                resolve("JSON has been modifed successfully!!!");
            }
        });
    })
}


module.exports.write = writeJSON;

