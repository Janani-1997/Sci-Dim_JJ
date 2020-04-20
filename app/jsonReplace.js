//const replace = require('replace-in-file');
const replaceAll = require("replace");
/* propsUpdate = async(src,filePath) =>{
    return new Promise(resolve => {        
        const options = replace.sync({
            files: filePath,
            from: "../../../../img/cards/",
            to: "../../../../../img/cards/",
            countMatches: true,
        });
        console.log(options,"  options   ");
        if(options[0].hasChanged) resolve(src);
    });    
}
//propsUpdate("../habitatProject/c360ea4bbc6d4a5aab12444f7f553ec0.json");
module.exports.propsUpdate = propsUpdate; */



let start = "\"../../../img/cards/";
let end = "\"../../../../../img/cards/";
//let fromEXCEL = {'projectType':'science','process':'NO-CPL'};
propsUpdate = async(src,filePath,fromEXCEL) =>{
    console.log(filePath,"   ",fromEXCEL);
    if(fromEXCEL.projectType != 'socials'){
        if(fromEXCEL.process == 'NO-CPL'){
            start = "\"../../../../img/cards/";
            end = "\"../../../../../img/cards/";
        } else {
            start = "\"../../../img/";
            end = "\"../../../../../img/";
        }
    } else {
        console.log(filePath,"   ",fromEXCEL);
        if(fromEXCEL.process == 'NO-CPL'){
            console.log(filePath,"   ",fromEXCEL);
            start = "\"../../../../img/cards/";
            end = "\"../../../../../img/cards/";
        } else {
            start = "\"../../../../img/cards/";
            end = "\"../../../../../img/cards/";
            
        }
    }
    
    return new Promise(resolve => {   
        const options = replaceAll({
            regex: start,
            replacement: end,
            paths: [filePath],
            recursive: true,
            silent: true,
          });
        console.log(options,"  options   ");
        resolve("src");
    });    
}
//propsUpdate(null,"../temp_config/hmh_sd35_813847/",fromEXCEL);
module.exports.propsUpdate = propsUpdate;



htmlUpdate = async(start,end,filePath) =>{
    return new Promise(resolve => {   
        const options = replaceAll({
            regex: start,
            replacement: end,
            paths: [filePath],
            recursive: true,
            silent: true,
          });
        console.log(options,"  options   ");
        resolve("src");
    });    
}
//propsUpdate("./tryme/tryme.json");
module.exports.htmlUpdate = htmlUpdate;

html_false_Update = async(start,end,filePath) =>{
    return new Promise(resolve => {   
        const options = replaceAll({
            regex: start,
            replacement: end,
            paths: [filePath],
            recursive: false,
            silent: false,
          });
        console.log(options,"  options   ");
        resolve("src");
    });    
}
//propsUpdate("./tryme/tryme.json");
module.exports.html_false_Update = html_false_Update;


/* addTags = async(start,end,path) =>{
    return new Promise(resolve => {  
        const options = replaceAll({
            regex: start,
            replacement: end,
            paths: [path],
            recursive: true,
            silent: true,
          });
        console.log(options,"  options   ");
        
    });
}

const start_head = "</head>";
const end_head = '<script xmlns="http://www.w3.org/1999/xhtml" src="/rce/content-scripts/init-rce/v0.1.0.js" type="text/javascript" data-content-scripts-injector="js"></script> </head>';
addTags(start_head,end_head,'./cards/');
const start_body = "</body>";
const end_body = '<div data-init-rce="v0.1.0"></div> </body>';
addTags(start_body,end_body,'./cards/'); */

//module.exports.dualRights = addTags();