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

 22 February 2022

*/

export function load() {

  const componentName = 'conduit-profile';

  customElements.define(componentName, class conduit_profile extends HTMLElement {
    constructor() {
      super();

      const html = `
<div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img src="golgi:bind=image" class="user-img" decoding="async" />
          <h4>golgi:bind=username</h4>
          <p>golgi:bind=bio</p>
          <button class="btn btn-sm btn-outline-secondary action-btn" golgi:prop="followBtn" golgi:on_click="followToggle">
            <i class="ion-plus-round"></i>
            &nbsp;
            <span>golgi:bind=followToggle</span>
            &nbsp;
            <span>golgi:bind=username</span> 
          </button>
          <button class="btn btn-sm btn-outline-secondary action-btn" golgi:prop="editProfileBtn" golgi:on_click="editSettings">
            <i class="ion-gear-a"></i>
            &nbsp; Edit Profile Settings
          </button>
        </div>

      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <a class="nav-link active" href="#" golgi:prop="myArticlesLink" golgi:on_click="showMyArticles">My Articles</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" golgi:prop="favouritedArticlesLink" golgi:on_click="showFavoritedArticles">Favorited Articles</a>
            </li>
          </ul>
        </div>

        <div>
          <div golgi:prop="myArticles">
            <div golgi:prop="myArticlesPreview"></div>
            <nav>
              <ul golgi:prop="myArticlesPagination"></ul>
            </nav>
          </div>
          <div golgi:prop="favouritedArticles">
            <div golgi:prop="favouritedArticlesPreview"></div>
            <nav>
              <ul golgi:prop="favouritedArticlesPagination"></ul>
            </nav>
          </div>
        </div>

      </div>
    </div>
  </div>
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

    async followToggle() {
      if (!this.rootComponent.isLoggedIn()) {
        let obj = {returnTo: 'profile'};
        this.rootComponent.switchToPage('login', obj);
      }
      else {
        if (this.profile && this.profile.following === false) {
          let results = await this.rootComponent.apis.follow(this.profile.username);
          if (!results.error) {
            this.profile = this.normaliseProfile(results.profile);
            this.golgi_state.profile = this.profile;
            this.rootComponent.pageComponent.get('home_page').refresh_home_page();
          }
        }
        else {
          let results = await this.rootComponent.apis.unfollow(this.profile.username);
          if (!results.error) {
            this.profile = this.normaliseProfile(results.profile);
            this.golgi_state.profile = this.profile;
            this.rootComponent.pageComponent.get('home_page').refresh_home_page();
          }
        }
      }
    }

    showMyArticles() {
      this.show(this.myArticles);
      this.hide(this.favouritedArticles);
      if (!this.myArticlesLink.classList.contains('active')) {
        this.myArticlesLink.classList.add('active');
      }
      if (this.favouritedArticlesLink.classList.contains('active')) {
        this.favouritedArticlesLink.classList.remove('active');
      }
      if (!this.myArticlesPreview.hasChildNodes()) {
        this.fetchMyArticles();
      }
    }

    showFavoritedArticles() {
      this.show(this.favouritedArticles);
      this.hide(this.myArticles);
      if (!this.favouritedArticlesLink.classList.contains('active')) {
        this.favouritedArticlesLink.classList.add('active');
      }
      if (this.myArticlesLink.classList.contains('active')) {
        this.myArticlesLink.classList.remove('active');
      }
      /*
      if (this.noFavArticlesYet) {
        this.favouritedArticlesPreview.textContent = '';
        this.noFavArticlesYet = false;
      }
      */
      if (!this.favouritedArticlesPreview.hasChildNodes()) {
        this.fetchFavouritedArticles();
      }
    }

    editSettings() {
      let obj = {returnTo: 'profile'}
      this.rootComponent.switchToPage('settings', obj);
    }

    // other methods

    async fetchArticles(offset, limit, param) {
      let results = await this.rootComponent.apis.getArticlesList(offset, limit, param);
      return this.rootComponent.normaliseArticles(results);
    }

    async fetchMyArticles(offset) {
      offset = offset || 0;
      let limit = 5;
      let param = {
        author: this.profile.username
      };
      let articlesObj = await this.fetchArticles(offset, limit, param);

      if (articlesObj.articlesCount === 0) {
        this.myArticlesPreview.innerHTML = '<div class="article-preview">No articles are here...yet</div>';
      }
      else {
        this.rootComponent.addArticles(articlesObj.articlesArr, this.myArticlesPreview, 'my_articles');
        if (!this.myPaginationDisplayed) {
          //console.log('*** add my pagination ***');
          await this.rootComponent.addPagination.call(this, articlesObj.articlesCount, this.myArticlesPagination, 'my-articles', limit);
          this.myPaginationDisplayed = true;
        }
      }
    }

    async fetchFavouritedArticles(offset) {
      offset = offset || 0;
      let limit = 5;
      let param = {
        favourited: this.profile.username
      };
      let articlesObj = await this.fetchArticles(offset, limit, param);

      if (articlesObj.articlesCount === 0) {
        this.favouritedArticlesPreview.innerHTML = '<div class="article-preview">No articles are here...yet</div>';
      }
      else {

        this.rootComponent.addArticles(articlesObj.articlesArr, this.favouritedArticlesPreview, 'fav_articles');
        if (!this.favouritedPaginationDisplayed) {
          //console.log('*** add favorited pagination ***');
          await this.rootComponent.addPagination.call(this, articlesObj.articlesCount, this.favouritedArticlesPagination, 'favourited-articles', limit);
          this.favouritedPaginationDisplayed = true;
        }
      }
    }

    async getAndDisplayProfile(author) {
      let profile = await this.rootComponent.apis.getProfile(author);
      this.profile = this.normaliseProfile(profile);

      this.golgi_state.profile = this.profile;

      this.removeMyArticles();
      this.removeFavouritedArticles();
      this.showMyArticles();

      if (this.rootComponent.isLoggedIn() && this.rootComponent.user.username === this.profile.username) {
        // hide follow button - don't want to follow yourself
        this.hide(this.followBtn);
        this.show(this.editProfileBtn);
      }
      else {
        this.show(this.followBtn);
        this.hide(this.editProfileBtn);
      }
    }

    normaliseProfile(profile) {
      if (profile.following === false) {
        profile.followToggle = 'Follow';
      }
      else {
        profile.followToggle = 'Unfollow';
      }
      if (!profile.bio) profile.bio = '';
      if (!profile.image) profile.image = this.rootComponent.defaultImage;
      return profile;
    }

    getAndDisplayArticles(offset, classification) {
      // triggered by pagination link

      if (classification === 'my-articles') {
        this.rootComponent.removeArticles(this.myArticlesPreview);
        this.fetchMyArticles(offset)
      }
      else if (classification === 'favourited-articles') {
        this.rootComponent.removeArticles(this.favouritedArticlesPreview);
        this.fetchFavouritedArticles(offset)
      }
    }

    removeMyArticles() {
      this.rootComponent.removeArticles(this.myArticlesPreview);
      this.rootComponent.removePagination.call(this, this.myArticlesPagination);
      this.myPaginationDisplayed = false;
      // in case it's got "no articles yet" added
      this.myArticlesPreview.textContent = '';
    }

    removeFavouritedArticles() {
      this.rootComponent.removeArticles(this.favouritedArticlesPreview);
      this.rootComponent.removePagination.call(this, this.favouritedArticlesPagination);
      this.favouritedPaginationDisplayed = false;
      // in case it's got "no articles yet" added
      this.favouritedArticlesPreview.textContent = '';
    }

    show(el) {
      el.style = 'display:';
    }

    hide(el) {
      el.style = 'display: none';
    }

    onSelected(obj) {
        this.getAndDisplayProfile(obj.author);
    }

  });
}

