/*

 ----------------------------------------------------------------------------
 | Golgi: Dynamically-loading WebComponent Assembly Framework                |
 |                                                                           |
 | Copyright (c) 2022 M/Gateway Developments Ltd,                            |
 | Redhill, Surrey UK.                                                       |
 | All rights reserved.                                                      |
 |                                                                           |
 | http://www.mgateway.com                                                   |
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

 7 February 2022

 */

let log = false;
let count = 0;

let golgi = {
  assemblies: new Map(),
  dataStore: {},
  stateMap: new Map(),
  componentHooks: new Map(),
  prepareAssembly: function(assemblyName, config) {
    if (!assemblyName) return;
    if (!config) return;

    if (config.hooks) {
      this.componentHooks.set(assemblyName, new Map());
      for (let component in config.hooks) {
        let assemblyHooks = this.componentHooks.get(assemblyName);
        if (!assemblyHooks.has(component)) assemblyHooks.set(component, new Map());
        let componentHooks = assemblyHooks.get(component); 
        for (let name in config.hooks[component]) {
          componentHooks.set(name, config.hooks[component][name]);
        }
      }
    }
    if (config.component) {
      if (!Array.isArray(config.component)) {
        config.component = [config.component];
      }
      config.component[0].assemblyName = assemblyName;
      this.assemblies.set(assemblyName, config.component);
    }
  },
  setLog: function (state) {
    log = state;
  },

  loadResources: async function(resourceObj) {
    let _this = this;
    let styles = resourceObj.css;
    if (styles) {
      if (!Array.isArray(styles)) styles = [styles];
      let style;
      for (let style of styles) {
        if (typeof style !== 'object') {
          _this.loadCSS(style);
        }
        else {
          if (style.await) {
            await _this.loadCSSAsync(style.path, style.args);
          }
          else {
            _this.loadCSS(style.path, style.args);
          }
        }
      }
    }
    let scripts = resourceObj.js;
    if (scripts) {
      if (!Array.isArray(scripts)) scripts = [scripts];
      let script;
      for (let script of scripts) {
        if (typeof script !== 'object') {
          _this.loadJS(script);
        }
        else {
          if (script.await) {
            let src = await _this.loadJSAsync(script.path, script.args);
          }
          else {
            _this.loadJS(script.path, script.args);
          }
        }
      }
    }
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
    script.onload = function(){
      if (log) console.log('script ' + src + ' loaded');
      if (callback) callback(src);
    };
	if (crossorigin) {
      script.setAttribute('crossorigin', crossorigin);;
    }
    console.log('js callback:');
    console.log(callback);
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
    link.onload = function() {
      if (log) console.log('CSS file ' + src + ' loaded');
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

  async importAssemblyModule(path) {
    let _module = await import(path);
    let fn = Object.keys(_module)[0];
    return _module[fn];
  },

  load: async function(componentName, targetElement, context) {

    let namespace = componentName.split('-')[0];

    //if (log) console.log('*** load ' + componentName);
    let _this = this;

    //console.log('namespace = ' + namespace);
    //console.log('context: ');
    //console.log(context);
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
      targetElement.appendChild(element);
      element.context = context;
      element.path = jsPath;
      element.rootPath = jsRootPath;
      element.isComponent = true;
      if (element.setState) {
        element.setState({
          golgi: _this,
        });
      }
      return element;
    }

    let elementClass = customElements.get(componentName);
    if (elementClass) {
      if (log) console.log('** component ' + componentName + ' already loaded');
      let element = invokeComponent(elementClass);
      return element;
    }
    else {
      let _module = await import(jsPath + componentName + '.js');
      // check again in case loaded in the meantime by another async loop
      let elementClass = customElements.get(componentName);
      if (!elementClass) {
        _module.load.call(this);
        elementClass = customElements.get(componentName);
        if (log) console.log('** component ' + componentName + ' had to be loaded');
      }
      else {
        //if (log) console.log('** component ' + componentName + ' loaded by another loop');
      }

      if (targetElement) {
        //console.log('*** componentName: ' + componentName);
        //console.log('*** targetElement = ' );
        //console.log(targetElement);
        let element = invokeComponent(elementClass);
        return element;
      }
      else {
        // just pre-loading
        return;
      }
    }
  },
  loadGroup: async function(configArr, targetElement, context) {

    // The array of components share the same target and must be appended
    // in strict sequence, so this is enforced by this logic..
    if (targetElement === 'body') targetElement = document.getElementsByTagName('body')[0];
    context = context || {};

    if (!Array.isArray(configArr)) {
      configArr = [configArr];
    }
    let assemblyName = configArr[0].assemblyName;

    let _this = this;
    let noOfComponents = configArr.length;

    async function loadComponent(no) {
      //console.log('!!! no = ' + no + '; noOfComponents: ' + noOfComponents);
      if (no === noOfComponents) {
        return;
      }
      let config = Object.assign({}, configArr[no]);
      let targetEl = targetElement;
      // optional target override
      if (config.targetElement) {
        let parent = _this.getParentComponent.call(targetEl, config.targetElement.componentName);
        if (parent[config.targetElement.target]) {
          targetEl = parent[config.targetElement.target];
        }
      }
      if (config.componentName) {

        if (typeof config.if === 'function') {
          if (!config.if(context)) {
            await loadComponent(no + 1);
            return;
          }
        }

        if (!config.componentName.includes('-')) {
          let element = document.createElement(config.componentName);
          element.textContent = config.textContent;
          for (let attr in config.attributes) {
            element.setAttribute(attr, config.attributes[attr]);
          }
          element.childrenTarget = element;
          targetEl.appendChild(element);
          if (config.children && config.children[0] && element.childrenTarget) {
            if (assemblyName) {
              //console.log('assemblyName: ' + assemblyName);
              //console.log(config.children);
              config.children[0].assemblyName = assemblyName;
            }
            await _this.loadGroup(config.children, element.childrenTarget, context);
            await loadComponent(no + 1);
          }
          else {
            await loadComponent(no + 1);
          }
          return;
        }

        let element = await _this.load(config.componentName, targetEl, context);
          if (log) {
            //console.log('load element: ' + config.componentName);
            //console.log(element);
            //console.log(targetElement);
          }
          if (typeof element.html !== 'undefined') {
            element.innerHTML = element.html;
            element.rootElement = element.firstElementChild;
            //let targets = element.querySelectorAll('[class*=golgi-]');
            let targets = element.querySelectorAll('*');
            targets.forEach(function(el) {
              if (el.hasAttribute('golgi-prop')) {
                let prop = el.getAttribute('golgi-prop');
                element[prop] = el;
                el.removeAttribute('golgi-prop');
              } 
            });
            if (!element.childrenTarget) {
              element.childrenTarget = element.rootElement;
            }
            let attrName = 'golgi-component-class';
            let parentClass = element.rootElement.getAttribute(attrName);
            if (parentClass) {
              let classes = parentClass.split(' ');
              classes.forEach(function(cls) {
                element.classList.add(cls);
              });
              element.rootElement.removeAttribute(attrName);
            }
          }
          element.getParentComponent = _this.getParentComponent.bind(element);
          element.onUnload = _this.onUnload.bind(element);
          element.registerUnloadMethod = _this.registerUnloadMethod.bind(element);
          element.remove = _this.remove.bind(element);
          element.getComponentByName = _this.getComponentByName.bind(_this); 
          element.addHandler = _this.addHandler.bind(element);
          element.addMetaTag = _this.addMetaTag;
          element.loadResources = _this.loadResources;
          element.loadJSAsync = _this.loadJSAsync;
          element.loadJS = _this.loadJS;
          element.loadCSSAsync = _this.loadCSSAsync;
          element.loadCSS = _this.loadCSS;
          element.loadGroup = _this.loadGroup.bind(_this);
          element.renderAssembly = _this.renderAssembly.bind(_this);
          element.renderComponent = _this.renderComponent.bind(_this);
          element.observerStart = _this.observerStart;
          element.importAssemblyModule = _this.importAssemblyModule;
          element.methodsToRemove = [];
          element.assemblies = _this.assemblies;

          if (element.onBeforeState) {
            if (element.onBeforeState.constructor.name === 'AsyncFunction') {
              await element.onBeforeState();
            }
            else {
              element.onBeforeState();
            }
          }

          if (config.state  && element.setState) {
            for (let sname in config.state) {
              if (typeof config.state[sname] === 'function') {
                config.state[sname] = config.state[sname].call(element);
              }
            }

            element.setState(config.state);
          }

          if (config.stateMap) {
            config.state_map = new Map();
            for (let key in config.stateMap) {
              config.state_map.set(key, config.stateMap[key]);
            }
          }
          if (config.state_map) {
            config.state_map.forEach(function(method, path) {
              if (!_this.stateMap.has(path)) {
                _this.stateMap.set(path, []);
              }
              _this.stateMap.get(path).push({
                component: element,
                method: method
              });
            });
          }

          if (element.onBeforeHooks) {
            element.onBeforeHooks();
          }

          

          // invoke any hooks

          let hooks = _this.componentHooks.get(assemblyName);

          if (config.hooks && hooks) {
            config.hooks.forEach(function(hook) {
              if (hooks.has(config.componentName)) {
                let componentHook = hooks.get(config.componentName);
                if (componentHook.has(hook)) {
                  try {
                    componentHook.get(hook).call(element, config.state);
                  }
                  catch(err) {
                    if (log) {
                      console.log('Unable to execute hook ' + name + ' for ' + config.componentName);
                      console.log(err);
                    }
                  }
                }
              }
            });
          }

          if (element.onAfterHooks) {
            element.onAfterHooks();
          }

          if (config.children && config.children[0] && element.childrenTarget) {
            if (assemblyName) {
              //console.log('assemblyName: ' + assemblyName);
              //console.log(config.children);
              config.children[0].assemblyName = assemblyName;
            }
            await _this.loadGroup(config.children, element.childrenTarget, context);
            await loadComponent(no + 1);
          }
          else {
            await loadComponent(no + 1);
          }
        //});
      }
    }
    await loadComponent(0);
  },
  renderAssembly: async function(args, targetElement, context, load_args) {
    let name;
    if (!targetElement && !context && typeof args === 'object') {
      targetElement = args.targetElement;
      context = args.context;
      load_args = args.load_args;
      name = args.name;
    }
    else {
      name = args;
    }

    load_args = load_args || {};
    load_args.golgi = this;

    if (!targetElement) return;
    if (!context) return;
    if (!name) return;
    if (name === '') return;

    if (!this.assemblies.has(name)) {
      let path = context.assemblyPath;
      if (path === '') path = './';
      if (path.slice(-1) !== '/') {
        path = path + '/';
      }
      let _module = await import(path + name + '.js');
      let assemblyObj = _module.load(load_args);
      let json = assemblyObj.json || {};
      if (assemblyObj.gx) {
        json = this.parse(assemblyObj.gx);
      }
      let assemblyObject = {
        component: json,
        hooks: assemblyObj.hooks
      }

      // save the assembly into the registered assemblies object

      this.prepareAssembly(name, assemblyObject);
    }
    let assemblyObj = this.assemblies.get(name);

    return await this.loadGroup(assemblyObj, targetElement, context);
  },

  async renderComponent(componentName, targetElement, context) {

    if (targetElement === 'body') {
      targetElement = document.getElementsByTagName('body')[0];
    }

    let noOfInstances = targetElement.getElementsByTagName(componentName).length;

    let assembly = [{
      componentName: componentName
    }];
    if (!this.componentHooks.has(componentName)) {
      this.componentHooks.set(componentName, new Map());
    }
    await this.loadGroup(assembly, targetElement, context);
    return targetElement.getElementsByTagName(componentName)[noOfInstances];
  },
  getParentComponent(options) {
    options = options || {};
    if (typeof options === 'string') {
      options = {match: options};
    }
    let prefix = options.prefix || this.tagName.split('-')[0];
    function findParent(node) {
      node = node.parentNode;
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
  getComponentByName(componentName, name, parentNode) {
    //let customComponentElement = this.getCustomComponentElement(componentName, name);
    //if (customComponentElement) return customComponentElement;
    parentNode = parentNode || document;
    let node = [...parentNode.getElementsByTagName(componentName)];
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
    if (log) {
      console.log('onUnload ' + this.name);
      console.log(this);
    }
    if (this.listeners) {
      this.listeners.forEach(function(listener) {
        if (log) {
          console.log('removing listener');
          console.log(listener);
        }
        listener.target.removeEventListener(listener.type, listener.fn);
      });
    }
    this.methodsToRemove.forEach(function(method) {
      if (log) {
        console.log('invoking custom unload method');
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
          getChildren(child);
          if (child.isComponent) {
            child.parentNode.removeChild(child);
          }
        }
      });
    }
    getChildren(this);
    this.parentNode.removeChild(this);
  },
  parse: function(input) {
    let xml = '<xml>' + input + '</xml>';
    let parser = new DOMParser();
    let dom = parser.parseFromString(xml, 'text/xml');

    let component = [];

    function getChildren(element, comp) {
      let children = [...element.childNodes];
      children.forEach(function(child) {
        if (child.nodeType === 1) {
          let component = {
            componentName: child.tagName
          };
          if (child.hasAttributes()) {
            if (!child.tagName.includes('-')) {
              component.attributes = {};
              let attrs = [...child.attributes];
              attrs.forEach(function(attr) {
                component.attributes[attr.name] = attr.value;
              });
            }
            else {
              component.state = {};
              let attrs = [...child.attributes];
              let attrObjs = {};
              attrs.forEach(function(attr) {
                let value = attr.value;
                if (value === 'true') {
                  value = true;
                }
                else if (value === 'false') value = false;
                else {
                  try {
                    value = JSON.parse(value);
                  }
                  catch(err) {
                  }
                }

                if (attr.name === 'golgi-hook') {
                  component.hooks = [value];
                }

                else if (attr.name === 'golgi-stateMap') {
                  let stateKey = value.split(':')[0];
                  if (!component.state_map) {
                    component.state_map = new Map();
                  }
                  component.state_map.set(stateKey, value.split(':')[1]);
                }

                else if (attr.name === 'golgi-appendTo') {
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
    console.log('running observerStart on this:');
    console.log(this);
    if (this.observerCallback) {
      golgi.observer.observe(this, {
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
        el = el.parentElement;
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
  state: new Proxy({}, {
    set: function(obj, prop, value) {

      let jpath = [];

      function applyState(mapKey, value) {
        //console.log('trying to apply state for mapKey ' + mapKey + ' = ' + value);
        //console.log(golgi.stateMap);
        if (golgi.stateMap.has(mapKey)) {
          golgi.stateMap.get(mapKey).forEach((mapObj) => {
            let state = {};
            state[mapObj.method] = value;
            mapObj.component.setState(state); 
          });
        }
      }

      function getProps(parentProp, obj) {
        console.log('getProps called for ' + parentProp);
        console.log(obj);
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
      if (typeof value === 'string') {
        applyState(prop, value);
      }      

      return true;
    }
  })
};

export {golgi};
