const fs = require('fs-extra');
const ask = require('readline-sync');


let build = require('./build_components');
build(fs, ask, 'native');
