var fs = require('fs');

var counter = 0;
var src_array = 0;
var tar_array = 0;
var temp = 0;
var temp1 = 0;
var temp_2 = 0;
var buff_array = new Array();
var buff_array_mod = new Array();
var tar_buff_array = new Array();

async function audio_map(currentbuffer, map_data, target) {
    //return new Promise((resolve,reject)=> {
      if (counter < map_data.length) {
          var parent_tag_1 = map_data[counter].parent_name_1
          var parent_split_1 = parent_tag_1.split(".");
          var parent_tag_2 = map_data[counter].parent_name_2
          var parent_split_2 = parent_tag_2.split(".");
          var diff = map_data[counter].difference_in_index;
          var diff_split = diff.split(".");
          var map_tag = map_data[counter].data_type;
          var map_tag_split = map_tag.split(".");
          if (map_data[counter].data_type == "srcpath") {
              for (i = 0; i < target[parent_split_1[0]].length; i++) {
                  target[parent_split_1[0]][i][parent_split_1[1]] = "../" + currentbuffer[parent_split_1[0]][0][parent_split_1[1]];
              }
          } else {
              for (j = 0; j < currentbuffer[parent_split_1[0]].length; j++) {
                  if (map_data[counter].iterative == "yes") {
                      var mirror_1 = currentbuffer[parent_split_1[0]][j][map_data[counter].reference_name];
                      var mirror_split_1 = mirror_1.split("-");
                      if (((map_data[counter].source_key_name == mirror_split_1[0]) || (map_data[counter].source_key_name == mirror_split_1[0] + "-" + mirror_split_1[1])) ) {
                        if((mirror_split_1[1] !== undefined)){
                          temp++;
                          buff_array.push(j);
                          //console.log(buff_array);
                        }else{
                          if(map_data[counter].source_key_name == mirror_split_1){

                            if(mirror_split_1[0] !== "title"){
                              if(map_data[counter].source_key_name == mirror_split_1[0]){
                                temp=1;
                                buff_array.push(j);
                              }
                            }else{
                              temp=0;
                            }
                          }else{
                            temp++;
                            buff_array.push(j);
                            //console.log(buff_array);
                          }

                        }

                      }
                  }
                  if (map_data[counter].source_key_name == currentbuffer[parent_split_1[0]][j][map_data[counter].reference_name]) {
                      src_array = j;
                  }
              }
              for (m = 0; m < target[parent_split_1[0]].length; m++) {
                  if (map_data[counter].iterative == "yes" ) {
                      var mirror_2 = target[parent_split_1[0]][m][map_data[counter].reference_name];
                      var mirror_split_2 = mirror_2.split("-");
                      if (map_data[counter].target_key_name == mirror_split_2[0] && mirror_split_1[1]) {
                          if (currentbuffer[diff_split[0]]) {
                              for (p = 0; p < currentbuffer[diff_split[0]].length; p++) {
                                  var mirror_map = currentbuffer[diff_split[0]][p][map_data[counter].reference_name];
                                  var mirror_map_split = mirror_map.split("-");
                                  if (map_tag_split[1]) {
                                      if (map_tag_split[1] + "-" + mirror_map_split[1] == currentbuffer[diff_split[0]][p][diff_split[1]]) {
                                          temp_2++;

                                      }
                                  }
                              }
                          }
                          //console.log("sjjjjjj", temp_2)
                          if (temp < temp_2) {
                              if (mirror_split_2[1] > temp_2 - 1) {

                                  target[parent_split_1[0]].splice(m, 10 - temp_2)
                              } else {
                                  tar_buff_array.push(m);
                                  tar_buff_array.push(m);
                                  //console.log("tar_buff_array", tar_buff_array);
                                  //console.log("buff_array_mod", target[parent_split_1[0]][m]);
                              }
                          }
                          else {
                            if ((mirror_split_2[1] > temp - 1 || mirror_split_2[0] > temp - 1) && (mirror_split_2[2]==undefined)) {

                                target[parent_split_1[0]].splice(m, 10 - temp)


                            } else{
                              tar_buff_array.push(m);
                            }
                          }
                          temp_2 = 0;
                      }
                  }
                  if (target[parent_split_1[0]][m] !== undefined) {
                      if (map_data[counter].target_key_name == target[parent_split_1[0]][m][map_data[counter].reference_name]) {
                          tar_array = m;
                      }
                  } else {
                      target[parent_split_1[0]].splice(m, 1)
                  }
              }
              if (map_data[counter].iterative == "yes") {
                  for (s = 0; s < buff_array.length; s++) {
                      if (map_data[counter].source_key_name !== "") {
                          if (map_data[counter].source_key_name + '-' + s == currentbuffer[parent_split_1[0]][buff_array[s]][map_data[counter].reference_name] || map_data[counter].source_key_name == currentbuffer[parent_split_1[0]][buff_array[s]][map_data[counter].reference_name]) {
                              // console.log("src", s)
                              if (map_data[counter].target_key_name + '-' + s == target[parent_split_1[0]][tar_buff_array[s]][map_data[counter].reference_name] || map_data[counter].target_key_name == target[parent_split_1[0]][tar_buff_array[s]][map_data[counter].reference_name]) {

                                  var add_num_1 = currentbuffer[parent_split_1[0]][buff_array[s]][parent_split_1[1]]
                                  var add_num_split_1 = add_num_1.split(".");
                                  var add_num_2 = currentbuffer[parent_split_2[0]][buff_array[s]][parent_split_2[1]]
                                  var add_num_split_2 = add_num_2.split(".");
                                  if (tar_buff_array.length > buff_array.length) {
                                      for (a = 0; a < tar_buff_array.length; a++) {
                                          if (add_num_split_1[1] - add_num_split_2[1] == 0) {

                                              add_num_split_2[1] = parseInt(add_num_split_2[1])+1;
                                              //console.log(add_num_split_2[1][add_num_split_2[1].length - 1], add_num_split_2[1]);
                                              target[parent_split_1[0]][tar_buff_array[s]][parent_split_1[1]] = currentbuffer[parent_split_1[0]][buff_array[s]][parent_split_1[1]];
                                              target[parent_split_2[0]][tar_buff_array[s]][parent_split_2[1]] = add_num_split_2[0] + "." + add_num_split_2[1];
                                          } else {
                                              target[parent_split_1[0]][tar_buff_array[a]][parent_split_1[1]] = currentbuffer[parent_split_1[0]][buff_array[s]][parent_split_1[1]];
                                              target[parent_split_2[0]][tar_buff_array[a]][parent_split_2[1]] = currentbuffer[parent_split_2[0]][buff_array[s]][parent_split_2[1]];
                                          }
                                      }
                                  } else {


                                      if (add_num_split_1[1] - add_num_split_2[1] == 0) {

                                          add_num_split_2[1] = parseInt(add_num_split_2[1])+1;
                                          //console.log(add_num_split_2[1][add_num_split_2[1].length - 1], add_num_split_2[1]);
                                          target[parent_split_1[0]][tar_buff_array[s]][parent_split_1[1]] = currentbuffer[parent_split_1[0]][buff_array[s]][parent_split_1[1]];
                                          target[parent_split_2[0]][tar_buff_array[s]][parent_split_2[1]] = add_num_split_2[0] + "." + add_num_split_2[1];
                                      } else {
                                          target[parent_split_1[0]][tar_buff_array[s]][parent_split_1[1]] = currentbuffer[parent_split_1[0]][buff_array[s]][parent_split_1[1]];
                                          target[parent_split_2[0]][tar_buff_array[s]][parent_split_2[1]] = currentbuffer[parent_split_2[0]][buff_array[s]][parent_split_2[1]];
                                      }
                                  }
                              }
                          }
                      } else {
                          target[parent_split_1[0]].splice(r, 1)
                      }
                  }
                  if (map_data[counter].data_type == "double_iterative") {
                      // console.log("double_iterative")

                      for (r = 0; r < target[parent_split_1[0]].length; r++) {
                          var tag = target[parent_split_1[0]][r][map_data[counter].reference_name]
                          var tag_split = tag.split("-");

                          if (target[parent_split_1[0]][r][map_data[counter].reference_name] == map_data[counter].target_key_name + "-" + tag_split[1] + "-" + tag_split[2]) {

                              if ((tag_split[1] < mirror_split_1[1] || tag_split[1] == mirror_split_1[1]) && (tag_split[2] < mirror_split_1[2] || tag_split[2] == mirror_split_1[2])) {
                                  //console.log(r, mirror_split_1[1], mirror_split_1[2], tag_split[1], tag_split[2])
                                  //console.log(buff_array, "buff_array")
                                  for (s = 0; s < buff_array.length; s++) {
                                    var add_num_1 = currentbuffer[parent_split_1[0]][buff_array[s]][parent_split_1[1]]
                                    var add_num_split_1 = add_num_1.split(".");
                                    var add_num_2 = currentbuffer[parent_split_2[0]][buff_array[s]][parent_split_2[1]]
                                    var add_num_split_2 = add_num_2.split(".");

                                    if (add_num_split_1[1] - add_num_split_2[1] == 0) {

                                        add_num_split_2[1] = parseInt(add_num_split_2[1])+1;
                                        //console.log(add_num_split_2[1][add_num_split_2[1].length - 1], add_num_split_2[1]);
                                        if(target[parent_split_1[0]][tar_buff_array[s]]){
                                            target[parent_split_1[0]][tar_buff_array[s]][parent_split_1[1]] = currentbuffer[parent_split_1[0]][buff_array[s]][parent_split_1[1]];
                                            target[parent_split_2[0]][tar_buff_array[s]][parent_split_2[1]] = add_num_split_2[0] + "." + add_num_split_2[1];
                                        }
                                    } else {
                                      target[parent_split_1[0]][tar_buff_array[s]][parent_split_1[1]] = currentbuffer[parent_split_1[0]][buff_array[s]][parent_split_1[1]];
                                      target[parent_split_2[0]][tar_buff_array[s]][parent_split_2[1]] = currentbuffer[parent_split_2[0]][buff_array[s]][parent_split_2[1]];
                                    }

                                  }
                              } else {
                                  target[parent_split_1[0]].splice(r,1)
                                  r = 0
                              }
                          }
                      }
                  }
                  if (currentbuffer[diff_split[0]]) {
                      for (p = 0; p < currentbuffer[diff_split[0]].length; p++) {
                          var mirror_map = currentbuffer[diff_split[0]][p][map_data[counter].reference_name];
                          var mirror_map_split = mirror_map.split("-");
                          if (map_tag_split[1]) {
                              if (map_tag_split[1] + "-" + mirror_map_split[1] == currentbuffer[diff_split[0]][p][diff_split[1]]) {
                                  temp_2++;
                              }
                          }
                      }
                  }
                  if (target[diff_split[0]].length > 1) {
                      for (k = 0; k < target[diff_split[0]].length; k++) {
                          var temp_spl = target[diff_split[0]][k][diff_split[1]];
                          var temp_split = temp_spl.split("-");
                          if (diff_split[2] && target[diff_split[0]][k][diff_split[2]].length > 1) {
                              //console.log("split 2 happens", diff_split[2])
                              for (n = 0; n < target[diff_split[0]][k][diff_split[2]].length; n++) {
                                  var temp_diff = target[diff_split[0]][k][diff_split[2]][n];
                                  var temp_diff_split = temp_diff.split("-")
                                  if (map_data[counter].target_key_name == temp_diff_split[0]) {
                                      //console.log(target[diff_split[0]][k][diff_split[2]][n])
                                      if(temp_diff_split[2]){
                                        if((temp_diff_split[1] > mirror_split_1[1] ) || (temp_diff_split[2]>mirror_split_1[2] )){
                                          target[diff_split[0]][k][diff_split[2]].splice(n,1);
                                          n=0
                                        }
                                      }else{
                                        if (temp < temp_2) {
                                            if (temp_diff_split[1] > temp_2 - 1) {

                                                target[diff_split[0]][k][diff_split[2]].splice(n, 10 - temp_2)
                                            }
                                        }
                                         else if (temp_diff_split[1] > temp - 1) {
                                            target[diff_split[0]][k][diff_split[2]].splice(n, 10 - temp)
                                        }
                                      }
                                  }
                              }
                          } else {
                              if (map_data[counter].data_type == temp_split[0] || map_data[counter].data_type == temp_split[0] + "-" + temp_split[1]) {
                                  //console.log(target[diff_split[0]][k][diff_split[1]])
                                  if (temp_split[1] > temp - 1 || (temp_split[1].length > 1 && temp_split[2] > temp - 1)) {
                                      target[diff_split[0]].splice(k, 10 - temp)
                                  }
                              }
                          }
                      }
                  }
                  temp = 0;
                  temp_2 = 0;
                  buff_array = [];
                  tar_buff_array = [];
              } else {
                  if (map_data[counter].source_key_name == "") {
                      target[parent_split_1[0]].splice(1)
                  } else {
                      var add_num_1 = currentbuffer[parent_split_1[0]][src_array][parent_split_1[1]]
                      var add_num_split_1 = add_num_1.split(".");
                      var add_num_2 = currentbuffer[parent_split_2[0]][src_array][parent_split_2[1]]
                      var add_num_split_2 = add_num_2.split(".");

                      if (add_num_split_1[1] - add_num_split_2[1] == 0) {

                          add_num_split_2[1] = parseInt(add_num_split_2[1])+1;

                          target[parent_split_1[0]][tar_array][parent_split_1[1]] = currentbuffer[parent_split_1[0]][src_array][parent_split_1[1]];
                          target[parent_split_2[0]][tar_array][parent_split_2[1]] = add_num_split_2[0] + "." + add_num_split_2[1];
                      } else {
                          target[parent_split_1[0]][tar_array][parent_split_1[1]] = currentbuffer[parent_split_1[0]][src_array][parent_split_1[1]];
                          target[parent_split_2[0]][tar_array][parent_split_2[1]] = currentbuffer[parent_split_2[0]][src_array][parent_split_2[1]];
                      }
                  }
              }
          }
          //console.log(src_array, tar_array);
          counter++;
          //resolve(src, map.mapping_data, tar);
          //console.log(target,"   target inside counter  <<<");
          return audio_map(currentbuffer, map_data, target);
      } else {
          console.log(counter," counter and mapping data   ",map_data.length);
        //console.log(counter,"  ----- ",map_data.length);
        //console.log("test   ",tar);
        //console.log(target,"   target else condition counter  <<<");
        return target;
        //resolve(tar);
      }
  //  })

}

let initialCall = async(src_ngss,map_audio,tar_audio) => {
    counter = 0;
	//console.log(src_ngss,"  ---   ",map_audio,"  ---   ",tar_audio);
	var srcdata = fs.readFileSync(src_ngss);
	var src = JSON.parse(srcdata);

	var mapdata = fs.readFileSync(map_audio);
	var map = JSON.parse(mapdata);

	var tardata = fs.readFileSync(tar_audio);
	var tar = JSON.parse(tardata);
  	let finalData = await audio_map(src, map.mapping_data, tar);
  	//console.log("final result is  ",finalData);
  	return JSON.stringify(finalData);
}

/* initialCall();

fs.writeFileSync('ag_cpl_audio_G3_12.json', JSON.stringify(tar)); */

module.exports.mapping = initialCall;