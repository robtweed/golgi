/*

 ----------------------------------------------------------------------------
 | Golgi: Dynamically-loading WebComponent Assembly Framework                |
 |                                                                           |
 | Copyright (c) 2023 MGateway Ltd,                                          |
 | Redhill, Surrey UK.                                                       |
 | All rights reserved.                                                      |
 |                                                                           |
 | https://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                                |
 |                                                                           |
 |                                                                           |
 | Licensed under the Apache License, Version 2.0 (the "License");           |
 | you may not use this file except in compliance with the License.          |
 | You may obtain a copy of the License at                                   |
 |                                                                           |
 |     http://www.apache.org/licenses/LICENSE-2.0                            |
 |                                                                           |
 | Unless required by applicable law or agreed to in writing, software       |
 | distributed under the License is distributed on an "AS IS" BASIS,         |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  |
 | See the License for the specific language governing permissions and       |
 |  limitations under the License.                                           |
 ----------------------------------------------------------------------------

 24 August 2023

 */

let count = 0;

let golgi = {
  dataStore: {},
  components: [],
  componentsByName: {},
  assemblies: new Map(),
  stateMap: new Map(),
  resourceLoaded: new Map(),
  listeners: new Map(),
  logging: false,
  version: '1.5.0',

  setLog: function (state) {
    this.logging = state;
  },

  loadJSAsync: async function(src, attrs) {
    return await golgi.loadJSFilePromise(src, attrs);
  },

  loadJSFilePromise: async function(src, attrs) {
    let _this = this;
    return new Promise((resolve) => {
      _this.loadJS(src, attrs, function(src) {
        resolve(src);
      });
    });
  },

  loadJS: function(src, attrs, callback) {
     let crossorigin;
     if (attrs) {
       if (!callback && typeof attrs === 'function') {
        callback = attrs;
       }
       else if (typeof attrs === 'object') {
         crossorigin = attrs.crossorigin;
      }
    }
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src
    let _this = this;
    script.onload = function(){
      _this.logMessage('script ' + src + ' loaded');
      if (callback) callback(src);
    };
	if (crossorigin) {
      script.setAttribute('crossorigin', crossorigin);;
    }
    document.body.appendChild(script);
  },

  loadCSSAsync: async function(src, target) {
    return await golgi.loadCSSPromise(src, target);
  },

  loadCSSPromise: async function(src, target) {
    let _this = this;
    return new Promise((resolve) => {
      _this.loadCSS(src, target, function(src) {
        resolve(src);
      });
    });
  },

  loadCSS: function(src, target, callback) {
    let crossorigin;
    if (target) {
      if (!callback && typeof target === 'function') {
        callback = target;
        target = document.getElementsByTagName('head')[0];
      }
      else if (typeof target === 'object') {
        crossorigin = target.crossorigin;
        target = target.target;
        if (!target) target = document.getElementsByTagName('head')[0];
      }
    }
    if (!target) {
      target = document.getElementsByTagName('head')[0];
    }
    let head = target;
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute('type', 'text/css');;
    link.href = src;
	if (crossorigin) {
      link.setAttribute('crossorigin', crossorigin);;
    }
    let _this = this;
    link.onload = function() {
      _this.logMessage('CSS file ' + src + ' loaded');
      if (callback) callback(src);
    };
    head.appendChild(link);
  },
  addMetaTag: function(attributes) {
    let meta = document.createElement('meta');
    let name;
    for (name in attributes) {
      meta.setAttribute(name, attributes[name]);
    }
    document.getElementsByTagName('head')[0].appendChild(meta);
  },

  fetch_optimised_components: async function(context, subset_file) {

    let filename = subset_file || 'golgi-components.js';

    // Fetch pre-built Server-side-generated version of all components for a namespace, ie single file minimised import

    //let filename = context.componentPaths[namespace] + componentFile;
    this.logMessage('fetching optimised file of all components: ' + filename);

    const {golgi_components} = await import(filename);
    let _this = this;
    golgi_components.forEach(function(comp) {
      if (!customElements.get(comp.n)) {
        try {
          comp.f();
          _this.logMessage(comp.n + ' loaded');
        }
        catch(err) {
          _this.logMessage('Unable to fetch optimised component module');
          console.log(err);
        }
      }
    });
  },

  fetch_optimised_assemblies: async function(context, subset_file) {

    // Fetch pre-built Server-side-generated version of all assemblies, ie single file minimised import

    let assemblyFile = subset_file || 'golgi-assemblies.js';

    let filename = context.assemblyPath + assemblyFile;
    this.logMessage('fetching optimised file of all assemblies: ' + filename);

    let _this = this;

    try {
      const {golgi_assemblies} = await import(filename);
      golgi_assemblies.forEach(function(obj) {
        _this.assemblies.set(obj.n, obj.c);
      });
    }
    catch(err) {
      this.logMessage('Unable to fetch optimised assembly module');
    }
    this.emit('assembliesLoaded');
  },

  load: async function(componentName, targetElement, context) {

    let namespace = componentName.split('-')[0];

    this.logMessage('*** load ' + componentName);
    let _this = this;

    let jsPath = context.componentPath || './';
    if (context.componentPaths && context.componentPaths[namespace]) {
      jsPath = context.componentPaths[namespace];
    }
    let jsRootPath = jsPath;
    if (jsRootPath.slice(-1) !== '/') {
      jsRootPath = jsPath + '/';
    }

    function invokeComponent(elementClass) {
      let element = new elementClass();
      if (targetElement) {
        targetElement.appendChild(element);
      }
      else {
        golgi.components.push(element);
      }
      element.context = context;
      element.path = jsPath;
      element.rootPath = jsRootPath;
      element.isComponent = true;

      return element;
    }

    let elementClass = customElements.get(componentName);
    if (elementClass) {
      this.logMessage('** component ' + componentName + ' already imported');
      let element = invokeComponent(elementClass);
      return element;
    }
    else {
      let _module = await import(jsPath + componentName + '.js');

      if (!context.golgiLoadSequence) {
        context.golgiLoadSequence = [];
      }
      context.golgiLoadSequence.push(componentName);
      if (this.logging) {
        this.logMessage('Component Load Sequence so far:');
        console.log(context.golgiLoadSequence);
      }

      // check again in case loaded in the meantime by another async loop
      let elementClass = customElements.get(componentName);
      if (!elementClass) {
        _module.load.call(this);
        elementClass = customElements.get(componentName);
        this.logMessage('** component ' + componentName + ' had to be imported');
      }
      else {
        //if (log) console.log('** component ' + componentName + ' loaded by another loop');
      }

      let element = invokeComponent(elementClass);
      return element;
    }
  },

  loadGroup: async function(configArr, targetElement, context, refs) {

    // The array of child components share the same target and must be appended
    // in strict sequence, so this is enforced by this logic..

    //targetElement = targetElement || 'body';
    if (targetElement === 'body') targetElement = document.getElementsByTagName('body')[0];
    context = context || {};

    if (!Array.isArray(configArr)) {
      configArr = [configArr];
    }
    //console.log('loadGroup - configArr:');
    //console.log(configArr);

    let assemblyName = configArr[0].assemblyName;

    for (const config of configArr) {
      await this.processComponent(config, assemblyName, targetElement, context, refs);
    }
    return;
  },

  processComponent: async function(component, assemblyName, targetElement, context, refs) {
    //console.log('processComponent');
    //console.log(component);

    let targetEl = targetElement;

    // optional target override
    if (component.targetElement) {
      let parent = this.getParentComponent.call(targetEl, component.targetElement.componentName);

      //console.log('parent = ');
      //console.log(parent);

      if (parent && parent[component.targetElement.target]) {
        targetEl = parent[component.targetElement.target];
      }

    }

    // this is actually an assembly, so needs loading using
    // renderAssembly instead

    if (component.componentName.split(':')[0] === 'assembly') {
      let aName = component.componentName.split('assembly:')[1];
      //console.log('**** call renderAssembly for ' + aName);
      await this.renderAssembly(aName, targetEl, context);

      // invoke any hooks applied to the assembly

      if (component.hook) {
        try {
          // note that the Golgi object will be the context for an assembly hook!
          component.hook.call(this, context);
        }
        catch(err) {
          if (this.logging) {
            this.logMessage('Unable to execute hook ' + name + ' for ' + config.componentName);
            console.log(err);
          }
        }
      }

      // assembly processing complete

      return;
    }

    // load and render the component,
    //  then process its children if it has any

    let element = await this.loadComponent(component, assemblyName, targetEl, context, refs);
    if (component.children && component.children[0] && element.childrenTarget) {
      component.children.forEach(function(c, index) {
        component.children[index].assemblyName = assemblyName;
      });

      // load component's child components

      await this.loadGroup(component.children, element.childrenTarget, context, refs);
    }
    return;
  },

  loadComponent: async function(component, assemblyName, targetElement, context, refs) {

    let config = Object.assign({}, component);

    //console.log('*** loadComponent:');
    //console.log('config:');
    //console.log(config)
    //console.log('targetElement:');
    //console.log(targetElement);

    // is the component actually just a standard HTML tag?

    if (!config.componentName.includes('-') && !config.componentName.includes(':')) {

      //console.log('**** html tag: ****');
      //console.log(config);
      let element = document.createElement(config.componentName);
      element.textContent = config.textContent;
      for (let attr in config.attributes) {
        element.setAttribute(attr, config.attributes[attr]);
      }
      element.childrenTarget = element;
      if (targetElement) targetElement.appendChild(element);

      // invoke any hooks applied to the assembly

      if (config.hook) {
        try {
          let _this = {...this};
          _this.element = element;
          // note that the Golgi object will be the context for an HTML tag hook!
          if (config.hook.constructor.name === 'AsyncFunction') {
            await config.hook.call(_this, context);
          }
          else {
            config.hook.call(_this, context);
          }
        }
        catch(err) {
          if (this.logging) {
            this.logMessage('Unable to execute hook ' + name + ' for ' + config.componentName);
            console.log(err);
          }
        }
      }

      return element;
    }

    // process the Golgi Component


    // load any meta tag definitions into <head>

    if (config.meta) {
      config.meta.forEach(function(meta) {
        golgi.addMetaTag(meta);
      });
    }

    // load any script or css tags

    // Use nested promises to await overall, but load in parallel

    let tagArr = ['script', 'css'];

    await Promise.all(tagArr.map(async (tagName) => {
      if (tagName === 'script' && config.script) {
        await Promise.all(config.script.map(async (script) => {
          if (!golgi.resourceLoaded.has(script.src)) {
            let obj;
            if (script.crossorigin) {
              obj = {crossorigin: script.crossorigin};
            }
            if (!script.await) {
              golgi.loadJS(script.src, obj)
            }
            else {
              await golgi.loadJSAsync(script.src, obj);
            }
            golgi.resourceLoaded.set(script.src, true);
          }
        }));
      }
      if (tagName === 'css' && config.css) {
        await Promise.all(config.css.map(async (css) => {
          if (!golgi.resourceLoaded.has(css.src)) {
            let obj;
            if (css.crossorigin) {
              obj = {crossorigin: css.crossorigin};
            }
            if (!css.await) {
              golgi.loadCSS(css.src, obj)
            }
            else {
              await golgi.loadCSSAsync(css.src, obj);
            }
            golgi.resourceLoaded.set(css.src, true);
          }
        }));
      }
    }));

    let element = await this.renderWebComponent(config, targetElement, context, refs);
    if (element.parentComponent && element.parentComponent.onChildComponentReady) {
      element.parentComponent.onChildComponentReady.call(element.parentComponent, element);
    }

    return element;

  },

  renderWebComponent: async function(config, targetElement, context, refs) {
    let assemblyName = config.assemblyName;
    let element = await this.load(config.componentName, targetElement, context);

    if (refs && config.state && config.state['golgi:ref']) {
      let name = config.state['golgi:ref'];
      refs[name] = element;
      delete config.state['golgi:ref'];
    }

    if (this.logging) {
      //console.log('load element: ' + config.componentName);
      //console.log(element);
      //console.log(targetElement);
    }

    let targets;
    if (element.shadowRoot) {
      element.rootElement = element.shadowRoot.firstElementChild;
      // don't want a style tag to be the root element (unless no other tags in component)
      if (element.rootElement.tagName === 'STYLE') {
        let ok = false;
        let el = element.rootElement;
        do {
          if (el.nextSibling) {
            el = el.nextSibling;
            if (el.nodeType === 1) ok = true;
          }
        }
        while (!ok)
        if (ok) {
          element.rootElement = el;
        }
        else {
          // no other top-level element found in component, so revert to style tag
          element.rootElement = element.shadowRoot.firstElementChild;
        }
      }
      targets = element.shadowRoot.querySelectorAll('*');
    }
    else if (typeof element.html !== 'undefined') {

      element.innerHTML = element.html;
      element.rootElement = element.firstElementChild;

      targets = element.querySelectorAll('*');
    }

    if (typeof element.rootElement !== 'undefined') {
      element.databinding = [];
      targets.forEach(function(el) {
        if (el.hasAttribute('golgi:prop')) {
          let prop = el.getAttribute('golgi:prop');
          element[prop] = el;
          el.removeAttribute('golgi:prop');
        }
        el.ownerComponent = element;

        el.childNodes.forEach(function(child) {
          if (child.nodeType === 3) {
            let nodeValue = child.nodeValue.toString();
            if (child.nodeValue.includes('golgi:bind')) {
              let prop = child.nodeValue.split('golgi:bind=')[1] || 'dummy';
              prop = prop.split(';')[0]; // may also other Golgi directives
              let span = document.createElement('span');
              el.insertBefore(span, child);
              let fn = function(dataObj) {
                let value = dataObj;
                if (typeof dataObj === 'object') value = dataObj[prop];
                if (typeof value !== 'undefined') span.innerHTML = value;              
              };
              element.databinding.push(fn);
              child.nodeValue = '';
            }
            if (nodeValue.includes('golgi:observer')) {
              let target = el;
              if (el.firstChild && el.firstChild.tagName === 'SPAN') {
                target = el.firstChild;
              }
              let method = nodeValue.split('golgi:observer=')[1];
              method = method.split(';')[0]; // may also other Golgi directives
              let observer = golgi.observeText(target, element, method, el);
              observer.observe(target, {
                childList: true,
                subtree: true
              });
            }
          }
        });

        [...el.attributes].forEach(function(attr) {
          if (attr.name.startsWith('golgi:on_')) {
            let eventName = attr.name.split('golgi:on_')[1];      
            let funcName = attr.value
            if (element[funcName] && typeof element[funcName] === 'function') {
              let fn;
              if (element[funcName].constructor.name === 'AsyncFunction') {
                fn = async function(evt) {
                  await element[funcName](evt);
                };
              }
              else {
                fn = function(evt) {
                  element[funcName](evt);
                };
              }
              golgi.addHandler.call(element, fn, el, eventName);
            }
            el.removeAttribute(attr.name);
          }  

          if (attr.value.includes('golgi:bind')) {
            let prop = attr.value.split('golgi:bind=')[1];
            prop = prop.split(';')[0]; // if there are other golgi directives in the attribute value
            let fn;
            if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && attr.name === 'value') {
              fn = function(dataObj) {
                let value = dataObj;
                if (typeof dataObj === 'object') value = dataObj[prop];
                if (typeof value !== 'undefined') el.value = value;
              };
            }
            else {
              fn = function(dataObj) {
                let value = dataObj;
                if (typeof dataObj === 'object') value = dataObj[prop];
                if (typeof value !== 'undefined') el.setAttribute(attr.name, value);
              };
            }
            element.databinding.push(fn);
            el.removeAttribute(attr.name);
          }

          if (attr.value.includes('golgi:observer')) {
            let methodName = attr.value.split('golgi:observer=')[1];
            methodName = methodName.split(';')[0]; // if there are other golgi directives in the attribute value
            let observer = golgi.observeAttr(attr.name, methodName);
            observer.observe(el, {
              attributeFilter: [attr.name],
              attributeOldValue: true, 
            });
          }

        });

      });

      if (!element.childrenTarget) {
        element.childrenTarget = element.rootElement;
      }
      element.childrenTarget.ownerComponent = element;
      let attrName = 'golgi:component-class';
      let parentClass = element.rootElement.getAttribute(attrName);
      if (parentClass) {
        let classes = parentClass.split(' ');
        classes.forEach(function(cls) {
          element.classList.add(cls);
        });
        element.rootElement.removeAttribute(attrName);
      }
    }
    element.componentName = config.componentName;
    element.getParentComponent = this.getParentComponent.bind(element);
    element.onUnload = this.onUnload.bind(element);
    element.registerUnloadMethod = this.registerUnloadMethod.bind(element);
    element.remove = this.remove.bind(element);
    element.removeAllByName = this.removeAllByName;
    element.getComponentByName = this.getComponentByName.bind(this); 
    element.getComponentsByName = this.getComponentsByName; 
    element.addHandler = this.addHandler.bind(element);
    element.addMetaTag = this.addMetaTag;
    element.loadResources = this.loadResources;
    element.loadJSAsync = this.loadJSAsync
    element.loadJS = this.loadJS.bind(this);
    element.loadCSSAsync = this.loadCSSAsync;
    element.loadCSS = this.loadCSS.bind(this);
    element.logging = this.logging;
    element.logMessage = this.logMessage.bind(this);
    element.loadGroup = this.loadGroup.bind(this);
    element.renderAssembly = this.renderAssembly.bind(this);
    element.renderComponent = this.renderComponent.bind(this);
    element.renderComponentMap = this.renderComponentMap.bind(this);
    element.observerStart = this.observerStart;
    element.methodsToRemove = [];
    element.golgi_state = this.golgi_state;
    element.addStateMap = this.addStateMap.bind(element);
    element.applyDataBinding = this.applyDataBinding.bind(element);
    element.registeredListenerTypes = new Map();
    element.on = this.el_on.bind(element);
    element.off = this.el_off.bind(element);
    element.emit = this.el_emit.bind(element);
    element.onAssemblyRendered = function(name, callback) {
      golgi.on(name + '_rendered', callback, element);
    };
    element.ownerAssembly = assemblyName;
    element.onOwnerAssemblyRendered = function(callback) {
      golgi.on(assemblyName + '_rendered', callback, element);
    };

    if (!context.rootComponent) {
      context.rootComponent = element;
    }
    element.rootComponent = context.rootComponent;
    if (targetElement) element.parentComponent = targetElement.ownerComponent;

    if (!golgi.componentsByName[element.tagName]) golgi.componentsByName[element.tagName] = [];
    golgi.componentsByName[element.tagName].push(element);

    if (this.logging) {
      this.logMessage('Golgi Component instantiated and ready for use:');
      console.log(element);
    }

    if (element.onBeforeState) {
      if (element.onBeforeState.constructor.name === 'AsyncFunction') {
        await element.onBeforeState();
      }
      else {
        element.onBeforeState();
      }
    }

    if (config.state) {
      for (let sname in config.state) {
        if (element[sname] && typeof element[sname] === 'function') {
          element[sname].call(element, config.state[sname]);
          delete config.state[sname];
        }
      }

      if (config.state && element.setState && typeof element.setState === 'function') {
        element.setState(config.state);
      }
    }

    if (config.stateMap) {
      config.state_map = new Map();
      for (let key in config.stateMap) {
        config.state_map.set(key, config.stateMap[key]);
      }
    }
    if (config.state_map) {
      config.state_map.forEach(function(method, path) {
        if (!golgi.stateMap.has(path)) {
          golgi.stateMap.set(path, []);
        }
        golgi.stateMap.get(path).push({
          component: element,
          method: method
        });
      });
    }

    if (element.onBeforeHooks) {
      element.onBeforeHooks();
    }

    // invoke hook if present

    if (config.hook) {
      try {
        if (config.hook.constructor.name === 'AsyncFunction') {
          await config.hook.call(element, context);
        }
        else {
          config.hook.call(element, context);
        }
      }
      catch(err) {
        if (this.logging) {
          this.logMessage('Unable to execute hook ' + name + ' for ' + config.componentName);
          console.log(err);
        }
      }
    }

    if (element.onAfterHooks) {
      element.onAfterHooks();
    }

    element.emit('componentReady');

    return element;
  },

  renderComponentMap: async function(componentName, targetElement, context, controlArray, stateMapDef, callback) {
    let ix = -1;
    let pieces = stateMapDef.split(':');
    let arrayName = pieces[0];
    let methodName = pieces[1];
    if (typeof methodName === 'undefined' || methodName === '') {
      methodName = 'applyDataBinding';
    }
    for (let value of controlArray) {
      let comp = await this.renderComponent(componentName, targetElement, context);
      if (callback) {
        callback.call(comp, comp, value);
      }
      ix++;
      let path = arrayName + '.' + ix;
      comp.addStateMap(path, methodName);
    }
    this.golgi_state[arrayName] = controlArray;
  },

  renderAssembly: async function(args, targetElement, context) {
    let name;
    let refs = {};
    if (!targetElement && !context && typeof args === 'object') {
      targetElement = args.targetElement;
      context = args.context;
      name = args.name;
    }
    else {
      name = args;
    }

    if (!context) return;
    if (!name) return;
    if (name === '') return;

    let path = context.assemblyPath;
    if (path === '') path = './';
    if (path.slice(-1) !== '/') {
      path = path + '/';
    }
    let _module;
    if (this.assemblies.has(name)) {
      _module = {load: this.assemblies.get(name)};
    }
    else {
      _module = await import(path + name + '.js');
    }
    let assemblyObj = _module.load.call(this, context);
    let json = assemblyObj.gjson || {};
    if (assemblyObj.gx) {
      json = this.parse(assemblyObj.gx, assemblyObj.hooks, context);
    }

    if (json) {
      if (!Array.isArray(json)) {
        json = [json];
      }
      let rootFound = false;
      json.forEach(function(component, index) {
        json[index].assemblyName = name;
        if (component.state && component.state['golgi:ref'] === 'root') rootFound = true;
      });
      if (!rootFound) {
        if (!json[0].state) json[0].state = {};
        json[0].state['golgi:ref']='root';
      }
    }

    await this.loadGroup(json, targetElement, context, refs);
    this.emit(name + '_rendered');
    let rootElement = refs['root'];
    for (let name in refs) {
      if (name !== 'root') {
        rootElement[name] = refs[name];
      }
    }
    rootElement.refs = refs;
    return rootElement;
  },

  async renderComponent(componentName, targetElement, context) {

    if (targetElement === 'body') {
      targetElement = document.getElementsByTagName('body')[0];
    }

    let noOfInstances = 0;
    if (targetElement) noOfInstances = targetElement.getElementsByTagName(componentName).length;

    let assembly = [{
      componentName: componentName
    }];
    await this.loadGroup(assembly, targetElement, context);
    if (!targetElement) return golgi.components;
    return targetElement.getElementsByTagName(componentName)[noOfInstances];
  },
  getParentComponent(options) {
    options = options || {};
    if (typeof options === 'string') {
      options = {match: options};
    }
    if (this.element) {
      this.tagName = this.element.tagName;
      this.parentNode = this.element.parentNode;
    }
    let prefix = options.prefix || this.tagName.split('-')[0];
    function findParent(node) {
      if (node.nodeType === 11) {
        // #shadowRoot node
        node = node.host;
      }
      else {
        node = node.parentNode;
      }
      if (!node) return null;
      if (options.match) {
        if (node.tagName === options.match.toUpperCase()) return node;
      }
      else {
        if (node.tagName.startsWith(prefix)) return node;
      }
      return findParent(node);
    }
    return findParent(this);
  },
  getComponentsByName(name) {
    return golgi.componentsByName[name.toUpperCase()] || [];
  },
  getComponentByName(componentName, name, parentNode) {
    //let customComponentElement = this.getCustomComponentElement(componentName, name);
    //if (customComponentElement) return customComponentElement;
    parentNode = parentNode || document;
    let node = [...parentNode.getElementsByTagName(componentName.toUpperCase())];
    if (!name) return node;
    let i;
    for (i = 0; i < node.length; i++) {
      if (node[i].name === name) {
        return node[i];
      }
    }
    return;
  },
  addHandler: function(fn, targetElement, type) {
    if (!type && typeof targetElement === 'string') {
      type = targetElement;
      targetElement = null;
    }
    type = type || 'click';
    targetElement = targetElement || this.rootElement;
    targetElement.addEventListener(type, fn);
    if (!this.listeners) this.listeners = [];
    this.listeners.push({
      type: type,
      fn: fn,
      target: targetElement
    });
  },
  registerUnloadMethod(fn) {
    this.methodsToRemove.push(fn);
  },

  onUnload: function() {
    if (this.logging) {
      this.logMessage('removing Golgi COmponent:');
      console.log(this);
    }
    for (const type of this.registeredListenerTypes.keys()) {
      this.logMessage('removing customHandler for type ' + type);
      this.off(type);
    }
    let _this = this;
    if (this.listeners) {
      this.listeners.forEach(function(listener) {
        if (_this.logging) {
          _this.logMessage('removing listener');
          console.log(listener);
        }
        listener.target.removeEventListener(listener.type, listener.fn);
      });
    }
    this.methodsToRemove.forEach(function(method) {
      if (_this.logging) {
        _this.logMessage('invoking custom unload method');
        console.log(method);
      }
      method();
    });
  },
  remove: function() {      
    // remove component and all its sub-components
    //  to ensure their disconnectedCallbacks fire
    function getChildren(node) {
      let children = [...node.childNodes];
      children.forEach(function(child) {
        if (child.nodeType === 1) {
          // drop into shadowRoot if necessary to ensure full recursion
          if (child.shadowRoot) {
            child = child.shadowRoot;
          }
          getChildren(child);
          if (child.isComponent) {
            child.onUnload();
            child.parentNode.removeChild(child);
          }
        }
      });
    }
    getChildren(this);
    this.onUnload();
    for (let index in golgi.componentsByName[this.tagName]) {
      let comp = golgi.componentsByName[this.tagName][index];
      if (comp.name === this.name) {
        golgi.componentsByName[this.tagName].splice(index, 1);
        break;
      }
    }
    this.parentNode.removeChild(this);
  },

  removeAllByName: function(componentName, parentElement) {
    let comps;
    if (parentElement) {
      comps = [...parentElement.getElementsByTagName(componentName)];
    }
    else {
      comps = [...document.getElementsByTagName(componentName)];
    }
    if (comps) {
      comps.forEach((component) => {
        component.remove();
      });
    }
  },

  el_on: function(type, callback) {
    if (!this.registeredListenerTypes.has(type)) {
      let handler = function(e) {
        callback(e.detail);
      };    
      this.addEventListener(type, handler);
      this.registeredListenerTypes.set(type, handler);
    }
  },

  el_emit: function(type, data) {
    if (this.registeredListenerTypes.has(type)) {     
      let evt = new CustomEvent(type, {
        detail: data
      });
      this.dispatchEvent(evt);
    }
  },

  el_off: function(type) {
    if (this.registeredListenerTypes.has(type)) {
      let handler =  this.registeredListenerTypes.get(type);
      this.removeEventListener(type, handler);
      this.registeredListenerTypes.delete(type);
    }
  },

  on: function(type, callback, context) {
    if (!this.listeners.has(type)) {
      let obj = {
        handler: callback,
        context: context
      };
      this.listeners.set(type, obj);
    }
  },

  off: function(type) {
    if (this.listeners.has(type)) {
      this.listeners.delete(type);
    }
  },

  emit: function(type, data) {
    if (this.listeners.has(type)) {
      let obj =  this.listeners.get(type);
      let context = obj.context || this;
      obj.handler.call(context, data);
    }
  },


  logMessage: function(message) {
    if (this.logging) {
      console.log(Date.now() + ': ' + message);
    }
  },

  parse: function(input, hooks, context) {
    let xml = '<xml xmlns="http://mgateway.com" xmlns:assembly="http://mgateway.com" xmlns:golgi="http://mgateway.com">' + input + '</xml>';
    //console.log(xml);
    let parser = new DOMParser();
    let dom = parser.parseFromString(xml, 'text/xml');

    let component = [];

    function getChildren(element, comp) {
      let children = [...element.childNodes];
      children.forEach(function(child) {
        if (child.nodeType === 1) {

          if (['script', 'css', 'meta'].includes(child.tagName)) return;

          let component = {
            componentName: child.tagName,
            state: {}
          };

          // check for immediate text content
          if (child.tagName.includes('-') && child.textContent.trim() !== '') {
            let gchildren = [...child.childNodes];
            for (let i = 0; i < gchildren.length; i++) {
              let node = gchildren[i];
              if (node.nodeType === 3) {
                let text = node.textContent.trim();
                if (text !== '') {
                  component.state.textContent = text;
                  break;
                }
              }
            }
          }
          if (child.hasAttributes()) {

            if (!child.tagName.includes('-') && !child.tagName.includes(':')) {
              component.attributes = {};
              let attrs = [...child.attributes];
              attrs.forEach(function(attr) {
                if (attr.name === 'golgi:appendTo') {
                  component.targetElement = {
                    componentName: element.tagName,
                    target: attr.value
                  }
                }
                else if (attr.name === 'golgi:hook' && hooks && hooks[child.tagName] && hooks[child.tagName][attr.value]) {
                  component.hook = hooks[child.tagName][attr.value];
                }
                else {
                  component.attributes[attr.name] = attr.value;
                }
              });
            }
            else {
              let attrs = [...child.attributes];
              let attrObjs = {};
              attrs.forEach(function(attr) {
                let value = attr.value;
                if (value === 'true') {
                  value = true;
                }
                else if (value === 'false') value = false;

                else if (value.startsWith && value.startsWith('golgi:context=')) {
                  let ctx = value.split('golgi:context=')[1];
                  let pcs = ctx.split('.');
                  let ref = context;
                  let error = false;
                  pcs.forEach(function(p, index) {
                    if (!error) {
                      if (typeof ref[p] !== 'undefined') {
                        ref = ref[p];
                      }
                      else {
                        error = true;
                      }
                    }
                  });
                  if (error) {
                    value = '*Invalid context reference*';
                  }
                  else {
                    value = ref;
                  }
                }

                else {
                  try {
                    value = JSON.parse(value);
                  }
                  catch(err) {
                  }
                }


                if (attr.name === 'golgi:hook' && hooks && hooks[child.tagName] && hooks[child.tagName][value]) {
                  component.hook = hooks[child.tagName][value];
                }

                if (attr.name === 'golgi:stateMap') {
                  let stateKey = value.split(':')[0];
                  if (!component.state_map) {
                    component.state_map = new Map();
                  }
                  let method = value.split(':')[1];
                  if (typeof method === 'undefined' || method === '') {
                    method = 'applyDataBinding';
                  }
                  component.state_map.set(stateKey, method);
                }

                else if (attr.name === 'golgi:appendTo') {
                  component.targetElement = {
                    componentName: element.tagName,
                    target: value
                  }
                }

                else {
                  if (attr.name.includes('.')) {
                    let pcs = attr.name.split('.');
                    let len = pcs.length;
                    let ref = attrObjs;
                    pcs.forEach(function(p, index) {
                      if (!ref[p]) ref[p] = {};
                      if (index === (len - 1)) {
                        ref[p] = value;
                      }
                      else {
                        ref = ref[p];
                      }
                    });
                  }
                  else {
                    component.state[attr.name] = value;
                  }
                }
              });
              //console.log(attrObjs);
              for (let name in attrObjs) {
                component.state[name] = attrObjs[name];
              }
            }
          }
          if (!child.tagName.includes('-') && child.childElementCount === 0) {
            component.textContent = child.textContent;
            component.childElementCount = child.childElementCount;
          }
          if (child.hasChildNodes()) {
            component.children = [];

            let children = [...child.childNodes];
            children.forEach(function(child) {
              if (child.nodeType === 1) {
                if (['script', 'css', 'meta'].includes(child.tagName)) {
                  if (!component[child.tagName]) component[child.tagName] = [];
                  let obj = {};	
                  [...child.attributes].forEach(function(attr) {
                    obj[attr.name] = attr.value;
                  });
                  component[child.tagName].push(obj);
                }
              }
            });

            getChildren(child, component.children);
          }
          comp.push(component);
        }
      });
    }

    getChildren(dom.documentElement, component);
    return component;
  },
  observerStart() {
    if (this.logging) {
      this.logMessage('running observerStart on this:');
      console.log(this);
    }
    if (this.observerCallback) {
      let target = this.shadowRoot || this;
      golgi.observer.observe(target, {
        attributes: true, 
        attributeOldValue: true, 
        characterData: true, 
        characterDataOldValue: true,
        childList: true, 
        subtree: true
      });
    }
  },
  observer: new MutationObserver(function(mutations) {
    function getOwnerComponent(element) {
      let found = false;
      let el = element;
      do {
        el = el.parentNode;
        if (el.nodeType === 11) el = el.host;
        if (!el || el.tagName.includes('-')) {
          found = true;
        }
      }
      while (!found);    
      return el;
    }

    mutations.forEach(function(mutation) {
      let ownerComponent = getOwnerComponent(mutation.target);
      if (ownerComponent.observerCallback) {

        ownerComponent.observerCallback(mutation);
      }
    });
  }),
  observeAttr(attrName, methodName) { 
    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
          let newValue = mutation.target.getAttribute(attrName);
          let callback = mutation.target.ownerComponent[methodName];
          if (callback && mutation.target.ownerComponent && newValue && newValue !== mutation.oldValue) callback.call(mutation.target.ownerComponent, newValue, mutation.oldValue);
        }
      });
    });
    return observer;
  },
  observeText(target, component, methodName, originalTag) {
    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          let newValue = target.textContent;
          let callback = component[methodName];
          if (callback && newValue) callback.call(component, newValue, target, originalTag);
        }
      });
    });
    return observer;
  },
  addStateMap(path, stateMethod) {
    stateMethod = stateMethod || 'applyDataBinding';
    if (!golgi.stateMap.has(path)) {
      golgi.stateMap.set(path, []);
    }
    golgi.stateMap.get(path).push({
      component: this,
      method: stateMethod
    });
  },
  applyDataBinding(obj) {
    //console.log(this.databinding);
    //console.log(obj);
    this.databinding.forEach(function(fn) {
      fn(obj);
    });
    if (this.onDataUpdated) {
      this.onDataUpdated(obj);
    }
  }
};

golgi.golgi_state = new Proxy(golgi.dataStore, {

    get: function(target, prop, receiver) {

      let jpath = [];

      function applyState(mapKey, value) {
        if (golgi.logging) {
          golgi.logMessage('1 trying to apply state for mapKey ' + mapKey + ':');
          console.log(value);
          //console.log(golgi.stateMap);
        }
        if (golgi.stateMap.has(mapKey)) {
          let mapArr = golgi.stateMap.get(mapKey);
          mapArr.forEach((mapObj, index) => {

            //if the component no longer exists, remove it from the state map array

            if (!mapObj.component) {
              mapArr.splice(index, 1);
              return;
            }

            // use named method in component if the method exists
            //  otherwise fall back to use its setState() method
            if (mapObj.component[mapObj.method]) {
              mapObj.component[mapObj.method](value);
            }
            else {
              let state = {};
              state[mapObj.method] = value;
              mapObj.component.setState(state);
            } 
          });
        }
      }
      setTimeout(function() {
        applyState(prop, target[prop]);
      }, 100);
      return target[prop];
    },

    set: function(obj, prop, value) {

      let jpath = [];

      function applyState(mapKey, value) {
        if (golgi.logging) {
          golgi.logMessage('2 trying to apply state for mapKey ' + mapKey + ':');
          console.log(value);
          //console.log(golgi.stateMap);
        }
        if (golgi.stateMap.has(mapKey)) {
          let mapArr = golgi.stateMap.get(mapKey);
          mapArr.forEach((mapObj, index) => {

            //if the component no longer exists, remove it from the state map array

            if (!mapObj.component) {
              mapArr.splice(index, 1);
              return;
            }

            // use named method in component if the method exists
            //  otherwise fall back to use its setState() method
            if (mapObj.component[mapObj.method]) {
              mapObj.component[mapObj.method](value);
            }
            else {
              let state = {};
              state[mapObj.method] = value;
              mapObj.component.setState(state);
            }
          });
        }
      }

      function getProps(parentProp, obj) {
        if (golgi.logging) {
          golgi.logMessage('getProps called for ' + parentProp);
          console.log(obj);
        }
        jpath.push(parentProp);
        applyState(jpath.join('.'), obj);

        Object.entries(obj).forEach((entry, index) => {
          const [key, value] = entry;
          //console.log('key: ' + key + '; value = ' + value);
          if (typeof value !== 'object') {
            let mapKey = jpath.join('.') + '.' + key;
            applyState(mapKey, value);
          }
          else {
            getProps(key, value);
            jpath.pop();
          }
        });
      }

      golgi.dataStore[prop] = value;

      if (typeof value === 'object') {
        getProps(prop, value);
      }
      if (typeof value === 'string' || typeof value === 'number') {
        applyState(prop, value);
      }      

      return true;
    }
  });


export {golgi};
