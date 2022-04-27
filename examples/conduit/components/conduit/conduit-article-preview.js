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

 27 April 2022

*/

export function load() {

  let componentName = 'conduit-article-preview';
  let count = -1;

  customElements.define(componentName, class conduit_article_preview extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<div class="article-preview">
  <div class="article-meta">
    <a href="#" golgi:prop="authorImgLink" golgi:on_click="profile">
      <img src="golgi:bind=image" decoding="async" />
    </a>
    <div class="info">
      <a href="#" golgi:prop="authorEl" golgi:on_click="profile">golgi:bind=author</a>
      <span golgi:prop="dateEl">golgi:bind=date</span>
    </div>
    <button class="btn btn-outline-primary btn-sm pull-xs-right" golgi:prop="favoritedBtn" golgi:on_click="favorite_toggle">
      <i class="ion-heart"></i>
      <span golgi:prop="favoritesCountEl">golgi:bind=favoritesCount</span>
    </button>
  </div>
  <a href="#" class="preview-link" golgi:prop="articleLink" golgi:on_click="displayArticle">
    <h1>golgi:bind=title</h1>
    <p>golgi:bind=text</p>
    <span class="preview-readmore">Read more...</span>
    <ul class="tag-list" golgi:prop="tagListEl"></ul>
  </a>
</div>
      `;

      this.html = `${html}`;
    }

    setState(state) {

      if (state.name) {
        this.name = state.name;
      }

    }

    // handlers

    displayArticle() {
      this.rootComponent.switchToPage('article', {slug: this.slug});
    }

    async favorite_toggle() {
      if (!this.rootComponent.isLoggedIn()) {
        let obj = {returnTo: 'home_page'};
        this.rootComponent.switchToPage('login', obj);
        return;
      }

      if (!this.favorited) {
        let results = await this.rootComponent.apis.favourite(this.slug);
        if (!results.error) {
          this.toggleFavoritedBtn(results.article.favorited, results.article.favoritesCount);
        }
      }
      else {
        let results = await this.rootComponent.apis.unfavourite(this.slug);
        if (!results.error) {
          this.toggleFavoritedBtn(results.article.favorited, results.article.favoritesCount);
        }
      }
    }

    profile() {
      if (this.author) {
        let obj = {author: this.author};
        this.rootComponent.switchToPage('profile', obj);
      }
    }

    // other methods

    toggleFavoritedBtn(favorited, number) {
      this.favorited = favorited;
      this.favoritesCountEl.textContent = number;
      this.setFavoritedBtnStyle();
    }

    setFavoritedBtnStyle() {
      if (!this.favorited) {
        this.favoritedBtn.classList.remove('btn-primary');
        this.favoritedBtn.classList.add('btn-outline-primary');      
      }
      else {
        this.favoritedBtn.classList.add('btn-primary');
        this.favoritedBtn.classList.remove('btn-outline-primary'); 
      }
      this.favoritedBtn.blur();
    }

    // state updated

    async onDataUpdated(article) {

      this.favorited = article.favorited;
      this.setFavoritedBtnStyle();

      this.slug = article.slug;
      this.author = article.author;

      if (article.tags) {
        await this.renderComponentMap('conduit-article-tag', this.tagListEl, this.context, article.tags, 'slug_' + article.slug);
      }
    }
  });
}
