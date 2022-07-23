let def = {
  name: 'conduit-home-page',
  html: `
<div class="home-page">
  <div class="banner" golgi:prop="bannerDiv">
    <div class="container">
      <h1 class="logo-font" golgi:prop="bannerLogoDiv">conduit</h1>
      <p golgi:prop="bannerTextDiv">A place to share your knowledge.</p>
    </div>
  </div>
  <div class="container page">
    <div class="row">
      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <a class="nav-link" href="#" golgi:prop="yourFeedLink" golgi:on_click="showYourFeed">Your Feed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="#" golgi:prop="globalFeedLink" golgi:on_click="showGlobalFeed">Global Feed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" golgi:prop="byTagFeedLink" golgi:on_click="showByTag">golgi:bind=tag</a>
            </li>
          </ul>
        </div>

        <div class="articles-content">
          <div golgi:prop="yourArticles">
            <div golgi:prop="yourArticlesPreview"></div>
            <nav>
              <ul golgi:prop="yourArticlesPagination"></ul>
            </nav>
          </div>
          <div golgi:prop="globalArticles">
            <div golgi:prop="globalArticlesPreview"></div>
            <nav>
              <ul golgi:prop="globalArticlesPagination"></ul>
            </nav>
          </div>
          <div golgi:prop="byTagArticles">
            <div golgi:prop="byTagArticlesPreview"></div>
            <nav>
              <ul golgi:prop="byTagArticlesPagination"></ul>
            </nav>
          </div>
        </div>

      </div>
      <div class="col-md-3">
        <div class="sidebar">
          <p golgi:prop="sidebarTitleEl">Popular Tags</p>
          <div golgi:prop="tagListDiv">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  methods: `

    setState(state) {
      if (state.banner) {
        if (state.banner.logo) {
          this.bannerLogoDiv.textContent = state.banner.logo;
        }
        if (state.banner.text) {
          this.bannerTextDiv.textContent = state.banner.text;
        }
      }
      if (state.name) {
        this.name = state.name;
      }
    }

    // handlers

    showGlobalFeed() {
      if (this.activeFeed !== 'global') {
        this.showGlobalArticles();
      }
    }

    showByTag() {
      if (this.activeFeed !== 'byTag') {
        this.showByTagArticles(this.feedTag);
      }
    }

    showYourFeed() {
      if (this.activeFeed !== 'your') {
        this.showYourArticles();
      }
    }

    // other methods

    sidebarOff() {
      this.sidebarTitleEl.textContent = '';
      this.tagListDiv.innerHTML = '';
    }

    async fetchArticles(offset, limit, param) {
      let results = await this.rootComponent.apis.getArticlesList(offset, limit, param);
      return this.rootComponent.normaliseArticles(results);
    }

    async fetchFeed(offset, limit) {
      let results = await this.rootComponent.apis.getArticlesFeed(offset, limit);
      return this.rootComponent.normaliseArticles(results);
    }

    async fetchGlobalArticles(offset) {
      offset = offset || 0;
      let limit = 10;
      let articlesObj = await this.fetchArticles(offset);
      this.rootComponent.addArticles(articlesObj.articlesArr, this.globalArticlesPreview, 'global_feed');
      if (!this.globalPaginationDisplayed) {
        await this.rootComponent.addPagination(articlesObj.articlesCount, this.globalArticlesPagination, 'global', limit);
        this.globalPaginationDisplayed = true;
      }
    }

    async fetchYourArticles(offset) {
      offset = offset || 0;
      let limit = 10;
      let articlesObj = await this.fetchFeed(offset, limit);
      if (articlesObj.articlesCount === 0) {
        this.yourArticlesPreview.innerHTML = '<div class="article-preview">No articles are here...yet</div>';
      }
      else {

        this.rootComponent.addArticles(articlesObj.articlesArr, this.yourArticlesPreview, 'your_articles');
        if (!this.yourPaginationDisplayed) {
          await this.rootComponent.addPagination.call(this, articlesObj.articlesCount, this.yourArticlesPagination, 'your', limit);
          this.yourPaginationDisplayed = true;
        }
      }
    }

    async fetchByTagArticles(tag, offset) {
      offset = offset || 0;
      let limit = 10;
      let params = {tag: tag};
      let articlesObj = await this.fetchArticles(offset, limit, params);

      if (articlesObj.articlesCount === 0) {
        this.byTagArticlesPreview.innerHTML = '<div class="article-preview">No articles are here...yet</div>';
      }
      else {
        this.rootComponent.addArticles(articlesObj.articlesArr, this.byTagArticlesPreview, 'byTag_' + tag);
        if (!this.byTagPaginationDisplayed) {
          await this.rootComponent.addPagination.call(this, articlesObj.articlesCount, this.byTagArticlesPagination, 'byTag', limit);
          this.byTagPaginationDisplayed = true;
        }
      }
    }

    getAndDisplayArticles(offset, classification) {
      // called by pagination-link
      this.setFeedLinkActive(classification);
      if (classification === 'global') {
        this.rootComponent.removeArticles(this.globalArticlesPreview);
        this.fetchGlobalArticles(offset);
      }
      if (classification === 'your') {
        this.rootComponent.removeArticles(this.yourArticlesPreview);
        this.fetchYourArticles(offset);
      }
      if (classification === 'byTag') {
        this.rootComponent.removeArticles(this.byTagArticlesPreview);
        this.fetchByTagArticles(this.feedTag, offset);
      }
    }

    show(el) {
      el.style = 'display:';
    }

    hide(el) {
      el.style = 'display: none';
    }

    setFeedLinkActive(classification) {
      if (classification === 'global') {
        this.globalFeedLink.classList.add('active');
        this.yourFeedLink.classList.remove('active');
        this.byTagFeedLink.classList.remove('active');
        this.activeFeed = 'global';
        return;
      }
      if (classification === 'your') {
        this.globalFeedLink.classList.remove('active');
        this.yourFeedLink.classList.add('active');
        this.byTagFeedLink.classList.remove('active');
        this.show(this.yourFeedLink);
        this.activeFeed = 'your';
        return;
      }
      if (classification === 'byTag') {
        this.globalFeedLink.classList.remove('active');
        this.yourFeedLink.classList.remove('active');
        this.byTagFeedLink.classList.add('active');
        this.show(this.byTagFeedLink);
        this.activeFeed = 'byTag';
        return;
      }
    }

    showGlobalArticles() {
      this.show(this.globalArticles);
      this.hide(this.yourArticles);
      this.hide(this.byTagArticles);
      this.setFeedLinkActive('global');
      if (!this.globalArticlesPreview.hasChildNodes()) {
        this.fetchGlobalArticles();
      }
    }

    showYourArticles() {
      this.hide(this.globalArticles);
      this.show(this.yourArticles);
      this.hide(this.byTagArticles);
      this.setFeedLinkActive('your');
      if (!this.yourArticlesPreview.hasChildNodes()) {
        this.fetchYourArticles();
      }
    }

    showByTagArticles(tag, offset, deleteFirst) {
      if (deleteFirst) {
        this.rootComponent.removeArticles(this.byTagArticlesPreview);
        this.rootComponent.removePagination(this.byTagArticlesPagination);
        this.byTagPaginationDisplayed = false;
      }
      offset = offset || 0;
      this.hide(this.globalArticles);
      this.hide(this.yourArticles);
      this.show(this.byTagArticles);
      
      this.golgi_state.tag = '#' + tag;

      this.feedTag = tag;

      this.setFeedLinkActive('byTag');
      if (!this.byTagArticlesPreview.hasChildNodes()) {
        this.fetchByTagArticles(tag, offset);
      }
    }


    async getAndDisplayTags() {
      if (!this.tagsDisplayed) {
        let tagsArr = await this.rootComponent.apis.getTags();
        if (Array.isArray(tagsArr)) {
          this.addTags(tagsArr);
          this.tagsDisplayed = true;
        }
      }
    }

    async addTags(tagArr) {
      let _this = this;
      this.renderComponentMap('conduit-tag', this.tagListDiv, this.context, tagArr, 'tags', function(tagComp, value) {
        const fn = () => {
          //fetch first batch of articles for selected tag
          // clear down any articles under the preview header tag first
          _this.showByTagArticles(value, 0, true);
        };
        this.addHandler(fn);
      });
    }

    removeTags() {
      this.removeAllByName('conduit-tag', this.tagListDiv);
      this.tagsDisplayed = false;
    }

    refresh_home_page() {
      this.rootComponent.removeArticles(this.globalArticlesPreview);
      this.rootComponent.removePagination(this.globalArticlesPagination);
      this.globalPaginationDisplayed = false;
      this.rootComponent.removeArticles(this.yourArticlesPreview);
      this.rootComponent.removePagination(this.yourArticlesPagination);
      this.yourPaginationDisplayed = false;
      this.rootComponent.removeArticles(this.byTagArticlesPreview);
      this.rootComponent.removePagination(this.byTagArticlesPagination);
      this.byTagPaginationDisplayed = false;
      this.removeTags();
      this.context.refresh_home_page = false;
    }

    onSelected(obj) {

      this.rootComponent.setActiveNavLink('homeLink')

      if (this.rootComponent.isLoggedIn()) {

        // if an article has been added or deleted...

        if (obj && obj.refresh_home_page) {
          this.refresh_home_page();
        }

        this.show(this.yourFeedLink);
        this.rootComponent.showLoggedInOptions();

        if (this.activeFeed === 'global') {
          if (!this.initialView) {
            this.showGlobalArticles();
          }
          else {
            this.showYourArticles();
          }
          this.getAndDisplayTags();
          this.initialView = false;
          return;
        }
        if (this.activeFeed === 'your') {
          this.showYourArticles();
          this.getAndDisplayTags();
          this.initialView = false;
          return;
        }
        if (this.activeFeed === 'byTag') {
          this.showByTagArticles(this.feedTag);
          this.getAndDisplayTags();
          this.initialView = false;
          return;
        }
      }
      else {
        this.hide(this.yourFeedLink);
        this.rootComponent.showLoggedOutOptions();
        this.showGlobalArticles();
        this.getAndDisplayTags();
      }
    }

    onBeforeState() {
      this.initialView = true;
      this.activeFeed = 'global';
      this.show(this.globalFeedLink);
      this.hide(this.byTagFeedLink);

      this.addStateMap('tag');

    }

  `
};
export {def};

