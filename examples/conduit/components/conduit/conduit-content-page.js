/*

 ----------------------------------------------------------------------------
 | golgi-conduit: RealWorld Conduit UI Golgi Library                         |
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

 20 February 2022

*/

export function load() {

  let componentName = 'conduit-content-page';
  let count = -1;

  customElements.define(componentName, class conduit_content_page extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<div class="collapse"></div>
      `;
      this.html = `${html}`;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    show() {
      this.rootElement.classList.add('show');
    }

    hide() {
      this.rootElement.classList.remove('show');
    }

    onBeforeHooks() {
      this.rootComponent.contentPages.set(this.name, this);
    }

    onChildComponentReady(childComponent) {
      // register the page component by name
      // and create its state map using the name
      this.rootComponent.pageComponent.set(this.name, childComponent);
      childComponent.name = this.name;
      childComponent.addStateMap(this.name);
    }

  });

};

