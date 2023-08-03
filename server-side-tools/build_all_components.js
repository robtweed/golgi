module.exports = async function() {
  let build_components = require('./build_components');
  this.source_folder_def = '/node/sbadmin_c_src';
  this.dest_folder_def = '/node/sbadmin_c';
  this.bundle_filename = 'golgi-components-all.js';

  build_components.call(this);

}
