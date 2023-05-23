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

 23 February 2022

*/

export function load() {

  const componentName = 'conduit-new-article-tag';

  customElements.define(componentName, class conduit_new_article_tag extends HTMLElement {
    constructor() {
      super();

      const html = `
<span class="tag-default tag-pill">
  <i class="ion-close-round" golgi:on_click="removeTag"></i>
  <span>golgi:bind</span>
</span>
      `;

      this.html = `${html}`;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    removeTag() {

      // remove from tagList array in the conduit-new-article parent component

      let index = this.parentComponent.tagList.indexOf(this.text);
      if (index > -1) {
        this.parentComponent.tagList.splice(index, 1);
      }
      // now remove tag component
      this.remove();
    }

    onDataUpdated(dataObj) {
      this.text = dataObj;
    }

  });
}
