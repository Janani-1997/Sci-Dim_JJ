const user = require('./importuserdetails.js');
const authentication = require('./authenticator.js');
const renamerFile = require('../renameMe/changeFilename.js');

user.userDetails().then(function(userData){
	console.log("AUTHENTICATED   --");
});
let userData = {
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
startProcess(userData);
async function startProcess(data){
    let renamerfile = await renamerFile.audioRenamer(data);
    console.log(renamerfile ,"  data is  ",data.endPoint);
}
