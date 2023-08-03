let fs = require('fs-extra');
const ask = require('readline-sync');

let ctx = {};

const build_components = require('./build_components');
ctx.source_folder_def = './sbadmin_c_src';
ctx.dest_folder_def = './sbadmin_c';
ctx.bundle_filename = 'golgi-components-all.js';

build_components.call(ctx, fs, ask, 'native');
