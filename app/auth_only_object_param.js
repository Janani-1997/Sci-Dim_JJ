const request = require('request');
const svnUltimate = require('node-svn-ultimate');
const fs = require('fs-extra');
const args = require('minimist')(process.argv.slice(2));
const cheerio = require('cheerio');
const htmlparser2 = require('htmlparser2');
const u = require("underscore");
const htmlEncode = require('js-htmlencode').htmlEncode;
const htmlDecode = require('js-htmlencode').htmlDecode;


const mappedJSON = require('../script/cpl_conversion/scripts/mapping.js');
const audioMapping = require('../script/audio/scripts/audio_mapping.js');
const writeJSON = require('./writejson.js');
const processJSON = require('./processsjosn.js');
const svnJOB = require('./svnCommmit.js');
const fse = require('fs-extra');
const ngssdata = require('./ngssdata.js');
const ngssNONCPLdata = require('./no-cpl.js');
const svnProcess = require('./svnEstablish.js');
const excelLog = require('./excel_log.js');
const justFiles = require('./onlyFiles.js');
const renameK2 = require('../script/audio/scripts/k2_audio_rename.js');
const onlyHTML = require('./jsonReplace.js');
const replace_only_first = require('./replaceFrstOccurence.js');


let $ = null;
const cardsDirectory = 's9ml/cards/';
const jsonDirectory = 'assets/widget_data/config';
const cssDirectory = "assets/css/";
const parentDirectory = '';
let messageLogs = [];
let accessiblityLogs = [];
const assetsDirectory = "assets/widget_data/config/";
let customIndex = 0;
let previousInd = 0;
let destURL = [];
let widgetData = [];
let image_galleryWidgets = [];
let appManifesto = null;
let matchedCplwidgets = [];
let matchedWidgetsHTML = [];
let recursiveBoolean = 1;
let customFiles1 = ["661_7410_ese_ee3_airptrnerthatmph.html"];
let checkoutDirPath = '../habitatProject/';
let audioCheckoutdirPath = '../only_audio/';
let configCheckoutdirPath = "../only_config/";
let checkoutDir = '../habitatProject/';
let configPath = "../../widget_data/config/";

async function readHTMLfiles(file){
	let htmlData = await new Promise(function(resolve,reject){
		fs.readFile(checkoutDir+cardsDirectory+file, "utf-8", function(err, buf) {
			let dom = '';
			dom = htmlparser2.parseDOM(buf);
			$ = cheerio.load(dom, {
				xmlMode: true
			});			
			let interactivematchedElements = $('body object').get();	
			console.log("FETCHING HTML FILE FOR ",file);			
			messageLogs.push("FETCHING HTML FILE FOR ",file);
			resolve({'matchedWidgets':interactivematchedElements,'file':file,'body':$('body'),'cherrySelector':$});						
		}); 
	});
	return htmlData;
}

justAudio = async(json,projectName,ngsssrc)=>{
    //const json.jsonPath = json.jsonPath;
    return new Promise(async (resolve,reject)=>{
        /* Audio process starts here */
        const audioPath = audioCheckoutdirPath+appManifesto.jsonPath+'audio/';
		const audiosrcPath = audioCheckoutdirPath+'cpl_audio/'+json.jsonPath;
        const audiodestPath = audioPath;
		let ngssWidgetSrc = ngssdata['matchingProps'][json.widgetType];
		let ngssMappingpath = (ngssWidgetSrc['isControlled'] ? ngssWidgetSrc['audioMappingpath'][ngsssrc.configuration[ngssWidgetSrc.deciderProp]] : ngssdata['matchingProps'][json.widgetType]['audioMappingpath']);
		let ngssTemplatepath = (ngssWidgetSrc['isControlled'] ? ngssWidgetSrc['audioTemplatepath'][ngsssrc.configuration[ngssWidgetSrc.deciderProp]] : ngssdata['matchingProps'][json.widgetType]['audioTemplatepath']);

		if(appManifesto.gradeLevel != 'kindergarten'){
			/* Mapping for audio json files */
			const mappingJSONpath = '../script/audio/json/'+ngssMappingpath+'.json';
			const templateJSONpath = '../script/audio/json/'+ngssTemplatepath+'.json';
			console.log( audioCheckoutdirPath+'cpl_audio/'+json.jsonPath,"   ",mappingJSONpath,"     before send!!!");
			const audioJSON = await audioMapping.mapping(audiosrcPath,mappingJSONpath,templateJSONpath);
			console.log("audiojson data is ->>>>",audioJSON);

			const audioUpdate = await writeJSON.write(audiosrcPath,audioJSON);
			console.log("audio json has been updated successfully   ",audioUpdate);
			const audioCommit = await svnJOB.svnConnection(audiosrcPath,appManifesto,projectName,'audio');
            console.log("audioCommit   ",audioCommit);
            resolve("grade 3-12 audio files are processed!!!");
		} else {
			//renameK2
			/* Rename audio files for k-2 grades */
			const renamedK2 = renameK2.renameFilesk2(json.jsonPath,audioCheckoutdirPath+'cpl_audio/');
			console.log("just rename k2 audio",renamedK2);
			const audioCommit = await svnJOB.svnConnection(audioCheckoutdirPath+'cpl_audio/',appManifesto,projectName,'audio');
            console.log("audioCommit  for k2 ",audioCommit);
            resolve("grade k-2 audio files are processed!!!");
        }
        /* Audio process ends here */
    })
}

/* Method to process param tag value properties */
justParams = async(widgetSrc,json,cssparamValue,file)=>{
    return new Promise((resolve,reject)=>{
        if(appManifesto.gradeLevel == 'kindergarten'){
            const startPosjson_one = '"../../../../widget_data/config/'+json.jsonPath+'"></param>';
            const endPosjson = '"../../../../widget_data/config/'+json.jsonPath+'" /> <param name="theme" value="'+cssparamValue+'" />';
            //const endPosjson = '"../../../../widget_data/config/'+json.jsonPath+'" /> <param name="theme" value="drawing-tool" />';
            let paramJSONpdateVal_one = onlyHTML.htmlUpdate(startPosjson_one,endPosjson,checkoutDir+appManifesto.htmlPath);
            console.log(startPosjson_one,"   ----  ",endPosjson,"   ----    ",paramJSONpdateVal_one,"k-2   paramJSONpdateVal");
            
            const startPosjson_two = '"../../../../widget_data/config/'+json.jsonPath+'" />';
            let paramJSONpdateVal_two = onlyHTML.htmlUpdate(startPosjson_two,endPosjson,checkoutDir+appManifesto.htmlPath);
            console.log(startPosjson_two,"   ----  ",endPosjson,"   ----    ",paramJSONpdateVal_two,"k-2   paramJSONpdateVal");
            
            const startPosjson_three = '"../../../../widget_data/config/'+json.jsonPath+'"/>';
            let paramJSONpdateVal_three = onlyHTML.htmlUpdate(startPosjson_three,endPosjson,checkoutDir+appManifesto.htmlPath);
            console.log(startPosjson_three,"   ----  ",endPosjson,"   ----    ",paramJSONpdateVal_three,"k-2   paramJSONpdateVal");
            resolve('k-2 param tag value attribute modified!!!');
        } else {
            const startPosjson_one = '"../../../widget_data/config/'+json.jsonPath+'"></param>';
            const endPosjson = '"../../../../widget_data/config/'+json.jsonPath+'" /> <param name="theme" value="'+cssparamValue+'" />';
            //const endPosjson = '"../../../../widget_data/config/'+json.jsonPath+'" /> <param name="theme" value="drawing-tool" />';
            let paramJSONpdateVal_one = onlyHTML.html_false_Update(startPosjson_one,endPosjson,checkoutDir+appManifesto.htmlPath+file);
            console.log(startPosjson_one,"   ----  ",endPosjson,"   ----    ",paramJSONpdateVal_one,"   paramJSONpdateVal");
            
            const startPosjson_two = '"../../../widget_data/config/'+json.jsonPath+'" />';
            let paramJSONpdateVal_two = onlyHTML.html_false_Update(startPosjson_two,endPosjson,checkoutDir+appManifesto.htmlPath+file);
            console.log(startPosjson_two,"   ----  ",endPosjson,"   ----    ",paramJSONpdateVal_two,"   paramJSONpdateVal");
            
            const startPosjson_three = '"../../../widget_data/config/'+json.jsonPath+'"/>';
            let paramJSONpdateVal_three = onlyHTML.html_false_Update(startPosjson_three,endPosjson,checkoutDir+appManifesto.htmlPath+file);
            console.log(startPosjson_three,"   ----  ",endPosjson,"   ----    ",paramJSONpdateVal_three,"3-12   paramJSONpdateVal");
            //return;
            //messageLogs.push("Data version is ",dataversionPath);
            resolve('3-12 param tag value attribute modified!!!');
        }
    })
}

/* Method to process object tag data properties */
justObjects = async(widgetSrc,htmlPath,file)=>{
    return new Promise(async(resolve,reject)=>{
		if(appManifesto.process == 'CPL'){
			/* changes in html object tag after param tag modofications */
			const startPoshtml = (appManifesto.gradeLevel == 'kindergarten' ? widgetSrc.existingKGPath : widgetSrc.existingPath);
			const endPoshtml = htmlPath + '" data-version="';
			//let paramHTMLUpdateVal = onlyHTML.html_false_Update(startPoshtml,endPoshtml,checkoutDir+appManifesto.htmlPath+file);
			let paramHTMLUpdateVal = await replace_only_first.replaceFirst(checkoutDir+appManifesto.htmlPath+file,startPoshtml,endPoshtml);
			console.log(startPoshtml,"   ----    ",endPoshtml,"    ----    ",paramHTMLUpdateVal,"   paramHTMLUpdateVal");
			resolve("all CPL object tag data attributes are modified!!!");
		} else {
			let widgetSrc = ngssNONCPLdata['matchingProps'][appManifesto.widgetType];
			const startPoshtml = widgetSrc.existingPath;
			const endPosjsonhtml = (appManifesto.gradeLevel == 'kindergarten' ? widgetSrc.kgPath : widgetSrc.uppergartenPath);
			console.log(startPoshtml,"   ",endPosjsonhtml);
			let paramHTMLval = onlyHTML.html_false_Update(startPoshtml,endPosjsonhtml,checkoutDir+appManifesto.htmlPath+file);
			console.log(startPoshtml,"   ----  ",endPosjsonhtml,"   ----    ",paramHTMLval,"   paramHTMLval");
			resolve("all NO-CPL object tag data attributes are modified!!!");
		}
    })
}

writeJSONS = async(cplMatchedjson,json,file)=>{
	return new Promise(async(resolve,reject)=>{
		if(cplMatchedjson != null){
			fs.writeFile(checkoutDir+jsonDirectory+'/'+json.jsonPath,cplMatchedjson , 'utf-8',function (err) {
				let jsonObj = json;
				if (err) {
							console.log("Json update failed   ",err);
							messageLogs.push("Json update failed   ",err);
							throw err;
						}
				else {
					matchedCpl.json.push(jsonObj.jsonPath);
					console.log(jsonObj.jsonPath,'   JSON HAS BEEN UPDATED FOR ',file);
					messageLogs.push(jsonObj.jsonPath,'   JSON HAS BEEN UPDATED FOR ',file);
					jsonObj = {};
					respJSONcounter++;
					resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
				}
			});
		} else {
			let jsonObj = json;
			jsonObj = {};
			respJSONcounter++;
			resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
		}
	})
	
}

async function getJSON(json,counter,file,processType){
	console.log(json.jsonPath,"   getjson check check check!!!   ",appManifesto.process,"  processType ",processType);
	projectName = "habitatProject";

	/* Validate json file is existing or not */
	const statusRespOne = {'count':0,'file':file,'status':'fail','jsonName':"param tag is wrong!!"};	
	if(json.jsonPath == undefined) return statusRespOne;
	const statusRespTwo = {'count':0,'file':file,'status':'fail','jsonName':json.jsonPath};	
	if(processType == 'audioOnce' && matchedCpl.json.includes(json.jsonPath)) return statusRespTwo;
	let cplMatchedjson = null,nocplJSON = null;
	console.log(appManifesto.process,"    cpl cpl cpl cpl");
    
    let jsonValue = new Promise(async (resolve,reject) => {
        const path = configCheckoutdirPath+'cpl_config/' + json.jsonPath;
		const srcdata = fs.readFileSync(path);
        const src = JSON.parse(srcdata);
		let htmlPath = null, dataversionPath = null, cssparamValue = null;
        let widgetSrc = ngssdata['matchingProps'][json.widgetType];
        if(appManifesto.process == 'CPL'){
			htmlPath = (widgetSrc['isControlled'] ? widgetSrc['html'][src.configuration[widgetSrc.deciderProp]] : ngssdata['matchingProps'][json.widgetType]['html']);
			dataversionPath = (widgetSrc['isControlled'] ? widgetSrc['dataVersion'][src.configuration[widgetSrc.deciderProp]] : ngssdata['matchingProps'][json.widgetType]['dataVersion']);
			cssparamValue = (widgetSrc['isControlled'] ? widgetSrc['value'][src.configuration[widgetSrc.deciderProp]] : widgetSrc['value']);
		}
        /* Audio file modifications */
        if(processType == 'audioOnce') {
            if(appManifesto.process == 'CPL'){
				//await justAudio(json,projectName,src);
                /* CPL json mdofications starts here */
				//cplMatchedjson= await mappedJSON.mappingJSON(file,json.jsonPath,json.widgetType,projectName,appManifesto);
				/* method to write files */
				//let writtenJSON = await writeJSONS(cplMatchedjson,json,file);
				//console.log(writtenJSON, "   writtenJSON");
				//if(writtenJSON){
					if(appManifesto.process == 'CPL'){
						const just_params = await justParams(widgetSrc,json,cssparamValue,file);
						if(appManifesto.process =='NO-CPL'){
							htmlPath = null;
						}
						const just_objects = await justObjects(widgetSrc,htmlPath,file);
						if(just_objects){
							//resolve(writtenJSON);
							respJSONcounter++;
							resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
						}
					} else {
						respJSONcounter++;
						//resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
						//resolve(writtenJSON);
					}
				//}
				
                
                /* CPL json mdofications ends here */
            } else if(appManifesto.process == 'NO-CPL'){
                //fetch no cpl json and change image path
                console.log("   <=  nocplJSON");
                /* NO-CPL json modifications starts here */
                nocplJSON = await processJSON.processJSONFiles(file,json.jsonPath,json.widgetType,projectName,appManifesto);
                console.log(nocplJSON,"   <=  nocplJSON");
                if(appManifesto.gradeLevel != 'kindergarten'){
                    const startPosjson = '"../../../widget_data/config/'+json.jsonPath+'"';
                    const endPosjson = '"../../../../widget_data/config/'+json.jsonPath+'"';
                    let paramJSONupdateVal = onlyHTML.htmlUpdate(startPosjson,endPosjson,checkoutDir+appManifesto.htmlPath);
                    console.log(startPosjson,"   ----  ",endPosjson,"   ----    ",paramJSONupdateVal,"   paramJSONupdateVal");
                }
                respJSONcounter++;
                resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
                /* NO-CPL json modifications ends here */
            }
        } else if(processType == 'paramTag'){
			/* if(appManifesto.process == 'CPL'){
				const just_params = await justParams(widgetSrc,json,cssparamValue,file);
				if(just_params){
					respJSONcounter++;
					resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
				}
			} else {
				respJSONcounter++;
				resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
			} */
            
        } else if(processType == 'objectTag'){
			/* if(appManifesto.process =='NO-CPL'){
				htmlPath = null;
			}
            const just_objects = await justObjects(widgetSrc,htmlPath,file);
            if(just_objects){
                respJSONcounter++;
                resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
            } */
        }
    })
    
    
	/* let jsonValue = await new Promise(resolve => {
		if(appManifesto.process == 'CPL'){
            if(processType == 'paramTag'){
                await justParams();
            } else if(processType == 'objectTag'){
                await justObjects();
            }
        } else if(appManifesto.process == 'NO-CPL'){
            if(appManifesto.gradeLevel != 'kindergarten'){
				const startPosjson = '"../../widget_data/config/'+json.jsonPath+'"';
				const endPosjson = '"../../../../widget_data/config/'+json.jsonPath+'"';
				let paramJSONupdateVal = onlyHTML.htmlUpdate(startPosjson,endPosjson,checkoutDir+appManifesto.htmlPath);
				console.log(startPosjson,"   ----  ",endPosjson,"   ----    ",paramJSONupdateVal,"   paramJSONupdateVal");
            }
        }
		
		if(cplMatchedjson != null){
            fs.writeFile(checkoutDir+jsonDirectory+'/'+json.jsonPath,cplMatchedjson , 'utf-8',function (err) {
                let jsonObj = json;
                if (err) {
                            console.log("Json update failed   ",err);
                            messageLogs.push("Json update failed   ",err);
                            throw err;
                        }
                else {
                    matchedCpl.json.push(jsonObj.jsonPath);
                    console.log(jsonObj.jsonPath,'   JSON HAS BEEN UPDATED FOR ',file);
                    messageLogs.push(jsonObj.jsonPath,'   JSON HAS BEEN UPDATED FOR ',file);
                    jsonObj = {};
                    respJSONcounter++;
                    resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
                }
            });
        } else {
            let jsonObj = json;
			jsonObj = {};
			respJSONcounter++;
			resolve({'count':respJSONcounter,'file':file,'status':'success','jsonName':json.jsonPath});
        }
	}) */
	return jsonValue;	 
}

async function matchcplWidgets(activities,file){
	return await new Promise(function(resolve,reject){		
		image_galleryWidgets = [];
		activities.length && activities.forEach((i, elem, array) =>{
			console.log($(i).attr('data'),"   before widgets");
			let widgets = $(i).attr('data').split(appManifesto.widgetDirectory)[1];
			console.log(widgets,"  widgets");
			let ngssWidgets = (widgets ? widgets.split('/index.html')[0] : null);
			if(ngssWidgets != null){
				if(ngssWidgets == appManifesto['widgetType']){					
					image_galleryWidgets.push({'name':ngssWidgets,'data':$(i)});					
				}
			}
		});
		resolve({'widgets':image_galleryWidgets,'file':file});
	});	
}

let respJSONcounter = 0;
let jsonCount = 0;
async function updatewidgets(activities,file,param_type){	
        console.log(activities.length,"   ->>>  ",file,"   ->>>  ",activities);
		if(!activities.length){
			return await new Promise(async(resolve)=>{
				console.log("NO ACTIVITIES FOUND FOR ",file);
				//messageLogs.push("NO ACTIVITIES FOUND FOR ",file);
				resolve("No activities found");
			})
		} else {
			console.log("activities found for !!!!");
			let counter = 0;			
			return await new Promise(async(resolve)=>{
				console.log($(activities[jsonCount].data).find('param').attr('value'), "   am i undefined!!!   ",$(activities[jsonCount].data).children('param').eq(2).attr('value'));
				//let currentScope = $(activities[jsonCount].data).find('param').attr('value');
				//let currentScope = ((appManifesto.widgetType == 'video-gallery' && appManifesto.gradeLevel == 'kindergarten') ? $(activities[jsonCount].data).children('param').eq(1).attr('value') : $(activities[jsonCount].data).find('param').attr('value'));
				let currentScope = null;
				if(appManifesto.widgetType == 'enrichment' && appManifesto.gradeLevel != 'kindergarten'){
					currentScope = $(activities[jsonCount].data).children('param').eq(2).attr('value');
				} else if(appManifesto.widgetType == 'video-gallery' && appManifesto.gradeLevel == 'kindergarten'){
					currentScope = $(activities[jsonCount].data).children('param').attr('value');
				} else{
					currentScope = $(activities[jsonCount].data).find('param').attr('value')
				}
				console.log(currentScope,"  currenscope");
				//let currentScope = ((appManifesto.widgetType == 'video-gallery' && appManifesto.gradeLevel == 'kindergarten') ? $(activities[jsonCount].data).children('param').eq(1).attr('value') : $(activities[jsonCount].data).find('param').attr('value'));
				let ngssWidgets = activities[jsonCount].name;
				let jsonProps = {
					'jsonPath':currentScope.split('config/')[1],
					'widgetType': appManifesto['widgetType'],
					'ngssWidgets':ngssWidgets,
					'currentThis':activities[jsonCount].data,
					'parentdatauuId':$(activities[jsonCount].data).parent().attr('data-uuid'),
					'objectdatauuId':$(activities[jsonCount].data).attr('data-uuid')
				};
				messageLogs.push("Object tag data-uuid is ",jsonProps.objectdatauuId);
				console.log(jsonProps," jsonprops are   ");
                let getJson_recurrsively = await getJSON(jsonProps, counter, file,param_type);
                console.log(getJson_recurrsively," getJson_recurrsively");
                /* let param_tag = await getJSON(jsonProps, counter, file,'paramTag');
                console.log(param_tag," param");
                let object_tag = await getJSON(jsonProps, counter, file,'objectTag');
                console.log(object_tag," object"); */
				if(getJson_recurrsively.status === 'success'){
					if(getJson_recurrsively.count){
						jsonCount = getJson_recurrsively.count;
						if(jsonCount < activities.length){
							let widgetUpdate = await updatewidgets(activities,file,param_type);
							let message ='totally done';
							jsonProps = {};
							resolve(message);
						} else {
							console.log("all completed!!!!");	
							let message ='done';
							jsonProps = {};
							resolve(message);
						}
					}					
				} else {
					resolve(getJson_recurrsively.jsonName,"  IS ALREADY CONVERTED SO INTERACTIVITY MIGRATION IS SKIPPED FOR ",getJson_recurrsively.file);
				}
			});
		}	
}

function writeInteractionCSS(readPath,writePath,file){
	fs.readFile(readPath,'utf-8' , function (err,buf) {
		if (err) {
				console.log("Fetching CSS details failed   ",err);
				messageLogs.push("Fetching CSS details failed   ",err);
				throw err;
			}
		else {
			//console.log("content css  ->  ",buf);
			fs.writeFile(writePath+file,buf , 'utf-8', function (err) {
				if (err) {
					console.log("CSS update failed   ",err);
					messageLogs.push("CSS update failed   ",err);
					//throw err;
				}
				else {
					const cssPath = checkoutDir+"assets/css/";
					const projectname = appManifesto.endPoint.split('svn/')[1].split('/trunk')[0];
					svnJOB.svnConnection(cssPath,appManifesto,projectname,'css');
				}
			});
		}
	});
}

async function processHTMLfiles(file,customIndex){
	
	let interactivities = await readHTMLfiles(file);  //Read html file in a sequenctial manner and retruns interactivities 
	matchedCplwidgets = await matchcplWidgets(interactivities.matchedWidgets,interactivities.file);  //Return matched cpl widgets 
	if(matchedCplwidgets.widgets.length){
		matchedFiles.push(`=====>${appManifesto.projectURL}${matchedCplwidgets.file}<=====`);
		destURL.push(`${appManifesto.projectURL}${matchedCplwidgets.file}, `);
		matchedCpl.html.push(matchedCplwidgets.file);
    }
    let fetchjson_one = await updatewidgets(matchedCplwidgets.widgets,interactivities.file,'audioOnce'); /* Update the related html with the updated cpl widget and associated json */
    console.log(fetchjson_one,"   fetchjson_one    ");
    //respJSONcounter = 0;
    jsonCount = 0;
    //let fetchjson_two = await updatewidgets(matchedCplwidgets.widgets,interactivities.file,'paramTag'); /* Update the related html with the updated cpl widget and associated json */
    //console.log(fetchjson_two,"   fetchjson_two    ");
	//respJSONcounter = 0;
	//return;
    //jsonCount = 0;
    
    //let fetchjson_three = await updatewidgets(matchedCplwidgets.widgets,interactivities.file,'objectTag'); /* Update the related html with the updated cpl widget and associated json */
	//console.log(fetchjson_three,"   fetchjson_three    ",appManifesto.process);
	respJSONcounter = 0;
	//jsonCount = 0;
	matchedCplwidgets.widgets = [];
	interactivities = [];
	
	const projectname = appManifesto.endPoint.split('svn/')[1].split('/trunk')[0];
	if(fetchjson_one){
		if(customIndex < customFiles1.length){
			recursiveBoolean = 1;
			customIndex++;
			if(customFiles1[customIndex] != undefined) {
				if(customFiles1[customIndex] == undefined) return;
				if(customFiles1[customIndex] && recursiveBoolean){
					if(customIndex < customFiles1.length){
						await processHTMLfiles(customFiles1[customIndex], customIndex);
						
						return {'count':finalRespcount,'type':appManifesto.widgetType,'filesList':filesList};
					}
				} else {
					console.log("!!!!");
					return true;
				}
								
			} else if(customIndex == customFiles1.length){				
				console.log("THE LIST OF "+appManifesto['widgetType'].toUpperCase()+" WIDGET MATCHED HTML PAGES ARE  ---> ", matchedCpl.html,"   ----   json    ",matchedCpl.json);
				messageLogs.push("THE LIST OF "+appManifesto['widgetType'].toUpperCase()+" WIDGET MATCHED HTML PAGES ARE  ---> ", matchedCpl.html);
                accessiblityLogs.push("*************************"+(appManifesto.process == 'CPL' ? "CPL Migration " : "Accessibility ")+"log started******************************");
				accessiblityLogs.push("THE LIST OF "+appManifesto['widgetType'].toUpperCase()+" WIDGET MATCHED HTML PAGES ARE  ---> ", matchedFiles);
				accessiblityLogs.push("*************************"+(appManifesto.process == 'CPL' ? "CPL Migration " : "Accessibility ")+" log ended******************************");
                messageLogs.push("*************************Log ended******************************");
				const dir = (appManifesto.process == 'CPL' ? '../logs/CPLMigration/' : '../logs/accessibility/');
				console.log(customIndex+"  -- "+appManifesto['grade']+customIndex+","+appManifesto['process']+","+destURL+","+'YTE',"   ",customFiles1.length);
				
				console.log(previousInd,"   <=  previousInd ");
				let logSheet = await excelLog.writeSheet(previousInd,appManifesto['grade'],appManifesto['widgetType'].toUpperCase(),appManifesto['process'],destURL.length ? destURL : 'No matches found','YTE',appManifesto.grade);
				console.log(logSheet,"   <=previousInd");
				destURL = [];
				previousInd = logSheet+1;
				console.log("excel process");
				/* checkDir(dir); */
				/* create directory for logs */
				const logDir = await svnProcess.createDir(dir);
				console.log(logDir,"  log folder created");

				var curDate = new Date();
				var todayDate = curDate.getFullYear()+'-'+(curDate.getMonth()+1)+'-'+curDate.getDate();
                var time = curDate.getHours() + "-" + curDate.getMinutes() + "-" + curDate.getSeconds();
                var curTime = todayDate+"_"+time;
				fs.writeFile(dir+appManifesto.grade+'_'+curTime+'.txt',accessiblityLogs , function (err) {
					if (err) {
						throw err;
					} 
					console.log("logs file is created!!!!");					
				});

				/* Commit the changes to svn repository */
				const htmlPath = checkoutDir+appManifesto.htmlPath;
				const jsonPath = checkoutDir+appManifesto.jsonPath;
                
				/* Comment the below lines for just avoiding commit to svn and run code locally... */
				if(matchedCpl.html && matchedCpl.html.length){
					if(appManifesto.process == 'CPL'){
						
					}
					await svnJOB.svnConnection(htmlPath,appManifesto,projectname,'html');
					let jsonCommit = await svnJOB.svnConnection(jsonPath,appManifesto,projectname,'json');			
					if(jsonCommit) {
						finalRespcount++;
						return;
					}
				} else {
					finalRespcount++;
					return;
				}

				/* Uncomment the below two lines for just avoiding commit to svn and run code locally... */
				/* finalRespcount++;
				return; */
			}
		} else {
			return false;
		}		
	}
	fetchjson = [];
}

let recur;
let finalRespcount = 0;
let filesList = [];
let options = null;

/* async function excludeFiles(arr, query) {
	return new Promise((resolve,reject)=>{
		return arr.filter(function(el) {
			return el.indexOf(query) == -1
		})
	})	
} */
async function authUser(userInfo,logs,matchedData,widgetsCount){
	messageLogs = logs;
	appManifesto = userInfo;
	options = {
	  url: userInfo.endPoint,
	  auth: {
		user: userInfo.username,
		password: userInfo.password
	  }
	}
	matchedCpl = matchedData;
	matchedFiles = [];

	
	/*  
	/* create directory for svn push */
	const createDir = await svnProcess.createDir(checkoutDirPath);
	console.log(createDir,"  createDir");
	/* Svn connection */
	const svnConnect = await svnProcess.svnConnect(options);
	console.log(svnConnect,"  connection");
	/* Checkout JSON files */
	const fetchJSON = await svnProcess.checkout(options,checkoutDirPath,appManifesto.jsonPath ,'json');
	console.log(fetchJSON,"  JSON FILES ARE FETCHED!!!");
	/* Checkout html files */
	const fetchHTML = await svnProcess.checkout(options,checkoutDirPath,appManifesto.htmlPath,'html');
	//console.log(fetchHTML,"  HTML FILES ARE FETCHED!!!");
	/* const fetchHTML = await justFiles.getFiles();
	console.log(fetchHTML,"   only files"); */
	//return;
	filesList = fetchHTML;
	/* Checkout css files */
	/* const fetchCSS = await svnProcess.checkout(options,checkoutDirPath,'assets/css/','css');
	console.log(fetchCSS,"  CSS FILES ARE FETCHED!!!"); */
	
	/* create directory for audio assets */
	console.log(finalRespcount,"   finalRespcount  ",customIndex,"   widgetsCount  ",widgetsCount);
	if(widgetsCount == 0){
		//if(appManifesto.process == 'CPL'){
			if(appManifesto.process == 'CPL'){
				/* const tempAudioPath = audioCheckoutdirPath+'cpl_audio/';
				console.log(tempAudioPath,"   audiopaths");
				const parentaudioDir = await svnProcess.createDir(audioCheckoutdirPath);
				console.log(parentaudioDir,"  parentaudioDir directory created!!!");
				const audioDir = await svnProcess.createDir(tempAudioPath);
				console.log(audioDir,"  audio directory created!!!"); */
				
				/* Checkout audio files */
				/* const fetchaudioJSON = await svnProcess.checkout(options,audioCheckoutdirPath,appManifesto.audioSrcpath,'audiojson',true,'cpl_audio/');
				console.log(fetchaudioJSON,"  audio json FILES ARE FETCHED!!!"); */
			}
		/* } else { */
			/* checkout config files for reference */
			/* const tempConfigPath = configCheckoutdirPath+'cpl_config/';
			const parentconfigDir = await svnProcess.createDir(configCheckoutdirPath);
			const configDir = await svnProcess.createDir(tempConfigPath);
			console.log(configDir,"  config directory created!!!"); */
	
			/* checkout config temp files */
			/* const fetchconfigJSON = await svnProcess.checkout(options,configCheckoutdirPath,appManifesto.jsonPath,'configjson',true,'cpl_config/');
			console.log(fetchconfigJSON,"  config json FILES ARE FETCHED!!!"); */
		//}
	}
	


	/* let svnconnect = await svnConnect(options); 
	let assetsList = await doCheckout('assets/widget_data/config/','json'); 
	filesList = await doCheckout('s9ml/cards/','html'); 
	let cssList = await doCheckout('assets/css/','css'); */
	let readPath = "../interactionStyle/interaction.css";
	let writePath = checkoutDir+cssDirectory;
	let file = 'interaction.css';
	//writeInteractionCSS(readPath,writePath,file);
	messageLogs.push("***** ----->"+appManifesto.widgetType+"<----- *****");
	messageLogs.push("*************************Log started******************************");
	/* customFiles1 = filesList.filter(function(el) {
		return el.indexOf('6l1_0750_ese_ee1_evidencecommonancestry.html') == -1
	}); */
	/* customFiles1 = filesList; */
	console.log(filesList,"  filesList    ",customFiles1);

	if(customFiles1[customIndex] == undefined) return;
	if(customFiles1[customIndex] && recursiveBoolean){
		if(customIndex < customFiles1.length){
			await processHTMLfiles(customFiles1[customIndex], customIndex);	
			return {'count':finalRespcount,'type':appManifesto.widgetType,'filesList':filesList};
		}
	} else {
		console.log("!!!!");
		return true;
	}
}
module.exports.authUser = authUser;