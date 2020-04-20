const user = require('./importuserdetails.js');
//const authentication = require('./authenticator.js');
const authentication = require('./auth_new_updated.js');
const _ = require('lodash');
const sass = require('./interactionSASS.js');
const mailer = require('./mailComposer.js');
const tagChanger = require('./tagChange.js');
const onlyHTML = require('./jsonReplace.js');

let customIndex = 0;
let messageLogs = [];
let widgetsCount = 0;
let completedWidgets = [];
let startTime = new Date(),endTime = null;
let checkoutDirPath = '../smil/';
let checkoutDir = '../habitatProject/';
let folderPath = 's9ml/.templates/';
const svnJOB = require('./svnCommmit.js');
const svnConnection = require('./svnEstablish.js');

user.userDetails().then(function(userData){
	console.log("AUTHENTICATION FOR   ",userData[0].username,"/n");
	//messageLogs.push("AUTHENTICATION FOR   ",userData.username,"/n");
	//Authenticate user and make svn checkout in the desired directory...
	startProcess(userData);	
});


async function startProcess(data){
	const options = {
		url: data[0].endPoint,
		auth: {
			user: data[0].username,
			password: data[0].password
		}
	}
	let matchedCpl = {'html':[],'json':[]};
	const projectname = data[0].endPoint.split('svn/')[1].split('/trunk')[0];
	//console.log(`data is ${data}`);
	/* Method to iterate cards directory */

	/* create directory for svn push */
	const createDir = await svnProcess.createDir(checkoutDir);
	console.log(createDir,"  createDir");

	/* Svn connection */
	const svnConnect = await svnProcess.svnConnect(options);
	console.log(svnConnect,"  connection");
	
	/* Checkout JSON files */
	const fetchJSON = await svnProcess.checkout(options,checkoutDir,data[0].jsonPath ,'json');
	console.log(fetchJSON,"  JSON FILES ARE FETCHED!!!");
	
	/* Checkout html files */
	const fetchHTML = await svnProcess.checkout(options,checkoutDir,data[0].htmlPath,'html');
	console.log(fetchHTML,"  HTML FILES ARE FETCHED!!!");
	
	let opFiles = await readFiles("cards/",'dir');
    console.log(opFiles,"   opFiles");
    asyncForEach_one(opFiles, async (fileName) => {
        if(fileName != '.svn' && fileName != '.templates'){
            let recur_value = await waitFor_one(50,"cards/"+fileName);
            console.log(recur_value,"   recur_value");
        } else {
            console.log("Dont process!!!");
        }
    })

	let respCounter = await authentication.authUser(data[widgetsCount],messageLogs,matchedCpl,widgetsCount);
	if(respCounter.count){
		console.log("MIGRATION PROCESS IS DONE FOR  ",respCounter.type);
		completedWidgets.push(respCounter.type);
		widgetsCount = respCounter.count;
		if(widgetsCount < data.length){
			startProcess(data);
		} else {
			
			console.log("THE LIST OF COMPLETED WIDGETS ARE --> ",completedWidgets);
			if(data[0] && data[0].process == 'CPL'){
				let sassCompiler = await sass.compile(data[0]);
				if(data[0].gradeLevel != 'kindergarten'){
					
					/* create directory for svn push */
					const createDir = await svnConnection.createDir(checkoutDirPath);
					console.log(createDir,"  smil folder created!!!");
					const checkoutSmil = await svnConnection.checkout(options,checkoutDirPath,data[0].smilDirectory,'smil');
					console.log(checkoutSmil,"  checkoutSmil");
					let replaceTags = tagChanger.replacePar(checkoutDirPath+data[0].smilDirectory);
					console.log("  all par tags are replaced for audio integration!!!");
					const smilPath = checkoutDirPath+data[0].smilDirectory;
					let smilCommit = await svnJOB.svnConnection(smilPath,data[0],projectname,'smil');	
				}
			}
			//console.log("  sassCompiler should start here!!!   ",sassCompiler,"  the time consumption for this project is  ",);


			dt1 = startTime;
			dt2 = endTime = new Date();
			let timeTaken = function(){
				if((dt2.getHours() != dt1.getHours()) && ((dt2.getHours() - dt1.getHours()) > 60)){
					return ((dt2.getHours() - dt1.getHours())+' hours' + (dt2.getMinutes() - dt1.getMinutes()) + 'minutes');
				} else {
					if(dt2.getMinutes() - dt1.getMinutes() == 0){
						return dt2.getHours() - dt1.getHours()+' hours';
					} else {
						return dt2.getMinutes() - dt1.getMinutes() + 'minutes';
					}
				}
			}
			console.log(timeTaken(dt1, dt2)); //2
			const gradeName = data[0]['grade'] || 'project name is missing!!!';
			var mailOptions = {
				to : 'Shailenthrri.T@spi-global.com',
				subject : "HMH cpl migration logs : "+gradeName,
				html: '<b>Hi </b></br>Please find the attatchment for the logs.</br><b>Project :'+gradeName+'</b>',
				attachments:{   // stream as an attachment
					filename: gradeName+'.xlsx',
					path:gradeName+'.xlsx'
				}
			}
			const mailResponse = await mailer.sendLogs(mailOptions);
			console.log(mailResponse);
		}
	}
}