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

 16 February 2022

 */

let log = false;
let count = 0;

let golgi = {
  dataStore: {},
  stateMap: new Map(),
  resourceLoaded: new Map(),

  setLog: function (state) {
    log = state;
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

  load: async function(componentName, targetElement, context) {

    let namespace = componentName.split('-')[0];

    if (log) console.log('*** load ' + componentName);
    let _this = this;

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
      if (log) console.log('** component ' + componentName + ' already imported');
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
        if (log) console.log('** component ' + componentName + ' had to be imported');
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
    targetElement = targetElement || 'body';
    if (targetElement === 'body') targetElement = document.getElementsByTagName('body')[0];
    context = context || {};

    if (!Array.isArray(configArr)) {
      configArr = [configArr];
    }

    //console.log(configArr);

    let assemblyName = configArr[0].assemblyName;

    let _this = this;
    let noOfComponents = configArr.length;

    async function loadComponent(no) {
      //console.log('!!! no = ' + no + '; noOfComponents: ' + noOfComponents);
      if (no === noOfComponents) {
        return;
      }
      let config = Object.assign({}, configArr[no]);
      //console.log('config:');
      //console.log(config);
      //console.log('targetElement:');
      //console.log(targetElement);
      let targetEl = targetElement;
      // optional target override
      if (config.targetElement) {
        let parent = _this.getParentComponent.call(targetEl, config.targetElement.componentName);
        //console.log('parent = ');
        //console.log(parent);
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

        if (!config.componentName.includes('-') && !config.componentName.includes(':')) {
          if (!['script', 'css', 'meta'].includes(config.componentName)) {

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
                config.children.forEach(function(c, index) {
                  config.children[index].assemblyName = assemblyName;
                });
              }
              await _this.loadGroup(config.children, element.childrenTarget, context);
              await loadComponent(no + 1);
            }
            else {
              await loadComponent(no + 1);
            }
          }
          else {
            await loadComponent(no + 1);
          }
          return;
        }

        if (config.componentName.split(':')[0] === 'assembly') {
          let assemblyName = config.componentName.split('assembly:')[1];
          //console.log(assemblyName);
          //console.log(targetEl);
          await _this.renderAssembly(assemblyName, targetEl, context);

          // invoke any hooks applied to the assembly

          if (config.hook) {
            try {
              // note that the Golgi object will be the context for an assembly hook!
              config.hook.call(_this);
            }
            catch(err) {
              if (log) {
                console.log('Unable to execute hook ' + name + ' for ' + config.componentName);
                console.log(err);
              }
            }
          }
          await loadComponent(no + 1);
 
          return;
        }

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

        let element = await _this.load(config.componentName, targetEl, context);
        if (log) {
          console.log('load element: ' + config.componentName);
          //console.log(element);
          //console.log(targetElement);
        }
        if (typeof element.html !== 'undefined') {
          element.innerHTML = element.html;
          element.rootElement = element.firstElementChild;
          //let targets = element.querySelectorAll('[class*=golgi-]');
          let targets = element.querySelectorAll('*');
          targets.forEach(function(el) {
            if (el.hasAttribute('golgi:prop')) {
              let prop = el.getAttribute('golgi:prop');
              element[prop] = el;
              el.removeAttribute('golgi:prop');
            } 
          });
          if (!element.childrenTarget) {
            element.childrenTarget = element.rootElement;
          }
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
        element.getParentComponent = _this.getParentComponent.bind(element);
        element.onUnload = _this.onUnload.bind(element);
        element.registerUnloadMethod = _this.registerUnloadMethod.bind(element);
        element.remove = _this.remove.bind(element);
        element.getComponentByName = _this.getComponentByName.bind(_this); 
        element.addHandler = _this.addHandler.bind(element);
        element.addMetaTag = _this.addMetaTag;
        element.loadResources = _this.loadResources;
        element.loadJSAsync = _this.loadJSAsync
        element.loadJS = _this.loadJS;
        element.loadCSSAsync = _this.loadCSSAsync;
        element.loadCSS = _this.loadCSS;
        element.loadGroup = _this.loadGroup.bind(_this);
        element.renderAssembly = _this.renderAssembly.bind(_this);
        element.renderComponent = _this.renderComponent.bind(_this);
        element.observerStart = _this.observerStart;
        element.methodsToRemove = [];
        element.golgi_state = _this.state;

        if (log) {
          console.log('Golgi Component instantiated and ready for use:');
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

        // invoke hook if present

        if (config.hook) {
          try {
            config.hook.call(element);
          }
          catch(err) {
            if (log) {
              console.log('Unable to execute hook ' + name + ' for ' + config.componentName);
              console.log(err);
            }
          }
        }

        if (element.onAfterHooks) {
          element.onAfterHooks();
        }

        if (config.children && config.children[0] && element.childrenTarget) {
          if (assemblyName) {
            //console.log('assemblyName: ' + assemblyName);
            //console.log(config.children);
            config.children.forEach(function(c, index) {
              config.children[index].assemblyName = assemblyName;
            });
          }
          await _this.loadGroup(config.children, element.childrenTarget, context);
          await loadComponent(no + 1);
        }
        else {
          await loadComponent(no + 1);
        }
      }
    }
    await loadComponent(0);
  },
  renderAssembly: async function(args, targetElement, context) {
    let name;
    if (!targetElement && !context && typeof args === 'object') {
      targetElement = args.targetElement;
      context = args.context;
      name = args.name;
    }
    else {
      name = args;
    }


    if (!targetElement) return;
    if (!context) return;
    if (!name) return;
    if (name === '') return;

    let path = context.assemblyPath;
    if (path === '') path = './';
    if (path.slice(-1) !== '/') {
      path = path + '/';
    }
    let _module = await import(path + name + '.js');
    let assemblyObj = _module.load.call(this, context);
    let json = assemblyObj.json || {};
    if (assemblyObj.gx) {
      json = this.parse(assemblyObj.gx, assemblyObj.hooks);
    }

    if (json) {
      if (!Array.isArray(json)) {
        json = [json];
      }
      json.forEach(function(component, index) {
        json[index].assemblyName = name;
      });
    }

    return await this.loadGroup(json, targetElement, context);
  },

  async renderComponent(componentName, targetElement, context) {

    if (targetElement === 'body') {
      targetElement = document.getElementsByTagName('body')[0];
    }

    let noOfInstances = targetElement.getElementsByTagName(componentName).length;

    let assembly = [{
      componentName: componentName
    }];
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
    if (log) {
      console.log('removing Golgi COmponent:');
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
            child.onUnload();
            child.parentNode.removeChild(child);
          }
        }
      });
    }
    getChildren(this);
    this.onUnload();
    this.parentNode.removeChild(this);
  },
  parse: function(input, hooks) {
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
            componentName: child.tagName
          };

          if (child.hasAttributes()) {

            if (!child.tagName.includes('-') && !child.tagName.includes(':')) {
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

                if (attr.name === 'golgi:hook' && hooks && hooks[child.tagName] && hooks[child.tagName][value]) {
                  component.hook = hooks[child.tagName][value];
                }

                if (attr.name === 'golgi:stateMap') {
                  let stateKey = value.split(':')[0];
                  if (!component.state_map) {
                    component.state_map = new Map();
                  }
                  component.state_map.set(stateKey, value.split(':')[1]);
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
    if (log) {
      console.log('running observerStart on this:');
      console.log(this);
    }
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
  })
};

golgi.state = new Proxy(golgi.dataStore, {

    get: function(target, prop, receiver) {

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
      setTimeout(function() {
        applyState(prop, target[prop]);
      }, 100);
      return target[prop];
    },

    set: function(obj, prop, value) {

      let jpath = [];

      function applyState(mapKey, value) {
        if (log) {
          console.log('trying to apply state for mapKey ' + mapKey + ' = ' + value);
          console.log(golgi.stateMap);
        }
        if (golgi.stateMap.has(mapKey)) {
          golgi.stateMap.get(mapKey).forEach((mapObj) => {
            let state = {};
            state[mapObj.method] = value;
            mapObj.component.setState(state); 
          });
        }
      }

      function getProps(parentProp, obj) {
        if (log) {
          console.log('getProps called for ' + parentProp);
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
      if (typeof value === 'string') {
        applyState(prop, value);
      }      

      return true;
    }
  });


export {golgi};
