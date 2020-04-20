const fs = require('fs-extra');
const svnConnection = require('./svnEstablish.js');
const svnJOB = require('./svnCommmit.js');
//const audioProcess = require('./audioProcess.js');
const copydir = require('copy-dir');
const path = require('path');
let compass = require('compass');
let execFile = require('child_process').exec;
const findRemoveSync = require('find-remove');
const copyFile = require('fs-copy-file');

let checkoutDirPath = '../project/repo/';
let options = {};
let folderPath = 's9ml/.templates/';
let sassPath = 'assets/sass/';
let cssPath = 'assets/css';
let templae_config_json_path_k2 = "../interaction_config_json_template_k2/";
let templae_config_json_ref_path_k2 = "assets/template/";
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
  if(appManifesto.gradeLevel == 'kindergarten'){
    console.log("here ");
    const templae_config_json_path_k2_creation = await svnConnection.createDir(templae_config_json_path_k2);
    console.log(templae_config_json_path_k2_creation,"  templae_config_json_path_k2_creation");
    const fetch_interaction_config_json = await svnConnection.checkout(options,templae_config_json_path_k2,templae_config_json_ref_path_k2,'interactionjson_k2');
    console.log(fetch_interaction_config_json,"  fetchconfig json");
  }
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
  sassRefpath = "../sass_ref/"+(appManifesto.gradeLevel == 'kindergarten' ? 'grade_kindergarten': 'grades3-12')+"/"+appManifesto.sassDirectory;
  sassRefpath_fileonly = "../sass_ref/"+(appManifesto.gradeLevel == 'kindergarten' ? 'grade_kindergarten': 'grades3-12')+"/"+appManifesto.sassDirectory;
  console.log(cssRefpath,"   ",sassRefpath);
  
  /* Remove svn directory from  reference path */
  let svn_exist_sass = findRemoveSync(sassRefpath+'assets/sass/', {dir: ".svn"});
  console.log('svn_exist_sass   ',svn_exist_sass);
  
  /* Remove svn directory from  reference path */
  let svn_exist_css = findRemoveSync(cssRefpath, {dir: ".svn"});
  console.log('svn_exist_css   ',svn_exist_css);

  let temp_compiled_path = "../forSass/assets/";

  let interaction_path = sassRefpath+"/sass/interaction/";
  let baseline_path = sassRefpath+"/sass/baseline/";
  let custom_path = sassRefpath+"/sass/custom/";
  

  await copyDironly(interaction_path,temp_compiled_path+'interaction/');
  await copyDironly(baseline_path,temp_compiled_path+'baseline/');
  await copyDironly(custom_path,temp_compiled_path+'custom/');

  

  let interaction_fileonly = sassRefpath_fileonly+"/sass/interaction.scss";
  let variables_fileonly = sassRefpath_fileonly+"/sass/_variables.scss";
  let fonts_path = cssRefpath+"/fonts/fonts.css/";


  await copyFileonly(interaction_fileonly,temp_compiled_path+'interaction.scss');
  await copyFileonly(variables_fileonly,temp_compiled_path+'_variables.scss');
  
  await copyDironly(temp_compiled_path,checkoutDirPath+sassPath);


  /* copy image for k-2 grades from assets/images/ directory */
  if(appManifesto.gradeLevel == 'kindergarten'){
    let correct_svg_path = cssRefpath+"/images/correct.svg/";
    await copyFileonly(correct_svg_path,checkoutDirPath+cssPath+'/images/correct.svg');
    let incorrect_svg_path = cssRefpath+"/images/incorrect.svg/";
    await copyFileonly(incorrect_svg_path,checkoutDirPath+cssPath+'/images/incorrect.svg');
    let play_svg_path = cssRefpath+"/images/play.svg/";
    await copyFileonly(play_svg_path,checkoutDirPath+cssPath+'/images/play.svg');
    let navdownaqua_svg_path = cssRefpath+"/images/nav-down-aqua.svg/";
    await copyFileonly(navdownaqua_svg_path,checkoutDirPath+cssPath+'/images/nav-down-aqua.svg');
    let correct_cnl18ese_k2_svg_path = cssRefpath+"/images/correct_cnl18ese_k2.svg/";
    await copyFileonly(correct_cnl18ese_k2_svg_path,checkoutDirPath+cssPath+'/images/correct_cnl18ese_k2.svg');
    let incorrect_cnl18ese_k2_svg_path = cssRefpath+"/images/incorrect_cnl18ese_k2.svg/";
    await copyFileonly(incorrect_cnl18ese_k2_svg_path,checkoutDirPath+cssPath+'/images/incorrect_cnl18ese_k2.svg');

    /* add interaction config for k-2 projects as james suggested */
    let interaction_config_path = sassRefpath+"/template/interaction_config.json/";
    await copyFileonly(interaction_config_path,templae_config_json_path_k2+templae_config_json_ref_path_k2+'interaction_config.json');
  }

  /* compile interaction directory from sass files to css */
  let interaction_dir_compassComp = await compassCompile("../forSass/");
  console.log(interaction_dir_compassComp,"  compass result");
  
  const interaction_dir_css_src_Path = "../forSass/compiled_css/";
  const interaction_dir_css_dest_Path = checkoutDirPath+cssPath;
  /* copy compiled interaction css directory to final css directory */
  fs.copy(interaction_dir_css_src_Path, interaction_dir_css_dest_Path, err =>{
    if(err) return console.error(err);
    console.log('compiled css files are copied successfully!');
    /* Only for k-2 projects copy fonts directory */
    copyFileonly(fonts_path,interaction_dir_css_dest_Path+'/fonts/fonts.css');
    
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

  if(appManifesto.gradeLevel == 'kindergarten'){
    /* commit k2 interaction json file */
    let interaction_config_json_path = templae_config_json_path_k2+templae_config_json_ref_path_k2; 
    await commitFiles(interaction_config_json_path,appManifesto,projectname,'interaction_config_json');
  }
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

copyDironly = async(src,dest)=>{
    return new Promise((resolve,reject)=>{
        fs.copy(src, dest, err =>{
            if(err) return console.error(err);
            else{
                resolve(" directory is copied successfully!");
            }
        });
    })
}

copyFileonly = async(src,dest)=>{
    return new Promise((resolve,reject)=>{
        fs.copyFile(src, dest, err =>{
            if(err) return console.error(err);
            else{
                resolve(" file is copied!!!");
            }
        });
    });
}