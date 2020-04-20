const fse = require('fs-extra');
let checkoutDir = '../habitatProject/';
let path = "s9ml/cards/";
justFiles = async() =>{
    return await new Promise((resolve,reject)=>{
            fse.readdir(checkoutDir+path, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
    })
}

module.exports.getFiles = justFiles;