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

  const componentName = 'conduit-article';
  let count = 0;

  customElements.define(componentName, class conduit_article extends HTMLElement {
    constructor() {
      super();

      const html = `
<div class="article-page">
  <div class="banner">
    <div class="container">
      <h1>golgi:bind=title</h1>

      <div class="article-meta">
        <a golgi:prop="authorImgLink" href="#" golgi:on_click="profile">
          <img golgi:prop="authorImg" src="golgi:bind=image" />
        </a>
        <div class="info">
          <a href="#" golgi:prop="authorEl" golgi:on_click="profile">golgi:bind=author</a>
          <span class="date">golgi:bind=date</span>
        </div>
        <button golgi:prop="followBtn" class="btn btn-sm btn-outline-secondary" golgi:on_click="follow_toggle">
          <i class="ion-plus-round"></i>
          &nbsp;
          <span class="follow-toggle">golgi:bind=following</span> 
          <span class="follow-author">golgi:bind=author</span>
        </button>
        &nbsp;&nbsp;
        <button golgi:prop="favouriteBtn" class="btn btn-sm btn-outline-primary" golgi:on_click="favorite_toggle">
          <i class="ion-heart"></i>
          &nbsp;
          <span class="favourite-toggle">golgi:bind=favorited</span>
          <span class="counter">golgi:bind=favoritesCount</span>
        </button>
        <span golgi:prop="maintenanceEl" class="article-maintain">
          <button golgi:prop="editArticleBtn" class="btn btn-sm btn-outline-secondary" golgi:on_click="editArticle">
            <i class="ion-edit"></i>
            <span> Edit Article</span>
          </button>
          <button golgi:prop="deleteArticleBtn" class="btn btn-sm btn-outline-danger" golgi:on_click="deleteArticle">
            <i class="ion-trash-a"></i>
            <span> Delete Article</span>
          </button>
        </span>
      </div>

    </div>
  </div>

  <div class="container page">

    <div class="row article-content">
      <div class="col-xs-12">
        <div class="content-body">golgi:bind=body</div>
        <ul golgi:prop="tagListEl" class="tag-list"></ul>
      </div>
    </div>
    <hr />

    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">

        <div golgi:prop="loggedOutEl" class="not-logged-in">
          <p>
            <a golgi:prop="signInEl" class="sign-in" href="#" golgi:on_click="login">Sign in</a>
            &nbsp;or&nbsp;
            <a golgi:prop="signUpEl" class="sign-up" href="#" golgi:on_click="signup">sign up</a>
            to add comments on this article          
          </p>
        </div>

        <div golgi:prop="loggedInEl" class="logged-in">

          <form class="card comment-form" golgi:on_submit="postComment">
            <div class="card-block">
              <textarea golgi:prop="commentFormText" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
              <img src="golgi:bind=userImage" class="comment-author-img" />
              <button class="btn btn-sm btn-primary">Post Comment</button>
            </div>
          </form>

        </div>

        <div golgi:prop="commentsEl" class="article-comments"></div>  

      </div>
    </div>
  </div>
</div>
      `;

      this.html = `${html}`;
    }

    // handlers

    async follow_toggle() {
      if (!this.rootComponent.isLoggedIn()) {
        let obj = {returnTo: 'article'};
        this.rootComponent.switchToPage('login', obj);
      }
      else {
        let results;
        if (this.article.following === 'Follow') {
          results = await this.rootComponent.apis.follow(this.article.author);
          console.log('follow results: ' + JSON.stringify(results, null, 2));
          if (!results.error) {
            this.article.following = 'Unfollow';
            this.golgi_state.article = this.article;
            this.rootComponent.pageComponent.get('home_page').refresh_home_page();
          }
        }
        else {
          results = await this.rootComponent.apis.unfollow(this.article.author);
          console.log('unfollow results: ' + JSON.stringify(results, null, 2));
          if (!results.error) {
            this.article.following = 'Follow';
            this.golgi_state.article = this.article;
            this.rootComponent.pageComponent.get('home_page').refresh_home_page();
          }
        }
        this.followBtn.blur();
      }
    }

    async favorite_toggle() {
      if (!this.rootComponent.isLoggedIn()) {
        let obj = {returnTo: 'article'};
        this.rootComponent.switchToPage('login', obj);
      }
      else {
        if (this.article.favorited === 'Favorite Article') {
          let results = await this.rootComponent.apis.favourite(this.article.slug);
          if (!results.error) {
            this.article.favoritesCount = results.article.favoritesCount;
            this.article.favorited = 'Unfavorite Article';
            this.golgi_state.article = this.article;
            this.rootComponent.pageComponent.get('home_page').refresh_home_page();
          }
        }
        else {
          let results = await this.rootComponent.apis.unfavourite(this.article.slug);
          if (!results.error) {
            this.article.favorited = 'Favorite Article';
            this.article.favoritesCount = results.article.favoritesCount;
            this.golgi_state.article = this.article;
            this.rootComponent.pageComponent.get('home_page').refresh_home_page();
          }
        }
        this.favoriteBtn.blur();
      }
    }

    profile() {
      this.context.author = this.article.author;
      let obj = {author: this.author};
      this.rootComponent.switchToPage('profile', obj);
    }

    async postComment(e) {
      e.preventDefault();
      let results = await this.rootComponent.apis.addComment(this.slug, this.commentFormText.value);
      if (!results.error) {
        let comment = this.normaliseComment(results.comment);
        this.commentFormText.value = '';
        let commentComp = await this.renderComponent('conduit-comment', this.commentsEl, this.context);
        count++;
        let name = 'newComment' + count;
        commentComp.addStateMap(name);
        this.golgi_state[name] = comment;
      }
    }

    login() {
      let obj = {returnTo: 'article'};
      this.rootComponent.switchToPage('login', obj);
    }

    signup() {
      let obj = {returnTo: 'article'};
      this.rootComponent.switchToPage('signup', obj);
    }

    editArticle() {
      let obj = {editing_article: this.article};
      this.rootComponent.switchToPage('new_article', obj);
    }

    async deleteArticle() {
      let results = await this.rootComponent.apis.deleteArticle(this.slug);
      if (!results.errors) {
        let obj = {refresh_home_page: true};
        this.rootComponent.switchToPage('home_page', obj);
      }
    }

    // after state update

    onDataUpdated(article) {

      if (this.rootComponent.isLoggedIn() && this.rootComponent.user.username === article.author) {
        // remove Follow and favourite buttons so unable to follow/favourite yourself!
        this.hide(this.followBtn);
        this.hide(this.favouriteBtn);
        this.show(this.maintenanceEl);
      }
      else {
        this.show(this.followBtn);
        this.show(this.favouriteBtn);
        this.hide(this.maintenanceEl);
      }

      if (article.tags) {
        this.removeTags();
        this.addTags(article.tags);
      }
    }

    // other methods

    async addTags(tags) {
      await this.renderComponentMap('conduit-article-tag', this.tagListEl, this.context, tags, 'article_tags');
    }

    removeTags() {
      this.removeAllByName('conduit-article-tag', this.tagListEl);
    }

    async fetchArticle(slug) {
      let article = await this.rootComponent.apis.getArticleBySlug(slug);
      this.normaliseArticle(article);
    }

    normaliseArticle(article) {
      console.log('**** normalising article *&*****');
      console.log(article);
      article.image = article.author.image;
      article.tags = article.tagList;
      if (this.rootComponent.isLoggedIn()) {
        article.userImage = this.rootComponent.user.image;
      }
      article.date = this.rootComponent.formatDate(article.updatedAt);
      article.favoritesCount = '(' + article.favoritesCount + ')';
      article.rawBody = article.body; // for use if edited
      article.body = this.markdownConverter.makeHtml(article.body)
      if (article.author.following === false) {
        article.following = 'Follow';
      }
      else {
        article.following = 'Unfollow';
      }
      if (article.favorited === false) {
        article.favorited = 'Favorite Article';
      }
      else {
        article.favorited = 'Unfavorite Article';
      }
      article.author = article.author.username;

      if (typeof article.image === 'undefined' || article.image === '') {
        article.image = this.rootComponent.defaultImage;
      }
      this.article = article;
    }

    async getAndDisplayArticle(slug) {

      let article = await this.fetchArticle(slug);
      this.golgi_state.article = this.article;
    }

    async getAndDisplayComments(slug) {
      this.removeComments();
      // note: api picks up current slug from context object
      let comments = await this.rootComponent.apis.getComments(slug);
      console.log('slug = ' + slug);
      console.log('**** comments: ' + JSON.stringify(comments, null, 2));

      // normalise comments object

      let _this = this;
      comments.forEach(function(comment, index) {
        comments[index] = _this.normaliseComment(comment);
      });

      await this.renderComponentMap('conduit-comment', this.commentsEl, this.context, comments, 'comments');
    }

    removeComments() {
      this.removeAllByName('conduit-comment', this.commentsEl);
    }

    async addComment(comment) {
      console.log('adding comment using:');
      console.log(comment);
      let commentComp = await this.renderComponent('conduit-comment', this.commentsEl, this.context);
      commentComp.addStateMap(commentComp.name);
      this.golgi_state[commentComp.name] = comment;

    }

    normaliseComment(comment) {
      comment.date = this.rootComponent.formatDate(comment.updatedAt);
      comment.image = comment.author.image;
      comment.author = comment.author.username;
      comment.slug = this.slug;
      return comment;
    }

    show(el) {
      el.style = 'display:';
    }

    hide(el) {
      el.style = 'display: none';
    }

    onSelected(obj) {

      this.slug = obj.slug;

      if (this.rootComponent.isLoggedIn()) {
        this.show(this.loggedInEl);
        this.hide(this.loggedOutEl);
      }
      else {
        this.hide(this.loggedInEl);
        this.show(this.loggedOutEl);
      }

      if (this.context.return_to === 'article') {
        // returned here after login so no need to update the article content
        return;
      }

      this.getAndDisplayArticle(this.slug);
      this.getAndDisplayComments(this.slug);

      // change home link display status in top-right navs
      if (this.rootComponent.homeLink.classList.contains('active')) {
        this.rootComponent.homeLink.classList.remove('active');
      }
    }

    onBeforeState() {

      this.markdownConverter = new showdown.Converter();

    }

  });
}
