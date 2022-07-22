module.exports = async function(fs, ask, mode) {

  const readline = require('readline/promises');
  const uglifyjs = await import('uglify-js');
  fs = fs || this.fs
  ask = ask || this.ask;

  const tf = await import('qewd-transform-json');
  const transform = tf.transform;
  const path = require('node:path');

  const hm = await import('html-minifier');
  const html_min = hm.minify;

  fs.createFile = function(contentArray, filePath) {
    fs.outputFileSync(filePath, contentArray.join('\n'));
  }

  async function run() {

    let helpers = {};

    let ssr_module = [
      "let golgi_components = [];"
    ];

    let tmpl = [
      "export function load() {",
      "  let componentName = '{{name}}';",
      "  let count = -1;",
      "  customElements.define(componentName, class {{componentName}} extends HTMLElement {",
      "    constructor() {",
      "      super();",
      "      count++;",
      "      const html = `{{html}}`;",
      "      this.html = `${html}`;",
      "      this.name = componentName + '-' + count;",
      "      {{constructorCode}}",
      "    }"
      ];

    console.log(' ');
    console.log('This will create Golgi WebComponent files from all source files in a folder');
    let ok = false;
    let def;
    let source_folder_def = "/node/components_src";
    if (mode === 'native') source_folder_def = './components_src';
    let source_folder;

    do {

      source_folder = ask.question('Source folder containing Golgi Component Definition Files (' + source_folder_def + ')');
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

    let dest_folder_def = "/node/components";
    if (mode === 'native') dest_folder_def = './components';
    let dest_folder;
    ok = false;

    do {
      console.log(' ');

      dest_folder = ask.question('Destination folder for optimised WebComponent files (' + dest_folder_def + ')');
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

    let files = fs.readdirSync(source_folder);

    for (const filename of files) {
      if (filename.includes('.mjs')) {
        console.log('compiling ' + filename);
        let wc_path = dest_folder + '/' + filename;
        wc_path = wc_path.split('.mjs')[0] + '.js';
        //try {
          const {def} = await import(source_folder + '/' + filename);

          def.componentName = def.name.replace(/-/g, '_');
          let html = html_min(def.html, {
            collapseWhitespace: true
          });
          def.html = `${html}`;
          if (!def.constructorCode) {
            def.constructorCode = '';
          }
          let contents = transform(tmpl, def, helpers);

          console.log(contents);

          contents.push(`${def.methods}`);
          contents.push("});");
          contents.push("};");

          let content = contents.join('');
          let result = uglifyjs.minify(content);
          fs.createFile([result.code], wc_path);

          let mod_code = result.code.split('export{load};')[0];
          mod_code = "golgi_components.push(" + mod_code + ");";
          ssr_module.push(mod_code);

          console.log(filename + ' compiled ok');
        //}
        //catch(err) {
        //  console.log('*** Error: unable to load ' + filename);
        // console.log(err);
        //}
      }
    }

    ssr_module.push('export {golgi_components}');
    fs.createFile(ssr_module, dest_folder + '/golgi-components.js');
  }

  run();
};