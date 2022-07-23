let def = {
  name: 'conduit-root',
  html: `
<div class="d-flex flex-column">
  <nav class="navbar navbar-light">
    <div class="container">
      <a class="navbar-brand" href="#" golgi:prop="headerTitle" golgi:on_click="home_page">conduit</a>
      <ul id="header" class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <!-- Add "active" class when you're on that page" -->
          <a class="nav-link active" href="#" golgi:prop="homeLink" golgi:on_click="home_page">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" golgi:prop="signInLink" golgi:on_click="login">Sign in</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" golgi:prop="signUpLink" golgi:on_click="signup">Sign up</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" golgi:prop="newPostLink" golgi:on_click="new_article">
            <i class="ion-compose"></i>
            New Post
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" golgi:prop="settingsLink" golgi:on_click="settings">
            <i class="ion-gear-a"></i>
            Settings
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" golgi:prop="userLink" golgi:on_click="profile">
            <img class="user-img" src="golgi:bind=userImage" golgi:prop="userImg" decoding="async" />
            <span golgi:prop="username">golgi:bind=username</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>

  <div class="container-fluid" golgi:prop="contentTarget"></div>

  <footer>
    <div class="container">
      <a href="/" class="logo-font" golgi:prop="footerTitle">conduit</a>
      <span class="attribution" golgi:prop="footerAttribution">
        An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
      </span>
    </div>
  </footer>

</div>
  `,
  methods: `

    onBeforeState() {

      this.contentPages = new Map();
      this.pageComponent = new Map();
      this.pageData = new Map();
      this.navLinks = new Map();

      this.defaultImage = 'https://static.productionready.io/images/smiley-cyrus.jpg';
      if (this.context.conduit && this.context.conduit.defaultImage) {
        this.defaultImage = this.context.conduit.defaultImage;
      }

      this.addEventListener('apisReady', async () => {
        if (this.context.apis && this.context.jwt_decode) {
          this.apis = this.context.apis(this.context).apis;     
          await this.loginWithJWT();
          this.switchToPage('home_page');
        }
      });

      // set up map of navlinks

      this.navLinks.set('homeLink', this.homeLink);
      this.navLinks.set('signInLink', this.signInLink);
      this.navLinks.set('signUpLink', this.signUpLink);
      this.navLinks.set('newPostLink', this.newPostLink);
      this.navLinks.set('settingsLink', this.settingsLink);
      this.navLinks.set('userLink', this.userLink);

      this.showLoggedOutOptions();
    }

    // handlers...

    settings() {
      this.switchToPage('settings');
    }

    home_page() {
      this.switchToPage('home_page');
    }

    login() {
      this.switchToPage('login');
    }

    signup() {
      this.switchToPage('signup');
    }

    new_article() {
      this.switchToPage('new_article');
    }

    profile() {
      let obj = {author: this.user.username};
      this.switchToPage('profile', obj);
    }

    // other methods

    setPageActive(pageName, obj) {
      // set selected page to active
      // first hide allcontent  pages
      let page;
      for (page of this.contentPages.values()) {
        page.hide();
      }
      page = this.contentPages.get(pageName);
      page.show();

      let comp = this.pageComponent.get(pageName);
      if (comp && comp.onSelected) comp.onSelected(obj);
    }

    async switchToPage(pageName, obj) {
      if (!this.contentPages.has(pageName)) {
        await this.renderAssembly(pageName, this.contentTarget, this.context);
      }
      this.setPageActive(pageName, obj);
    }

    setState(state) {
      if (state.title) {
        this.headerTitle.textContent = state.title;
      }
    }

    setActiveNavLink(linkName) {
      let element;
      for (element of this.navLinks.values()) {
        element.classList.remove('active');
      }
      element = this.navLinks.get(linkName);
      element.classList.add('active');
    }

    // generic methods that will be used by other components

    async addArticles(articlesArr, parentDiv, arrName) {
      await this.renderComponentMap('conduit-article-preview', parentDiv, this.context, articlesArr, arrName);
    }

    normaliseArticles(results) {
      let articlesArr = [];
      if (results.articles) {
        results.articles.forEach((article) => {
          let img = article.author.image;
          if (!img || img === '') img = this.defaultImage;
          articlesArr.push({
            slug: article.slug,
            author: article.author.username,
            date: this.formatDate(article.createdAt),
            title: article.title || '',
            text: article.body,
            favoritesCount: article.favoritesCount || '',
            image: img,
            tags: article.tagList,
            following: article.author.following,
            favorited: article.favorited  || false
          });
        });
      }
      return {
        articlesArr: articlesArr,
        articlesCount: results.articlesCount
      };
    }

    removeArticles(parentDiv) {
      this.removeAllByName('conduit-article-preview', parentDiv);
      // if there were no articles, remove the "no articles here" div
      parentDiv.textContent = '';
    }

    async addPagination(articlesCount, parentDiv, classification, limit) {

      console.log('addPagination...');
      console.log(articlesCount);
      console.log(parentDiv);
      console.log(classification);
      console.log(limit);

      limit = limit || 10;
      if (articlesCount > limit) {
        let noOfLinks = Math.floor(articlesCount / limit);
        if ((articlesCount % limit) > 0) noOfLinks++;

        console.log('*** noOfLinks = ' + noOfLinks);

        for (let no = 0; no < noOfLinks; no++) {
          let link = await this.renderComponent('conduit-pagination-link', parentDiv, this.context);
          link.setState({
            no: no + 1,
            limit: limit,
            classification: classification
          });
        }
      }
    }

    removePagination(parentDiv) {
      this.removeAllByName('conduit-pagination-link', parentDiv);
    }

    getContentPage(pageName) {
      return this.contentPages.get(pageName);
    }

    show(el) {
      el.style = 'display:';
    }

    hide(el) {
      el.style = 'display: none';
    }

    formatDate(date) {
      let d = new Date(date);
      let month = ["January","February","March","April","May","June","July","August","September","October","November","December",];
      return month[d.getMonth()] + " " + d.getDate() +", " + d.getFullYear();
    }

    showLoggedOutOptions() {
      this.show(this.signInLink);
      this.show(this.signUpLink);
      this.hide(this.newPostLink);
      this.hide(this.settingsLink);
      this.hide(this.userLink);      
    }

    showLoggedInOptions() {
      this.hide(this.signInLink);
      this.hide(this.signUpLink);
      this.show(this.newPostLink);
      this.show(this.settingsLink);
      this.show(this.userLink);

      this.golgi_state.user = {
        userImage: this.user.image || this.defaultImage,
        username: this.user.username
      }
    }

    async addErrors(errors, appendTo) {
      this.clearErrors(appendTo);
      let type;
      for (type in errors) {
        for (let error of errors[type]) {
          let errorComp = await this.renderComponent('conduit-error', appendTo, this.context);
          errorComp.setText(type + ' ' + error);
        }
      }
    }

    clearErrors(parent) {
      this.removeAllByName('conduit-error', parent);
    }

    async loginWithJWT() {
      let jwt = localStorage.getItem('conduit-jwt');
      if (jwt) {
        let jwt_dec = this.context.jwt_decode(jwt);
        let exp = jwt_dec.exp * 1000;
        if (exp < Date.now()) {
          // JWT has expired, so get rid of it
          jwt = null;
          localStorage.removeItem('conduit-jwt');
        }
        else {
          //fetch user data and establish user context
          let results = await this.apis.getUser(jwt);

          // if JWT signature is invalid, secret must have changed
          // so remove the JWT from storage

          if (results.status === 'error' || results.errors || results.error) {
            if (log) {
              console.log('getUser error:');
              console.log(results);
            }
            jwt = null;
            localStorage.removeItem('conduit-jwt');
            delete this.rootComponent.jwt;
          }
          else {
            this.loggedIn(results.user);
          }
        }
      }
    }

    loggedIn(user) {
      if (user.image === '') user.image = this.defaultImage || '';
      let jwt = user.token;
      this.jwt = jwt;
      this.context.jwt = jwt;
      localStorage.setItem('conduit-jwt', jwt);
      this.user = user;
      if (this.pageComponent.has('home_page')) {
        this.pageComponent.get('home_page').refresh_home_page();
      }
    }

    loggedOut() {
      delete this.jwt;
      delete this.context.jwt;
      delete this.user;
      localStorage.removeItem('conduit-jwt');
      let pages = ['home_page', 'new_article', 'article', 'profile', 'signup', 'login', 'settings'];
      pages.forEach((page) => {
        let content_page = this.getComponentByName('CONDUIT-CONTENT-PAGE', page);
        if (content_page) {
          content_page.remove();
          this.contentPages.delete(page);
          this.pageComponent.delete(page);
        }
      });
      this.switchToPage('home_page');
    }

    isLoggedIn() {

      if (this.jwt) {
        return true;
      }
      return false;
    }
  `
};
export {def};