const svnUltimate = require('node-svn-ultimate');
const request = require('request');
const { exec } = require('child_process');

let commitFiles = "svn commit -m ";

async function svnConnection(path,appInfo,projectname,conentType){
    await addSVNFiles(path,conentType);
    let commitedResp = await commitAll(path,appInfo,projectname);
    return commitedResp;
}
    
async function addSVNFiles(path,conentType){
    let url = "svn add " + path + " --depth infinity --force";
    return new Promise((resolve,reject)=>{
        exec(url,(err)=>{
            if (err) {
                console.log("svn Commit failed  ---->  ",err);                
                return
            } else {
                console.log("ALL "+conentType.toUpperCase()+" FILES ARE ADDDED SUCCESSFULLY!!!");
                resolve('added');
            }
        });
    })  
}

async function commitAll(path,appInfo,projectname){
    return new Promise((resolve,reject)=>{
        let x = JSON.stringify("Migrating "+appInfo.process+" interactivities for "+ appInfo.widgetType+" widget for the grade : "+appInfo.grade+" in the project -> "+ projectname);
        //'"Automated Interactivities migration - Image hotspot - testing - DPS Sci Dmns NA G3 - sn_17f9 "'
        exec(commitFiles+x+" "+path,(err)=>{
            if (err) {
                console.log("svn Commit failed  ---->  ",err);                
                return;
            } else {
                console.log("CHANGES ARE COMMITED TO REPOSITORY SUCCESSFULLY!!!");
                resolve('commited');
            }
        });
    })   
}


module.exports.svnConnection = svnConnection;