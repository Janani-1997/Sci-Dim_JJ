const fs = require('fs');
const excelToJson = require('convert-excel-to-json');
function fetchRecord() {
  return new Promise(resolve => {
	const result = excelToJson({
		//sourceFile: './UserAuthDetails.xlsx',
		sourceFile: './UserAuthDetails_nocpl.xlsx',
		//sourceFile: './UserAuthDetails_nocpl_socials.xlsx',
		columnToKey: {
			A: 'endPoint',
			B: 'username',
			C: 'password',
			D: 'widgetType',
			E: 'widgetDirectory',
			F: 'jsonPath',
			G: 'htmlPath',
			H: 'grade',
			I: 'gradeLevel',
      		J: 'process',
			K: 'projectURL',
			L: 'audioSrcpath',
			M: 'sassDirectory',
			N: 'smilDirectory',
			O: 'projectType'
		}
	});
	setTimeout(() => {
		resolve(result.Sheet1);
	}, 2000);
  });
}


async function userDetails(){
	const userInfo = await fetchRecord();
	//console.log(userInfo);
	return userInfo;
}
module.exports.userDetails = userDetails;