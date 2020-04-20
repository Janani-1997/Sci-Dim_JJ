const replaceAll = require("replace");
replaceParTag = async(path) =>{
    const start = '<par epub:type="learning-resource">'; 
    const end = '<par epub:type="learning-resource" data-audio="true">'; 
    let xyz = new Promise(resolve => {
        const options = replaceAll({
            regex: start,
            replacement: end,
            paths: [path],
            recursive: true,
            silent: false,
          });
          resolve(options);
        //console.log(path);
    });
    return 'process completed!!!';
}

/* newY = async() =>{
    let xxx = await replaceParTag('../../../smil_check/');
    console.log(xxx,"   xxxx   ");
}
newY(); */

module.exports.replacePar = replaceParTag;

