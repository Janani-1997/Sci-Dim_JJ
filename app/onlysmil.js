let checkoutDirPath = '../smil/';
const svnConnection = require('./svnEstablish.js');
const tagChanger = require('./tagChange.js');

async function startProcess(){
    let data = {
        endPoint: 'https://svn.inkling.com/svn/hmh_sd35_813847/trunk/',
        username: 'S.Vembuganesh@spi-global.com',
        password: 'HAB@spi123456',
        widgetType: 'drawing-tool',
        widgetDirectory: '/ngss-widgets/k2/',
        jsonPath: 'assets/widget_data/config/',
        htmlPath: 's9ml/cards/',
        grade: 'SC SciDmns 2018 NA Gr3 813847',
        gradeLevel: 'kindergarten',
        process: 'CPL',
        projectURL:
        'https://habitat.inkling.com/project/hmh_sd35_813847/files/s9ml/cards/',
        audioSrcpath: 'assets/captions/audio/',
        sassDirectory: 'sn_17f9',
        smilDirectory: 'assets/smil/cards/' 
    }
    const options = {
        url: data.endPoint,
        auth: {
          user: data.username,
          password: data.password
        }
      }
    /* create directory for svn push */
    const createDir = await svnConnection.createDir(checkoutDirPath);
    console.log(createDir,"  smil folder created!!!");
    const checkoutSmil = await svnConnection.checkout(options,checkoutDirPath,data.smilDirectory,'smil');
    console.log(checkoutSmil,"  checkoutSmil");
    let replaceTags = tagChanger.replacePar(checkoutDirPath+data.smilDirectory);
    console.log(replaceTags,"  all par tags are replaced for audio integration!!!");
}

startProcess();