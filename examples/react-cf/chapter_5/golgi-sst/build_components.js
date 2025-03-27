module.exports = async function(fs, ask, mode, component_list, source_folder_def, dest_folder_def, bundle_filename) {

  const readline = require('readline/promises');
  const uglifyjs = await import('uglify-js');
  fs = fs || this.fs;

  ask = ask || this.ask;

  component_list = component_list || this.component_list;
  source_folder_def = source_folder_def || this.source_folder_def;
  if (!source_folder_def) {
    if (mode === 'native') {
      source_folder_def = './components_src'
    }
    else {
      source_folder_def = '/node/components_src';
    }
  }
  dest_folder_def = dest_folder_def || this.dest_folder_def;
  if (!dest_folder_def) {
    if (mode === 'native') {
      dest_folder_def = './components'
    }
    else {
      dest_folder_def = '/node/components';
    }
  }
  bundle_filename = bundle_filename || this.bundle_filename || 'golgi-components.js';


  const tf = await import('qewd-transform-json');
  const transform = tf.transform;
  const path = require('node:path');

  const hm = await import('html-minifier');
  const html_min = hm.minify;

  const cssc = require('clean-css');


  let createFile = function(contentArray, filePath) {
    fs.outputFileSync(filePath, contentArray.join('\n'));
  }

  async function run() {

    let helpers = {};

    let ssr_module = [
      "let golgi_components = [];"
    ];

    let tmpl = [
      "export function load(ctx) {",
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

    let tmpl_sd = [
      "export function load(ctx) {",
      "  let componentName = '{{name}}';",
      "  let count = -1;",
      "  customElements.define(componentName, class {{componentName}} extends HTMLElement {",
      "    constructor() {",
      "      super();",
      "      count++;",
      "      this.attachShadow({ mode: 'open' });",
      "      const html = `{{html}}`;",
      "      this.shadowRoot.innerHTML = `${html}`;",
      "      this.name = componentName + '-' + count;",
      "      {{constructorCode}}",
      "    }"
      ];

    console.log(' ');
    console.log('This will create Golgi WebComponent files from all source files in a folder');
    let ok = false;
    let def;
    //let source_folder_def = "/node/components_src";
    //let source_folder_def = "/node/sbadmin_c_src";
    //if (mode === 'native') source_folder_def = './components_src';
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

    //let dest_folder_def = "/node/components";
    //let dest_folder_def = "/node/sbadmin_c";
    //if (mode === 'native') dest_folder_def = './components';

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

    let files;
    if (component_list) {
      component_list.forEach(function(name, index) {
        if (!name.includes('.mjs')) {
          name = name + '.mjs';
        }
        component_list[index] = name;
      });
      files = component_list;
    }
    else {
      files = fs.readdirSync(source_folder);
    }

    for (const filename of files) {
      if (filename.includes('.mjs')) {
        console.log('compiling ' + filename);
        let wc_path = dest_folder + '/' + filename;
        wc_path = wc_path.split('.mjs')[0] + '.js';
        //try {
          const {def} = await import(source_folder + '/' + filename);
          let def_uc = Object.assign({}, def);

          def.componentName = def.name.replace(/-/g, '_');
          def_uc.componentName = def_uc.name.replace(/-/g, '_');
          def.methods = def.methods || ``;

          let html = html_min(def.html, {
            collapseWhitespace: true
          });
          let html_uc = def_uc.html;

          if (def.useShadowDOM && def.css && def.css !== '') {
            let css = new cssc({}).minify(def.css);
            css = '<style>' + css.styles + '</style>';
            css = `${css}`;

            let css_uc = '<style>\n' + def_uc.css + '\n</style>';
            css_uc = `${css_uc}`;

            html = css + html;
            html_uc = '\n' + css_uc + '\n' + html_uc
          }

          def.html = `${html}`;
          def_uc.html = `${html_uc}`;
          if (!def.constructorCode) {
            def.constructorCode = '';
            def_uc.constructorCode = '';
          }
          let template = tmpl;
          if (def.useShadowDOM) template = tmpl_sd;
          let contents = transform(template, def, helpers);
          let contents_uc = transform(template, def_uc, helpers);

          console.log(contents);

          contents.push(`${def.methods}`);
          contents.push("});");
          contents.push("};");

          contents_uc.push(`${def.methods}`);
          contents_uc.push("  });");
          contents_uc.push("};");

          let content = contents.join('');
          let result = uglifyjs.minify(content);
          //fs.createFile([result.code], wc_path);
          createFile(contents_uc, wc_path);

          let mod_code = result.code.split('export{load};')[0];
          mod_code = "golgi_components.push({n:'" + def.name + "',f:" + mod_code + "});";
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
    createFile(ssr_module, dest_folder + '/' + bundle_filename);
  }

  run();
};