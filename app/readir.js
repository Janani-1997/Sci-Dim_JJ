const fse = require('fs-extra');
//let checkoutDir = '../forTesting/';
let checkoutDir = null;
//let path = "s9ml/";
const { readdirSync } = require('fs');

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

async function asyncForEach_one(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const waitFor_one = ((ms,fileName) => {
    return new Promise(async(resolve,reject) => {
        setTimeout(async()=>{
            let opFiles_recur = await readFiles(checkoutDir,fileName+'/','files');
            resolve(opFiles_recur);
        }, ms);
    });
});

readFiles = async(dir,path,process)=>{
    checkoutDir = dir;
    return await new Promise((resolve,reject)=>{
        if(process == 'dir'){
            resolve(getDirectories(checkoutDir+path));
        } else {
            fse.readdir(checkoutDir+path, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        }
    });
}

getCompletedlength = async(val) => {
    return new Promise((resolve,reject)=>{
        val++;
        resolve(val);
    })
}

initiateProcess = async()=>{
    let opFiles = await readFiles('../forTesting/',"cards/",'dir');
    console.log(opFiles,"   opFiles");
    let fileCount = 0,matchedCount = 0;
    asyncForEach_one(opFiles, async (fileName) => {
        if(fileName != '.svn' && fileName != '.templates'){
            matchedCount = getDirectories('../forTesting/cards/').length;
            let recur_value = await waitFor_one(50,"cards/"+fileName);
            let just_length = await getCompletedlength(fileCount);
            fileCount = just_length;
            console.log(recur_value,"   recur_value   ",just_length);
            if(matchedCount-2 == just_length){
                console.log("All are matched and the result is all done!!!");
            }
        } else {
            console.log("Dont process!!!");
        }
    })
}

initiateProcess();


/* async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
asyncForEach([1, 2, 3], async (num) => {
    await waitFor(50);
    console.log(num);
})
console.log('Done'); */






//console.log(getDirectories('../forTesting/cards/').length);