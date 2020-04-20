const fs = require('fs-extra');
const svnConnection = require('./svnEstablish.js');
const svnJOB = require('./svnCommmit.js');
//const audioProcess = require('./audioProcess.js');
const copydir = require('copy-dir');
const path = require('path');
let compass = require('compass');
let execFile = require('child_process').exec;
const findRemoveSync = require('find-remove');

let checkoutDirPath = '../project/repo/';
let options = {};
let folderPath = 's9ml/.templates/';
let sassPath = 'assets/sass/';
let cssPath = 'assets/css';
let destinationDir = "assets/widget_data/config/";
let fileType = "json";
let sassRefpath = '';
let cssRefpath = '';

let configRefpath = "../sass_ref/config/";

compassCompile = async(path) => {
  console.log('compiling sass file...');
  return new Promise((resolve, reject) => {
      execFile("compass compile " + path, function (err, success) {
          if (err) {
              console.log('Error: ' + err);
              resolve(false);
          } else {
              resolve(true)
          }
      })
  });
}

initialCall = async(appManifesto) =>{
  options = {
	  url: appManifesto.endPoint,
	  auth: {
		user: appManifesto.username,
		password: appManifesto.password
	  }
	}
  const createDir = await svnConnection.createDir(checkoutDirPath);
  console.log(createDir,"  createDir");
  const svnConnect = await svnConnection.svnConnect(options);
  console.log(svnConnect,"  connection");
  const fetchFiles = await svnConnection.checkout(options,checkoutDirPath,folderPath,'json');
  console.log(fetchFiles,"  fetchFiles");
  const jsonPath = checkoutDirPath+folderPath+'habitat-configuration.json';
  const readJsondata = await readJSON(jsonPath);
  //console.log(readJsondata,"  read json file data");
  const mergeJSON = await merge(readJsondata,jsonPath);
  console.log("merge json is   ",mergeJSON);
  const writeJsondata = await writeJSON(jsonPath,mergeJSON);
  console.log("writeJsondata  ",writeJsondata);
  /* const files = await moveFiles(src,dest,jsonFile,extension);
  console.log("files status is  ",files); */


  /* Get sass files through svn */
  const fetchSass = await svnConnection.checkout(options,checkoutDirPath,sassPath,'sass');
  console.log(fetchSass,"  fetchSass");
  
  /* copy config.rb file for compass compile */
  const configsrcPath = configRefpath;
  const configdestPath = checkoutDirPath;
  
  /* copy directory */
  fs.copy(configsrcPath, configdestPath, err =>{
    if(err) return console.error(err);
    console.log('config rb file are copied successfully!');
  });

  /* Get css files through svn */
  const fetchcss = await svnConnection.checkout(options,checkoutDirPath,cssPath,'css');
  console.log(fetchcss,"  fetchcss");
    
  cssRefpath = "../sass_ref/"+(appManifesto.gradeLevel == 'kindergarten' ? 'grade_kindergarten': 'grades3-12')+"/"+appManifesto.sassDirectory+"/css/";
  sassRefpath = "../sass_ref/"+(appManifesto.gradeLevel == 'kindergarten' ? 'grade_kindergarten': 'grades3-12')+"/"+appManifesto.sassDirectory+"/sass/";
  console.log(cssRefpath,"   ",sassRefpath);
  //return;
  /* Remove svn directory from  reference path */
  let svn_exist_sass = findRemoveSync(sassRefpath, {dir: ".svn"});
  console.log('svn_exist_sass   ',svn_exist_sass);
  
    /* Remove svn directory from  reference path */
  let svn_exist_css = findRemoveSync(cssRefpath, {dir: ".svn"});
  console.log('svn_exist_css   ',svn_exist_css);

  /* copy sass directory */
  const sasssrcPath = sassRefpath;
  const sassdestPath = checkoutDirPath+'/assets/sass/';
  fs.copy(sasssrcPath, sassdestPath, err =>{
    if(err) return console.error(err);
    console.log('sass files are copied successfully!');
  });

  /* compile sass files to css */
  let compassComp = await compassCompile(checkoutDirPath);
  console.log(compassComp,"  compass result");

  const csssrcPath = cssRefpath;
  const cssdestPath = checkoutDirPath+cssPath;
  /* copy css files from reference directory to final css directory */
  fs.copy(csssrcPath, cssdestPath, err =>{
    if(err) return console.error(err);
    console.log('css files are copied successfully!');
  });

  const tempcsssrcPath = checkoutDirPath+'temp_css/';
  const tempcssdestPath = checkoutDirPath+cssPath;
  /* copy compiled css directory to final css directory */
  fs.copy(tempcsssrcPath, tempcssdestPath, err =>{
    if(err) return console.error(err);
    console.log('compiled css files are copied successfully!');
    startCommit(appManifesto);    
  });
}

//initialCall(null);
module.exports.compile = initialCall;

/* commit changes */
startCommit = async(appManifesto) =>{
  /* commit configure json file */
  const projectname = appManifesto.endPoint.split('svn/')[1].split('/trunk')[0];
  let jsonPath = checkoutDirPath+folderPath;    
  await commitFiles(jsonPath,appManifesto,projectname,'json');

  /* Commit css and sass files */
  let finalcssPath = checkoutDirPath+cssPath;
  await commitFiles(finalcssPath,appManifesto,projectname,'css');
  
  let finalsassPath = checkoutDirPath+sassPath;
  await commitFiles(finalsassPath,appManifesto,projectname,'sass');
}

readJSON = async(path) =>{
  return new Promise((resolve,reject)=>{
    const hmhconfigJSON = fs.readJsonSync(path);
    resolve(hmhconfigJSON);
  })  
}

//module.exports.readJSON = readJSON;

writeJSON = async(path,json) =>{
  return new Promise((resolve,reject)=>{
    const hmhconfigJSON = fs.writeJsonSync(path, json);
    resolve(hmhconfigJSON);
  })  
}

//module.exports.writeJSON = writeJSON;
merge = async(configJSON,path) =>{
  try{
    if(!configJSON.hasOwnProperty('styleCompiler')){
      const sassProps = {
          "styleCompiler": {
            "language": "scss",
            "cssDir": "/assets/css",
            "sassDir": "/assets/sass"
        }
      }
      /* const resultJSON = await extendJSON({},configJSON,sassProps); */
      const resultJSON = {...configJSON,...sassProps};
      return resultJSON;
    } else {
      return configJSON;
    }
  } catch(e){
      console.log(e);
      return e;
  }  
}
//module.exports.merge = merge;

commitFiles = async(path,appManifesto,projectname,type) => {
  //const projectname = appManifesto.endPoint.split('svn/')[1].split('/trunk')[0];
  //svnJOB.svnConnection(checkoutDirPath+folderPath,appManifesto,projectname,'json');
  let finalCommit = await svnJOB.svnConnection(path,appManifesto,projectname,type);
  console.log("   ----   ",finalCommit);
  return finalCommit;
}

/* get sass files */