const svnUltimate = require('node-svn-ultimate');
const fse = require('fs-extra');
const request = require('request');
let checkoutDirPath = '../habitatProject/';
let checkoutDir = '../habitatProject/';
var mkdirp = require('mkdirp');


async function createDir(checkoutDir){
    return new Promise((resolve,reject)=>{
        if (!fse.existsSync(checkoutDir)){
            fse.mkdirSync(checkoutDir);
            resolve();
        } else{
                fse.emptyDir(checkoutDir, err => {
                if (err) {
                    reject(err,"  Folder creation is failed");		  
                }
                resolve("Folder created");
            });
        }
    })
}

//createDir(checkoutDirPath);
module.exports.createDir = createDir;

connect = async(options)=>{
	return new Promise((resolve,reject) => {
		request(options, function (err, res, body) {
			if (err) {
				console.log("svn connection failed  ---->  ",err);
				reject(err);
			}
			else {
				resolve("USER AUTHENTICATED SUCCESSFULLY!!!");
			}
		});
	})
} 

module.exports.svnConnect = connect;

/* Checkout directory */
doCheckout = async(options,localDir,path,type,isCustompath=false,localPath=null) =>{
	await new Promise((resolve,reject) => {
		svnUltimate.commands.checkout( options.url+path, (isCustompath ? localDir+localPath : localDir+path), function( err ) {
			if (err) {
				console.log("svn Checkout failed  ---->  ",err);
				reject(err);
			} else {
                console.log(type.toUpperCase(),"    HAS BEEN CHECKED OUT SUCCESSFULLY!!!!");
				resolve(type.toUpperCase(),"    HAS BEEN CHECKED OUT SUCCESSFULLY!!!!");
			}			
		});
    });	
    return await new Promise((resolve,reject)=>{
        if(type == 'html'){
            fse.readdir(checkoutDir+path, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        } else {
            resolve(type);
        }
    })    
}

module.exports.checkout = doCheckout;


/* Only Checkout directory */
only_doCheckout = async(options,localDir,path,type,isCustompath=false,localPath=null) =>{
	await new Promise((resolve,reject) => {
		svnUltimate.commands.checkout( options.url+path, (isCustompath ? localDir+localPath : localDir+path), function( err ) {
			if (err) {
				console.log("svn Checkout failed  ---->  ",err);
				reject(err);
			} else {
                console.log(type.toUpperCase(),"    HAS BEEN CHECKED OUT SUCCESSFULLY!!!!");
				resolve(type.toUpperCase(),"    HAS BEEN CHECKED OUT SUCCESSFULLY!!!!");
			}			
		});
    });   
}

module.exports.only_checkout = only_doCheckout;