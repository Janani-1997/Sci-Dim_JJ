var fs = require('fs-extra');
const ngssdata = require('../../../app/ngssdata.js');
var finalData, srcdata, src, targdata, mapdata, map, tar, parent_source, parent_target, parent_source_tag, parent_target_tag, mirror_json, mirror_json_target, imagename, previousindex, target_mirror, maplength, counter, assignTarget, parent_key, parent_key_tag,alpha,source_json_path,arr=[];
alpha=['A','B','C','D','E','F','G','H','I','J','K','L','M'];
async function mappingJSON(file, jsonPath, widgetType, projectName, fromEXCEL) {
    source_json_path =jsonPath.split(".");
    console.log(jsonPath, "  mapping");
    jsonPath = "../" + projectName + "/assets/widget_data/config/" + jsonPath;
    srcdata = fs.readFileSync(jsonPath);
    src = JSON.parse(srcdata);
    let widgetSrc = ngssdata['matchingProps'][widgetType];
    debugger;
    let targetPath, mapPath = '';
    if (fromEXCEL.gradeLevel.toLowerCase() === 'kindergarten') {
        targetPath = (widgetSrc['isControlled'] ? widgetSrc['templateKG'][src.configuration[widgetSrc.deciderProp]] : ngssdata['matchingProps'][widgetType]['templateKG']);
        mapPath = (widgetSrc['isControlled'] ? widgetSrc['mappingKG'][src.configuration[widgetSrc.deciderProp]] : ngssdata['matchingProps'][widgetType]['mappingKG']);
    } else {
        targetPath = (widgetSrc['isControlled'] ? widgetSrc['templatePath'][src.configuration[widgetSrc.deciderProp]] : ngssdata['matchingProps'][widgetType]['templatePath']);
        mapPath = (widgetSrc['isControlled'] ? widgetSrc['mappingPath'][src.configuration[widgetSrc.deciderProp]] : ngssdata['matchingProps'][widgetType]['mappingPath']);
    }
    console.log(targetPath, "   ", mapPath);
    targdata = fs.readFileSync(targetPath);
    mapdata = fs.readFileSync(mapPath);
    //console.log(targdata, "  ", mapdata);
    map = JSON.parse(mapdata);
    tar = JSON.parse(targdata);
    parent_source, parent_target;
    parent_source_tag, parent_target_tag;
    mirror_json, mirror_json_target;
    imagename;
    previousindex = {};
    //ddd_bg_mapping_k2.json
    previousindex.len = 0;
    previousindex.name = "";

    target_mirror;
    maplength = map.mapping_data.length;
    counter = 0;
    assignTarget;

    parent_source = map.mapping_data[counter].source_parent_name;
    parent_source_tag = parent_source.split(".");


    //debugger;
    if (counter < maplength) {
        let result = await get_s_data(src, tar, parent_source_tag, counter);
        //console.log(result,"   when  ",counter, "  ",maplength);
        return result;
    }

    //return finalData;
}


// returns the next index of the "currentbuffer" JSON ()
// currentbuffer - JSON returnBuffer
// sPtags - parent information
// mdata - Mapping Data json
// index - current mapping index
// if the currentbuffer length is more than one this should return the next level JSON till the cycle reaches the currentbuffer length
async function assignTargetData(currentBuffer, target, mapdata, counter) {
    debugger;
  if(mapdata[counter].data_type == "audio" && currentBuffer== undefined){
    target[mapdata[counter].target_key_name]=map.assets_config.audio_path+source_json_path[0]+'.json';
  }
  else{
    if (mapdata[counter].iterative == "yes") {



        //console.log(currentBuffer, "           CurrentBuffer")
        //console.log(target, "                  TargetBuffer")
        debugger;
        if (currentBuffer.length) {
            for (var j = 0; j < (currentBuffer.length); j++) {
                if (currentBuffer.length && currentBuffer[j].length) {
                    if ((currentBuffer[j].length * currentBuffer.length) < target.length) {
                      for(q=0;q<currentBuffer[j].length;q++){
                        var split_key=currentBuffer[j][q][mapdata[counter].source_key_name];
                        var split_key_tag=split_key.split("<<");

                      }
                      if(split_key_tag.length>2)
                      {
                        target.splice(split_key_tag.length-1);
                      }
                      else{
                        target.splice((currentBuffer[j].length * currentBuffer.length));
                      }
                        if (currentBuffer[j - 1]) {
                            currentBuffer = currentBuffer[j - 1].concat(currentBuffer[j]);
                        } else if (currentBuffer[j + 1]) {
                            currentBuffer = currentBuffer[j].concat(currentBuffer[j + 1]);
                        }else {
                            currentBuffer = currentBuffer[j];
                        }


                    }
                } else {
                    if ((currentBuffer.length < target.length)) {
                        target.splice(currentBuffer.length);
                    }
                }
                if (target[j]) {
                    if (mapdata[counter].data_type == "index") {
                        for (var i = 0; i < currentBuffer.length; i++) {
                            console.log(currentBuffer[i][mapdata[counter].source_key_name], "           BU");
                            if (currentBuffer[i][mapdata[counter].source_key_name] == true) {
                                target[j][mapdata[counter].target_key_name] = i;
                                return;
                            }
                        }
                    } else if (currentBuffer[j].length > 0) {
                        for (n = 0; n < currentBuffer[j].length; n++) {
                            arr.push(currentBuffer[j][n][mapdata[counter].source_key_name]);
                            console.log(currentBuffer[j][n][mapdata[counter].source_key_name], j, n);
                        }
                        target[j][mapdata[counter].target_key_name] = arr[j];
                        console.log(arr, target)
                    } else if (mapdata[counter].para_tag == "yes" && currentBuffer[j][mapdata[counter].source_key_name] !== "") {
                        if (typeof(target) == "object" && target[j][mapdata[counter].target_key_name] == undefined) {
                            target[j] = '<p class=\"quill-source-editor\">' + currentBuffer[j][mapdata[counter].source_key_name] + '</p>';
                        }else if(mapdata[counter].data_type == "alphatext"){
                          target[j][mapdata[counter].target_key_name]='<p class=\"quill-source-editor\">'+alpha[j]+"."+"  "+ currentBuffer[j][mapdata[counter].source_key_name] + '</p>';
                        }else {
                            if (currentBuffer[j][mapdata[counter].source_key_name] !== undefined) {
                                target[j][mapdata[counter].target_key_name] = '<p class=\"quill-source-editor\">' + currentBuffer[j][mapdata[counter].source_key_name] + '</p>';
                            } else {
                                target[j][mapdata[counter].target_key_name] = "";
                            }
                        }
                    } else {
                        if (mapdata[counter].data_type == "image" && currentBuffer[j][mapdata[counter].source_key_name] !== "") {
                            /* imagename = currentBuffer[j][mapdata[counter].source_key_name];
                            let imgPath = imagename.split("/");
                            target[j][mapdata[counter].target_key_name] = map.assets_config.image_path + imgPath[imgPath.length - 1]; */
                            if(currentBuffer[j][mapdata[counter].source_key_name] !== undefined){
                                imagename = currentBuffer[j][mapdata[counter].source_key_name];
                                let imgPath = imagename.split("/");
                                target[j][mapdata[counter].target_key_name] = map.assets_config.image_path + imgPath[imgPath.length - 1];
                            }
                        } else if (mapdata[counter].difference_in_index == "-1" && target[j][mapdata[counter].target_key_name] !== undefined) {
                            target[j][mapdata[counter].target_key_name] = currentBuffer[j][mapdata[counter].source_key_name] - 1;
                        } else if (mapdata[counter].data_type == "hide" && target[j][mapdata[counter].target_key_name] !== undefined) {
                            if (currentBuffer[j][mapdata[counter].source_key_name] == true) {
                                target[j][mapdata[counter].target_key_name] = false;
                            } else {
                                target[j][mapdata[counter].target_key_name] = true;
                            }
                        }else if(mapdata[counter].data_type == "split_prev_mdq"){

                          parent_key = currentBuffer[j][map.mapping_data[counter].source_key_name];
                          parent_key_tag = parent_key.split("<<");
                          for (var a = 0; a < parent_key_tag.length; a++) {
                              if (parent_key_tag[a].indexOf(">>") > 0) {
                                  console.log(parent_key_tag[a].split(">>")[1], a);
                                  parent_key_tag[a] = parent_key_tag[a].split(">>")[1]
                              };
                          }

                          if (parent_key_tag.length-1 < target.length) {
                              target.splice(parent_key_tag.length-1);
                          }
                          for (m = 0; m < parent_key_tag.length-1; m++) {

                              target[m][mapdata[counter].target_key_name] = parent_key_tag[m];
                          }
                        //  target[j][mapdata[counter].target_key_name]=;
                      } else if(mapdata[counter].data_type == "split_post_mdq"){
                          console.log(mapdata[counter].data_type,"  --mdq--   ",mapdata);
                        debugger;
                        parent_key = currentBuffer[j][map.mapping_data[counter].source_key_name];
                        parent_key_tag = parent_key.split(">>");

                        if (parent_key_tag.length-1 <= target.length) {
                            target.splice(parent_key_tag.length - 1);
                        }
                        target[target.length - 1][mapdata[counter].target_key_name] = parent_key_tag[parent_key_tag.length - 1];
                          console.log("testtttttttttttttttt")
                        //  target[j][mapdata[counter].target_key_name]=;
                        }else if(mapdata[counter].data_type == "alphatext"){
                          target[j][mapdata[counter].target_key_name]=alpha[j]+"."+"  "+ currentBuffer[j][mapdata[counter].source_key_name];
                        } else if (mapdata[counter].data_type == "direction") {
                            if (currentBuffer[j][mapdata[counter].source_key_name] == "RIGHT") {
                                target[j][mapdata[counter].target_key_name] = "pin-right";
                            }
                            if (currentBuffer[j][mapdata[counter].source_key_name] == "LEFT") {
                                target[j][mapdata[counter].target_key_name] = "pin-left";
                            }
                            if (currentBuffer[j][mapdata[counter].source_key_name] == "TOP") {
                                target[j][mapdata[counter].target_key_name] = "pin-top";
                            }
                            if (currentBuffer[j][mapdata[counter].source_key_name] == "DOWN") {
                                target[j][mapdata[counter].target_key_name] = "pin-bottom";
                            }
                        } else if (mapdata[counter].data_type == "targetoption") {
                            if (currentBuffer[j][mapdata[counter].source_key_name] = "Target" + (j + 1)) {
                                target[j][mapdata[counter].target_key_name] = "option_" + (j + 1);
                            }
                        } else if (mapdata[counter].data_type == "checkResponse") {
                            if (currentBuffer[j][mapdata[counter].source_key_name] == true) {
                                target[j][mapdata[counter].target_key_name] = "<p class=\"quill-source-editor\">Well Done.</p>";
                            }else{
                                target[j][mapdata[counter].target_key_name] = "<p class=\"quill-source-editor\">That’s not it.</p>";
                            }
                        }else { // changing the data when there is no information on image path and text node
                            if (target[j][parent_target_tag[parent_target_tag.length - 1]]) {
                                target[j][parent_target_tag[parent_target_tag.length - 1]][mapdata[counter].target_key_name] = currentBuffer[j][mapdata[counter].source_key_name];
                            } else {
                              if(currentBuffer[j][mapdata[counter].source_key_name] !== undefined){
                                target[j][mapdata[counter].target_key_name] = currentBuffer[j][mapdata[counter].source_key_name];
                              }else {
                                target[j][mapdata[counter].target_key_name]="";
                              }
                            }
                        }
                    }
                } else {
                    //target[mapdata[counter].target_key_name] = currentBuffer[j][mapdata[counter].source_key_name];
                    //mirror_json_target[map.mapping_data[i].target_key_name]=mirror_json[j][map.mapping_data[i].source_key_name]
                }
                //console.log(target, "                  TargetBuffer Modified")
            }
        } else {
            if (mapdata[counter].data_type == "split_previous") {
                 parent_key = currentBuffer[map.mapping_data[counter].source_key_name];
                 parent_key_tag = parent_key.split("<<");
                //console.log(parent_key_tag)
                for (var a = 0; a < parent_key_tag.length; a++) {
                    if (parent_key_tag[a].indexOf(">>") > 0) {
                        console.log(parent_key_tag[a].split(">>")[1], a);
                        parent_key_tag[a] = parent_key_tag[a].split(">>")[1]
                    };
                }
                if (parent_key_tag.length < target.length) {
                    target.splice(parent_key_tag.length);
                }
                for (m = 0; m < parent_key_tag.length; m++) {

                    target[m][mapdata[counter].target_key_name] = parent_key_tag[m];
                }
            } else if (mapdata[counter].data_type == "split_post") {
               parent_key = currentBuffer[map.mapping_data[counter].source_key_name];
               parent_key_tag = parent_key.split(">>");

                if (parent_key_tag.length <= target.length) {
                    target.splice(parent_key_tag.length - 1);
                }
                target[target.length - 1][mapdata[counter].target_key_name] = parent_key_tag[parent_key_tag.length - 1];
            } else if (mapdata[counter].data_type == "split_previous_fiq") {
                parent_key = currentBuffer[map.mapping_data[counter].source_key_name];
                parent_key_tag = parent_key.split("</p><p>");
                if (parent_key_tag.length < target.length) {
                    target.splice(parent_key_tag.length);
                }
                for (x = 0; x < parent_key_tag.length; x++) {
                    var s = x + 1;
                    parent_key_tag[x] = parent_key_tag[x].split("&lt;Option" + s + "&gt;")[0];
                    if (parent_key_tag[x].split("<p>")[1] != undefined) {
                        target[x][mapdata[counter].target_key_name] = parent_key_tag[x].split("<p>")[1];
                    }
                    else {
                        target[x][mapdata[counter].target_key_name] = parent_key_tag[x];
                    }
                }
            } else if (mapdata[counter].data_type == "split_post_fiq") {
               parent_key = currentBuffer[map.mapping_data[counter].source_key_name];
               parent_key_tag = parent_key.split("</p><p>");
                if (parent_key_tag.length < target.length) {
                    target.splice(parent_key_tag.length);
                }
                for (x = 0; x < parent_key_tag.length; x++) {
                    var s = x + 1;
                    parent_key_tag[x] = parent_key_tag[x].split("&lt;Option" + s + "&gt;")[1];
                    if (parent_key_tag[x].split("</p>")[0] != undefined) {
                        target[x][mapdata[counter].target_key_name] = parent_key_tag[x].split("</p>")[0];
                    }
                    else {
                        target[x][mapdata[counter].target_key_name] = parent_key_tag[x];
                    }
                }
            }
        }
    } else {
        if (mapdata[counter].para_tag == "yes" && currentBuffer[mapdata[counter].source_key_name] !== "") {
            target[mapdata[counter].target_key_name] = '<p class=\"quill-source-editor\">' + currentBuffer[mapdata[counter].source_key_name] + '</p>';
        } else {
            if (mapdata[counter].data_type == "image" && currentBuffer[mapdata[counter].source_key_name] !== "") {
                imagename = currentBuffer[mapdata[counter].source_key_name];
                let imgPath = imagename.split("/");
                target[mapdata[counter].target_key_name] = map.assets_config.image_path + imgPath[imgPath.length - 1];
            } else { // changing the data when there is no information on image path and text node
                if (mapdata[counter].data_type == "optiontype") {
                    if (currentBuffer[mapdata[counter].source_key_name] == true) {
                        target[mapdata[counter].target_key_name] = "image";
                    } else {
                        target[mapdata[counter].target_key_name] = "text"
                    }
                } else if (mapdata[counter].data_type == "number") {
                    target[mapdata[counter].target_key_name] = parseInt(currentBuffer[mapdata[counter].source_key_name]);
                }else if (mapdata[counter].data_type == "hotspot") {
                  if(currentBuffer[mapdata[counter].source_key_name]=="PL")
                  {
                      target[mapdata[counter].target_key_name] = "Letter" ;
                  }
                  else if(currentBuffer[mapdata[counter].source_key_name]=="PN")
                  {
                      target[mapdata[counter].target_key_name] = "Number" ;
                  }
                  else{
                    target[mapdata[counter].target_key_name] = "none";
                  }
                } else {
                    console.log("undefined error orginated from   ",currentBuffer,"  ",mapdata[counter],"   ");
                    target[mapdata[counter].target_key_name] = currentBuffer[mapdata[counter].source_key_name];
                }
            }
        }
    }
}
    return true;
}

async function getparentLength(source_parent) {
    return source_parent.length;
};
//return JSON.stringify(tar);
async function get_s_data(src, tar, source_parent, counter) {

    if (counter == maplength) {
        console.log(tar);
        //debugger;
        //fs.writeFileSync('mdq_simple_cpl.json', JSON.stringify(tar));
        return JSON.stringify(tar);
        process.exit();
    }
    let parentLen = await getparentLength(source_parent);

    parent_source = map.mapping_data[counter].source_parent_name;
    parent_source_tag = parent_source.split(".");

    parent_target = map.mapping_data[counter].target_parent_name;
    parent_target_tag = parent_target.split(".");

    target_mirror = {};
    mirror_json = {};
    previousindex = {};
    previousindex.len = 0;
    previousindex.name = "";
    //console.log(counter,"                   Counter");
    // console.log(maplength,"               maplength");
    if (counter < maplength) {
        if (parent_source_tag.length >= 1) {
            for (k = 0; k < parent_source_tag.length; k++) {
                if (k == 0) {
                    mirror_json = src[parent_source_tag[k]];
                    if (parent_source_tag.length == 1) { // check the source parent length is equal to one index
                        if (map.mapping_data[counter].target_parent_name != "") {
                            if (parent_target_tag.length == 1) { // check the target parent length is equal to one index
                                target_mirror = tar[parent_target_tag[0]];
                                assignTarget = await assignTargetData(mirror_json, target_mirror, map.mapping_data, counter);
                            } else { // check the target parent length is more than one index
                                //console.log("One Source Parent Level and One or More Target Parent Level");
                                for (var i = 0; i < parent_target_tag.length; i++) { // check the target parent length is more than one index for get the sub level json node
                                    if (i == 0) { // form the target JSON to assign Target data
                                        target_mirror = tar[parent_target_tag[i]];
                                        if (i == parent_target_tag.length - 1) { // calling assignTarget function when the length of the target parent is one;
                                            assignTarget = await assignTargetData(mirror_json, target_mirror, map.mapping_data, counter);
                                        }
                                    } else {
                                        target_mirror = target_mirror[parent_target_tag[i]];
                                        if (i == parent_target_tag.length - 1) { // check the length of the target parent and if reaches the maximum execute assign data
                                            assignTarget = await assignTargetData(mirror_json, target_mirror, map.mapping_data, counter); // calling assignTarget function when the length of the target parent more than one;
                                        }
                                    }
                                }
                            }
                        } else {
                            assignTarget = await assignTargetData(mirror_json, tar, map.mapping_data, counter);
                        }
                    }
                } else {
                    if (mirror_json) { //check if the child is available in the existing mirror JSON (the parent_source_tag[k] referes the parent name from the array)
                        if (mirror_json) {
                            //debugger;
                            if (mirror_json[parent_source_tag[k]].length != undefined) {

                                if (k != (parent_source_tag.length - 1)) {
                                    //debugger;
                                    previousindex.len = mirror_json[parent_source_tag[k]].length;
                                    previousindex.name = parent_source_tag[k];
                                    previousindex.data = mirror_json[parent_source_tag[k]];
                                } else if (k == (parent_source_tag.length - 1)) {
                                    //debugger;
                                    //previousindex.len = 0;
                                    //previousindex.name = parent_source_tag[k];
                                    //previousindex.data = mirror_json[parent_source_tag[k]];
                                    mirror_json = mirror_json[parent_source_tag[k]];
                                }
                            } else {
                                //debugger;
                                mirror_json = mirror_json[parent_source_tag[k]];
                            }
                            if (previousindex.len > 0 && previousindex.name != parent_source_tag[k]) {
                                //debugger;
                                //mirror_json = mirror_json[parent_source_tag[k]];
                            } else if (previousindex.len > 0 && k == (parent_source_tag.length - 1)) { // cycle if the options is the last parent
                                //debugger;
                                mirror_json = mirror_json[parent_source_tag[k]]; //- commented today (may 23)
                            } else if (previousindex.len > 0 && k != (parent_source_tag.length - 1)) { // cycle if the cells is the last parent
                                //debugger;
                                mirror_json = mirror_json[parent_source_tag[k]][0];
                            }
                            if (k == parent_source_tag.length - 1) { // check if pranent level reaches the length (typically works for first level)
                                //debugger;
                                for (var i = 0; i < parent_target_tag.length; i++) { // check the target parent length is more than one index for get the sub level json node
                                    if (i == 0) { // form the target JSON to assign Target data

                                        if (parent_target_tag[i] != "") {
                                            target_mirror = tar[parent_target_tag[i]];
                                        } else {
                                            target_mirror = tar;
                                        }
                                        if (i == parent_target_tag.length - 1) { // calling assignTarget function when the length of the target parent is one;
                                            //debugger;
                                            if (previousindex.len > 0) {
                                                for (var e = 0; e < previousindex.len; e++) {
                                                    //debugger;
                                                    //target_mirror = previousindex.targetdata[e][parent_target_tag[i]]; // i represents child loop - target parent length
                                                    if (map.mapping_data[counter].data_type == "index") {
                                                        if (target_mirror.length < previousindex.len) {
                                                            target_mirror.splice(previousindex.len);
                                                        }
                                                    }
                                                    previousindex.targetdata = [];
                                                    previousindex.targetdata.push(target_mirror[e]);
                                                    assignTarget = await assignTargetData(previousindex.data[e][parent_source_tag[k]], previousindex.targetdata, map.mapping_data, counter); // calling assignTarget function when the length of the target parent more than one;
                                                }
                                            } else {
                                                assignTarget = await assignTargetData(mirror_json, target_mirror, map.mapping_data, counter);
                                            }
                                        }
                                    } else {
                                        //debugger;
                                        if (target_mirror.length != undefined) {
                                            previousindex.targetdata = target_mirror;

                                            //debugger;

                                            if (map.mapping_data[counter].target_key_name == parent_target_tag[i]) {
                                                previousindex.targetdata = target_mirror;
                                                target_mirror = target_mirror;
                                            } else {
                                                target_mirror = target_mirror[0][parent_target_tag[i]];
                                            }
                                        } else {
                                            //debugger;
                                            previousindex.targetdata = target_mirror[parent_target_tag[i]];
                                            target_mirror = target_mirror[parent_target_tag[i]];
                                        }
                                        if (i == parent_target_tag.length - 1) { // check the length of the target parent and if reaches the maximum execute assign data
                                            //debugger;
                                            if (previousindex.len > 0) {
                                                for (var e = 0; e < previousindex.len; e++) {
                                                    //debugger;
                                                    target_mirror = previousindex.targetdata[e][parent_target_tag[i]]; // i represents child loop - target parent length
                                                    assignTarget = await assignTargetData(previousindex.data[e][parent_source_tag[k]], target_mirror, map.mapping_data, counter); // calling assignTarget function when the length of the target parent more than one;
                                                }
                                            } else {
                                                //debugger;
                                                if (previousindex.targetdata.length > 0) {
                                                    target_mirror = previousindex.targetdata;
                                                    if (mirror_json.length < target_mirror.length) {
                                                        target_mirror.splice(mirror_json.length);
                                                    }
                                                    for (z = 0; z < mirror_json.length; z++) {

                                                        assignTarget = await assignTargetData(mirror_json, target_mirror, map.mapping_data, counter);
                                                    }
                                                } else {
                                                    target_mirror = previousindex.targetdata;
                                                    //debugger;
                                                    assignTarget = await assignTargetData(mirror_json, target_mirror, map.mapping_data, counter); // calling assignTarget function when the length of the target parent more than one;
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {}
                        } else {
                            mirror_json = mirror_json[parent_source_tag[k]];
                        }
                    }
                }
            }
        }

        if (counter == maplength) {
            //console.log("ALL DONE");
            //console.log(tar);
        } else if (counter < maplength) {
            counter++;
            return get_s_data(src, tar, parent_source_tag, counter);
        }

    } else {
        console.log("done")
    }
}

module.exports.mappingJSON = mappingJSON;
