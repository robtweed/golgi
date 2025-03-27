module.exports = function() {
  let optimise_assemblies = require('./optimise_assemblies');

  this.source_folder_def = '/node/assemblies_src';
  this.dest_folder_def = '/node/assemblies';
  this.bundle_filename = 'golgi-assemblies-all.js';

  optimise_assemblies.call(this);

}
