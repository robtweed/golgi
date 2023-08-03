module.exports = function() {
  let optimise_assemblies = require('./optimise_assemblies');

  this.assembly_list = [
    "root_assembly-new",
    "header_assembly",
    "footer_assembly",
    "sidebar_assembly_new",
    "rps_home-new"
  ];

  this.source_folder_def = '/node/rps_assemblies_src';
  this.dest_folder_def = '/node/rps_assemblies';
  this.bundle_filename = 'golgi-assemblies-initial.js';

  optimise_assemblies.call(this);

}
