const fs = require('fs-extra');
let checkoutDirPath = '../project/repo/';
var copy = require('copy');

const copyFile = require('fs-copy-file');


/* copy interaction directory from sass directory */
const interaction_dir_sass_src_path = "../sass_ref/grades3-12/dps_cpl_sd68_814288/sass/interaction/";
const interaction_dir_sass_dest_path = checkoutDirPath+'/assets/sass/interaction/';
fs.copy(interaction_dir_sass_src_path, interaction_dir_sass_dest_path, err =>{
  if(err) return console.error(err);
  console.log('Really interaction directory is copied successfully!');
});

const interaction_dir_sass_src_path_two = "../sass_ref/grades3-12/dps_cpl_sd68_814288/sass/interaction.scss";
const interaction_dir_sass_dest_path_two = checkoutDirPath+'/assets/sass/interaction.scss';
fs.copyFile(interaction_dir_sass_src_path_two, interaction_dir_sass_dest_path_two, err =>{
  if(err) return console.error(err);
  console.log('Really interaction directory is copied successfully!');
});