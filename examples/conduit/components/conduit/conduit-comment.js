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

 21 February 2022

*/

export function load() {

  const componentName = 'conduit-comment';

  customElements.define(componentName, class conduit_comment extends HTMLElement {
    constructor() {
      super();

      const html = `
<div class="card">
  <div class="card-block">
    <p class="card-text">golgi:bind=body</p>
  </div>
  <div class="card-footer">
    <a href="#" class="comment-author" golgi:on_click="profile">
      <img src="golgi:bind=image" class="comment-author-img" alt="golgi:bind=author" decoding="async" />
    </a>
    &nbsp;
    <a href="#" class="comment-author" golgi:on_click="profile">golgi:bind=author</a>
    <span class="date-posted">golgi:bind=date</span>
    <span class="mod-options" golgi:prop="deleteIcon" golgi:on_click="deleteComment">
      <i class="ion-trash-a"></i>
    </span>
  </div>
</div>
      `;

      this.html = `${html}`;
    }

    // handlers

    profile() {
      if (this.comment && this.comment.author) {
        let obj = {author: this.comment.author};
        this.rootComponent.switchToPage('profile', obj);
      }
    }

    async deleteComment() {
      console.log('deleting ' + JSON.stringify(this.comment, null, 2));
      let results = await this.rootComponent.apis.deleteComment(this.comment.slug, this.comment.id);
      if (!results.error) {
        this.remove();
      }
    }

    // when state updated

    onDataUpdated(comment) {
      this.comment = comment;

      // display comment icon only if logged in user was the comment author

      if (this.rootComponent.isLoggedIn() && this.rootComponent.user.username === comment.author) {
        this.show(this.deleteIcon);
      }
      else {
        this.hide(this.deleteIcon);
      }
    }

    show(el) {
      el.style = 'display:';
    }

    hide(el) {
      el.style = 'display: none';
    }  

  });
}
