const fs = require('fs-extra');
const ask = require('readline-sync');


let optimise = require('./optimise_assemblies');
optimise(fs, ask, 'native');
