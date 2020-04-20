const replace = require('replace-in-file');
const ngssdata = require('./ngssdata.js');

let widgetSrc = ngssdata['matchingProps']['mcq'];
let decider = 'radio',grade = 'grade 6';
let htmlPath = (widgetSrc['isControlled'] ? widgetSrc['html'][decider] : ngssdata['matchingProps'][json.widgetType]['html']);
const startPoshtml = (grade == 'kindergarten' ? widgetSrc.existingKGPath : widgetSrc.existingPath);

replaceFirst = async(path,inVal,outVal)=>{
    console.log(inVal,"   ",path);
    return new Promise(async(resolve,reject)=>{
        const options = {
            files: path,
            //from: /..\/..\/assets\/widgets\/ngss-widgets\/mcq\/index.html/,
            from: inVal,
            to: outVal,
        };
        const results = await replace(options);
        resolve(results);
    })    
}

initiateMethod = async()=>{
    //let justIn = /\..\/..\/assets\/widgets\/ngss-widgets\/mcq\/index.html/
    let path = './6l2_0795_ese_ur_historylifeearth.html';
    let justIn = startPoshtml;
    let op = await replaceFirst(path,justIn,htmlPath);
    console.log(op,"   coming!!!");
}
//initiateMethod();

module.exports.replaceFirst = replaceFirst;