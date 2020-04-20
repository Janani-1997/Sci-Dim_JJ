const onlyHTML = require('./jsonReplace.js');

const startPoshtml = "../../assets/widgets/ngss-widgets/k2/mcq_text/index.html";
const endPoshtml = "../../assets/modules/hmh.cpl_mcq_multi/widgets/cpl_mcq_multi/index.html" + '" data-version="';
let paramHTMLUpdateVal = onlyHTML.html_false_Update(startPoshtml,endPoshtml,"./cards_dummy/cards/11p2_1103_ese_ur_light_9.html");
console.log(startPoshtml,"   ----    ",endPoshtml,"    ----    ",paramHTMLUpdateVal,"   paramHTMLUpdateVal");