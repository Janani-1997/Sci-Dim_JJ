var fs = require('fs-extra');
const processUpdator = require('./jsonReplace.js');
async function noCPLmapping(file, jsonPath, widgetType, projectName, fromEXCEL){    
    return new Promise(resolve => {
        jsonPath = "../" + projectName + "/assets/widget_data/config/" + jsonPath;
        srcdata = fs.readFileSync(jsonPath);
        src = JSON.parse(srcdata);
        /* let imagepath = ((src.configuration && src.configuration.image) ? src.configuration.image.split('img/cards/')[1] : null);
        let destImagepath = (imagepath != null ? "../../../../../img/cards/"+imagepath : null) ;
        src.configuration.image = destImagepath; */
        const modifiedJson = processUpdator.propsUpdate(src,jsonPath,fromEXCEL);
        console.log(modifiedJson,"   modifiedJson");
        if(modifiedJson) resolve(src);
      });
}

module.exports.noCPLmapping = noCPLmapping;