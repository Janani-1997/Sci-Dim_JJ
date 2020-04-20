/* var fs = require('fs');
 
fs.renameSync('sample.txt', 'sample_old_new.txt');
console.log('File Renamed.'); */


const fs = require("fs")
let audioCheckoutdirPath = '../../habitatProject/';
const svnProcess = require('../app/svnEstablish.js');
const svnJOB = require('../app/svnCommmit.js');

let options = {
  url: 'https://svn.inkling.com/svn/hmh_scidmns20ca_g1_plantstruc/trunk/',
  auth: {
  user: 'S.Vembuganesh@spi-global.com',
  password: 'HAB@spi123456'
  }
}

let appManifesto = {
  endPoint: 'https://svn.inkling.com/svn/hmh_scidmns20ca_g1_plantstruc/trunk/',
  username: 'S.Vembuganesh@spi-global.com',
  password: 'HAB@spi123456',
  widgetType: 'drawing-tool',
  widgetDirectory: '/ngss-widgets/',
  jsonPath: 'assets/widget_data/config/',
  htmlPath: 's9ml/cards/',
  grade: 'SC SciDmns 2020 CA Gr1 PlantStruc',
  gradeLevel: 'kindergarten',
  process: 'CPL',
  projectURL:
  'https://habitat.inkling.com/project/hmh_scidmns20ca_g1_plantstruc/files/s9ml/cards/',
  audioSrcpath: 'assets/captions/audio/',
  sassDirectory: 'sn_3867',
  smilDirectory: 'assets/smil/cards/',
  startDirectory: '../../assets/widgets/ngss-widgets/drawing-tool/index.html',
  endDirectory: '../../assets/modules/hmh.drawing_tool/widgets/explib_drawing_tool/index.html'
}


audioRenamer = async()=>{
  const tempAudioPath = '../renameMe/';
  console.log(tempAudioPath,"   audiopaths");

  /* Checkout audio files */
  const fetchaudioJSON = await svnProcess.checkout(options,'./op/','assets/captions/audio/','audiojson',true,'myFiles/');
  console.log(fetchaudioJSON,"  audio json FILES ARE FETCHED!!!");

  return new Promise((resolve,reject)=>{
  // Read directory
  fs.readdir("./op/myFiles/", (err, files) => {
    // Cicle files on current folder
    console.log(files);
    let i = 0,iCols = [];
    return new Promise((resolve,reject)=>{
      for (const [r, file] of files.entries()) {
        // Test regular expression
        i++;
        console.log("i is ",i, "   before files count is  ",files.length,"  r value is  ",r);
        let regexp = /-partially-correct/g;
        if (regexp.test(file)) {
          iCols.push(r);
          fs.rename("./op/myFiles/"+file, "./op/myFiles/"+file.split('-')[0]+'-partiallyCorrect.mp3', (err) => {  
            if (err) throw err
            else{
              if(i == files.length){
                console.log("i is ",i, "   files count is  ",r);
                console.log('Renaming', file, "to", "partiallyCorrect.mp3");
                resolve("hey i am done!!!");
              }
            }
          })
        }
      }
    });
  });
});
  /* const projectname = appManifesto.endPoint.split('svn/')[1].split('/trunk')[0];
  await svnJOB.svnConnection('./op/myFiles/',appManifesto,projectname,'audio'); */
}

console.log(audioRenamer());

//module.exports.audioRenamer = audioRenamer;