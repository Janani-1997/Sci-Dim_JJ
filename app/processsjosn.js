const fs = require('fs-extra');
const processJSON = require('./no_CPL_jsonmapping.js');

processJSONFiles = async (file, jsonPath, widgetType, projectName, fromEXCEL) =>{
    console.log("sidharaj");
    let nocplJSON = await processJSON.noCPLmapping(file, jsonPath, widgetType, projectName, fromEXCEL);    
    if(nocplJSON) return JSON.stringify(nocplJSON);
}

//processJSONFiles("habitatProject","ece1443bab124a7db1b5a11a4680ec91.json");
module.exports.processJSONFiles = processJSONFiles;