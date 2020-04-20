// Require library
var excel = require('excel4node');


var workbook = new excel.Workbook();
var worksheet = workbook.addWorksheet('Sheet 1');
var worksheet2 = workbook.addWorksheet('Sheet 2');
createSheet = async() =>{
    
    
    worksheet.cell(1,1).string('Project Name');
	worksheet.cell(1,2).string('Widget Name');
    worksheet.cell(1,3).string('Process Name');
    worksheet.cell(1,4).string('Affected pages');
    workbook.write('logs.xlsx');
   /*  var dummyArr = [1,2,3,4,5,6,7,8];
    dummyArr.forEach(function(item,index){
        fillData(index,'xyz'+index,'cpl','linksssssssssssssssssss','3 minutes');
    }) */
}
fillData = async(ind="<===>",projectName="",widgetType,processName,links,timeConsumption,fileName) =>{
	console.log("log information");
    worksheet.cell(ind+2,1).string(projectName);
	worksheet.cell(ind+2,2).string(widgetType);
    worksheet.cell(ind+2,3).string(processName);
    worksheet.cell(ind+2,4).string(links);
    workbook.write(fileName+'.xlsx');
	console.log("log sheet final index is   ",ind);
    return ind;
}

createSheet();
//fillData();
module.exports.writeSheet = fillData;