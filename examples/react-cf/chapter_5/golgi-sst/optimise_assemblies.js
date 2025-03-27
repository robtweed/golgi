module.exports = async function(fs, ask, mode, assembly_list, source_folder_def, dest_folder_def, bundle_filename) {

  const readline = require('readline/promises');
  const uglifyjs = await import('uglify-js');
  fs = fs || this.fs
  ask = ask || this.ask;
  assembly_list = assembly_list || this.assembly_list;

  source_folder_def = source_folder_def || this.source_folder_def;
  if (!source_folder_def) {
    if (mode === 'native') {
      source_folder_def = './assemblies_src'
    }
    else {
      source_folder_def = '/node/assemblies_src';
    }
  }
  dest_folder_def = dest_folder_def || this.dest_folder_def;
  if (!dest_folder_def) {
    if (mode === 'native') {
      dest_folder_def = './assemblies'
    }
    else {
      dest_folder_def = '/node/assemblies';
    }
  }
  bundle_filename = bundle_filename || this.bundle_filename || 'golgi-assemblies.js';

  fs.createFile = function(contentArray, filePath) {
    fs.outputFileSync(filePath, contentArray.join('\n'));
  }

  // dummy version of Mutation Observer to allow Golgi to load
  global.MutationObserver = function(props) {
    this.props = props;
  };

  // Node.js emulation of DOMParser, to allow Golgi's parser to work in Node
  const { JSDOM } = await import("jsdom");
  global.DOMParser = new JSDOM().window.DOMParser

  const {golgi} = await import('golgi');

  async function run() {

    console.log(' ');
    console.log('This will create optimised Assembly files from all standard Golgi Assembly source files in a folder');

    let ok = false;
    let def;
    //let source_folder_def = "/node/assemblies_src";
    //if (mode === 'native') source_folder_def = './assemblies_src';
    let source_folder;

    let ssr_module = [
      "let golgi_assemblies = [];"
    ];

    do {

      source_folder = ask.question('Source folder containing Golgi Assembly Files (' + source_folder_def + ')');
      if (source_folder === '') {
        source_folder = source_folder_def;
      }
      if (!fs.existsSync(source_folder)) {
        console.log('*** Error: No such folder: ' + source_folder);
      }
      else {
        ok = true;
      }
    } while (!ok);

    //let dest_folder_def = "/node/assemblies";
    //if (mode === 'native') dest_folder_def = './assemblies';
    let dest_folder;
    ok = false;

    do {
      console.log(' ');

      dest_folder = ask.question('Destination folder for optimised output files (' + dest_folder_def + ')');
      if (dest_folder === '') {
        dest_folder = dest_folder_def;
      }
      if (!fs.existsSync(dest_folder)) {
        console.log('*** Folder ' + dest_folder + ' does not exist.  Creating it...');
        fs.mkdirSync(dest_folder);
      }
      else {
        ok = true;
      }
    } while (!ok);

    console.log('Compiling files in ' + source_folder + '...');

    //let files = fs.readdirSync(source_folder);

    let files;
    if (assembly_list) {
      assembly_list.forEach(function(name, index) {
        if (!name.includes('.mjs')) {
          name = name + '.mjs';
        }
        assembly_list[index] = name;
      });
      files = assembly_list;
    }
    else {
      files = fs.readdirSync(source_folder);
    }

    for (const filename of files) {
      let output_file = dest_folder + '/' + filename;
      let assemblyName = filename.split('.mjs')[0];
      output_file = output_file.split('.mjs')[0] + '.js';
      try {
        const {load} = await import(source_folder + '/' + filename);
        const {gx, hooks} = load();

        console.log('compiling ' + source_folder + '/' + filename);

        let json = golgi.parse(gx, hooks);
        //json[0].assemblyName = assemblyName;

        console.log(JSON.stringify(json, null, 2));

        let txt = 'const gjson=';

        function outputComponent(json) {
          txt = txt + '{';
          let comma = '';
          const allowedProps = [
            'componentName', 'state', 'assemblyName', 'script', 'attributes', 'textContent', 'childElementCount', 'targetElement'
          ];
          json.assemblyName = assemblyName;
          let componentName;
          let hookName;
          for (let prop in json) {
            if (allowedProps.includes(prop)) {
              txt = txt + comma + prop + ': ' + JSON.stringify(json[prop]);
              comma = ',';
              if (prop === 'componentName') componentName = json.componentName;
              if (prop === 'state' && json.state['golgi:hook']) {
                hookName = json.state['golgi:hook'];
              }
            }
            if (prop === 'children' && json.children.length > 0) {
              txt = txt + comma + 'children: [';
              let ccma='';
              json.children.forEach(function(child) {
                txt = txt + ccma;
                ccma = ',';
                outputComponent(child);
              });
              txt = txt + ']';
              comma = ',';
            }
            if (prop === 'hook') {
              txt = txt + comma + 'hook: ' + json[prop].toString();
              comma = ','
              delete hooks[componentName][hookName];
            }
            if (prop === 'state_map') {
              txt = txt + comma + prop + ': new Map([';
              let theMap = json[prop];
              let cma = '';
              theMap.forEach(function(value, key) {
                txt = txt + "['" + key + "','" + value + "']" + cma;
                cma = ',';
              });
              txt = txt + '])';
            }
          }
          txt = txt + '}';
        }

        if (json.length === 1) {
          outputComponent(json[0]);
        }
        else {
          txt = txt + '[';
          let xcma='';
          json.forEach(function(obj) {
            txt = txt + xcma;
            outputComponent(obj);
            xcma=',';
          });
          txt = txt + ']';
        }

        console.log('*** Remaining hooks: ' );

        let otherFns = false;
        let names ={};
        for (let name in hooks) {
          for (let name2 in hooks[name]) {
            otherFns = true;
            names[name] = true;
          }
        }
        let otherHooks = '';
        if (otherFns) {
          otherHooks = 'let hooks = {';
          let cma = '';
          for (let name in names) {
            otherHooks = otherHooks + cma + '"' + name + '": {'
            let cma2 = '';
            for (let name2 in hooks[name]) {
              otherHooks = otherHooks + cma2 + '"' + name2 + '": ' + hooks[name][name2].toString();
              cma2 = ',';
            }
            otherHooks = otherHooks + '}';
            cma = ',';
          }
          otherHooks = otherHooks + '};';
          console.log(otherHooks);
        }


        console.log('-----');

        //txt = txt + JSON.stringify(json);

        txt = txt + ';';

        console.log('**** txt = ' + txt);

        let code = [];
        code.push('export function load(ctx) {');
        if (otherHooks !== '') code.push(otherHooks);
        code.push(txt);
        code.push('return {gjson};');
        code.push('};');

        let content = code.join('');
        let result = uglifyjs.minify(content);
        fs.createFile([result.code], output_file);
        //fs.createFile(code, output_file);

        let mod_code = result.code.split('export{load};')[0];
        //mod_code = "golgi_assemblies.push({name:'" + assemblyName + "',code:" + mod_code + "});";
        mod_code = "golgi_assemblies.push({n:'" + assemblyName + "',c:" + mod_code + "});";
        ssr_module.push(mod_code);

        console.log(filename + ' compiled ok');
      }
      catch(err) {
        console.log('*** Error: unable to import assembly file ' + filename);
        console.log(err);
      }
    }
    ssr_module.push('export {golgi_assemblies}');
    fs.createFile(ssr_module, dest_folder + '/' + bundle_filename);

  }

  run();

};








