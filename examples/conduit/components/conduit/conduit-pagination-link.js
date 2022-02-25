/*

 ----------------------------------------------------------------------------
 | golgi-conduit: RealWorld Conduit UI Golgi Library                         |
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

 21 February 2022

*/

export function load() {

  const componentName = 'conduit-pagination-link';

  customElements.define(componentName, class conduit_pagination_link extends HTMLElement {
    constructor() {
      super();

      const html = `
<li class="page-item">
  <a class="page-link" href="#" golgi:prop="link" golgi:on_click="displayBatch"></a>
</li>
      `;

      this.html = `${html}`;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.ownerPage) {
        this.ownerPage = state.ownerPage;
      }
      if (state.classification) {
        this.classification = state.classification;
      }
      if (state.limit) {
        this.limit = state.limit;
      }
      if (state.no) {
        this.no = state.no;
        this.link.textContent = state.no;
        if (this.no === 1) {
          this.active();
        }
      }
    }

    displayBatch() {
      this.active();
      let offset = ((this.no - 1) * this.limit);
      this.parentComponent.getAndDisplayArticles(offset, this.classification);
    }

    active() {
      if (!this.rootElement.classList.contains('active')) {
        this.rootElement.classList.add('active');
      }
      let activeLink = this.parentComponent.activeLink;
      if (activeLink) {
        activeLink.rootElement.classList.remove('active');
      }
      this.parentComponent.activeLink = this;
    }

  });
}
