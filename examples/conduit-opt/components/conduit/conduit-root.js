function load(){let t="conduit-root",e=-1;customElements.define(t,class extends HTMLElement{constructor(){super(),e++;this.html=`<div class="d-flex flex-column"><nav class="navbar navbar-light"><div class="container"><a class="navbar-brand" href="#" golgi:prop="headerTitle" golgi:on_click="home_page">conduit</a><ul id="header" class="nav navbar-nav pull-xs-right"><li class="nav-item"><!-- Add "active" class when you're on that page" --> <a class="nav-link active" href="#" golgi:prop="homeLink" golgi:on_click="home_page">Home</a></li><li class="nav-item"><a class="nav-link" href="#" golgi:prop="signInLink" golgi:on_click="login">Sign in</a></li><li class="nav-item"><a class="nav-link" href="#" golgi:prop="signUpLink" golgi:on_click="signup">Sign up</a></li><li class="nav-item"><a class="nav-link" href="#" golgi:prop="newPostLink" golgi:on_click="new_article"><i class="ion-compose"></i> New Post</a></li><li class="nav-item"><a class="nav-link" href="#" golgi:prop="settingsLink" golgi:on_click="settings"><i class="ion-gear-a"></i> Settings</a></li><li class="nav-item"><a class="nav-link" href="#" golgi:prop="userLink" golgi:on_click="profile"><img class="user-img" src="golgi:bind=userImage" golgi:prop="userImg" decoding="async"> <span golgi:prop="username">golgi:bind=username</span></a></li></ul></div></nav><div class="container-fluid" golgi:prop="contentTarget"></div><footer><div class="container"><a href="/" class="logo-font" golgi:prop="footerTitle">conduit</a> <span class="attribution" golgi:prop="footerAttribution">An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.</span></div></footer></div>`,this.name=t+"-"+e}onBeforeState(){this.contentPages=new Map,this.pageComponent=new Map,this.pageData=new Map,this.navLinks=new Map,this.defaultImage="https://static.productionready.io/images/smiley-cyrus.jpg",this.context.conduit&&this.context.conduit.defaultImage&&(this.defaultImage=this.context.conduit.defaultImage),this.addEventListener("apisReady",async()=>{this.context.apis&&this.context.jwt_decode&&(console.log("apisReady event triggered in root assembly"),this.apis=this.context.apis(this.context).apis,await this.loginWithJWT(),this.switchToPage("home_page"))}),this.navLinks.set("homeLink",this.homeLink),this.navLinks.set("signInLink",this.signInLink),this.navLinks.set("signUpLink",this.signUpLink),this.navLinks.set("newPostLink",this.newPostLink),this.navLinks.set("settingsLink",this.settingsLink),this.navLinks.set("userLink",this.userLink),this.showLoggedOutOptions()}settings(){this.switchToPage("settings")}home_page(){this.switchToPage("home_page")}login(){this.switchToPage("login")}signup(){this.switchToPage("signup")}new_article(){this.switchToPage("new_article")}profile(){var t={author:this.user.username};this.switchToPage("profile",t)}setPageActive(t,e){let i;for(i of this.contentPages.values())i.hide();(i=this.contentPages.get(t)).show();let s=this.pageComponent.get(t);s&&s.onSelected&&s.onSelected(e)}async switchToPage(t,e){this.contentPages.has(t)||await this.renderAssembly(t,this.contentTarget,this.context),this.setPageActive(t,e)}setState(t){t.title&&(this.headerTitle.textContent=t.title)}setActiveNavLink(t){let e;for(e of this.navLinks.values())e.classList.remove("active");(e=this.navLinks.get(t)).classList.add("active")}async addArticles(t,e,i){await this.renderComponentMap("conduit-article-preview",e,this.context,t,i)}normaliseArticles(t){let i=[];return t.articles&&t.articles.forEach(t=>{let e=t.author.image;e&&""!==e||(e=this.defaultImage),i.push({slug:t.slug,author:t.author.username,date:this.formatDate(t.createdAt),title:t.title||"",text:t.body,favoritesCount:t.favoritesCount||"",image:e,tags:t.tagList,following:t.author.following,favorited:t.favorited||!1})}),{articlesArr:i,articlesCount:t.articlesCount}}removeArticles(t){this.removeAllByName("conduit-article-preview",t),t.textContent=""}async addPagination(e,i,s,n){if(console.log("addPagination..."),console.log(e),console.log(i),console.log(s),console.log(n),(n=n||10)<e){let t=Math.floor(e/n);0<e%n&&t++,console.log("*** noOfLinks = "+t);for(let e=0;e<t;e++){let t=await this.renderComponent("conduit-pagination-link",i,this.context);t.setState({no:e+1,limit:n,classification:s})}}}removePagination(t){this.removeAllByName("conduit-pagination-link",t)}getContentPage(t){return this.contentPages.get(t)}show(t){t.style="display:"}hide(t){t.style="display: none"}formatDate(t){let e=new Date(t);return["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()]+" "+e.getDate()+", "+e.getFullYear()}showLoggedOutOptions(){this.show(this.signInLink),this.show(this.signUpLink),this.hide(this.newPostLink),this.hide(this.settingsLink),this.hide(this.userLink)}showLoggedInOptions(){this.hide(this.signInLink),this.hide(this.signUpLink),this.show(this.newPostLink),this.show(this.settingsLink),this.show(this.userLink),this.golgi_state.user={userImage:this.user.image||this.defaultImage,username:this.user.username}}async addErrors(t,e){this.clearErrors(e);let i;for(i in t)for(var s of t[i]){let t=await this.renderComponent("conduit-error",e,this.context);t.setText(i+" "+s)}}clearErrors(t){this.removeAllByName("conduit-error",t)}async loginWithJWT(){let t=localStorage.getItem("conduit-jwt");var e;t&&(1e3*this.context.jwt_decode(t).exp<Date.now()?(t=null,localStorage.removeItem("conduit-jwt")):"error"===(e=await this.apis.getUser(t)).status||e.errors||e.error?(log&&(console.log("getUser error:"),console.log(e)),t=null,localStorage.removeItem("conduit-jwt"),delete this.rootComponent.jwt):this.loggedIn(e.user))}loggedIn(t){""===t.image&&(t.image=this.defaultImage||"");var e=t.token;this.jwt=e,this.context.jwt=e,localStorage.setItem("conduit-jwt",e),this.user=t,this.pageComponent.has("home_page")&&this.pageComponent.get("home_page").refresh_home_page()}loggedOut(){delete this.jwt,delete this.context.jwt,delete this.user,localStorage.removeItem("conduit-jwt");["home_page","new_article","article","profile","signup","login","settings"].forEach(t=>{let e=this.getComponentByName("CONDUIT-CONTENT-PAGE",t);e&&(e.remove(),this.contentPages.delete(t),this.pageComponent.delete(t))}),this.switchToPage("home_page")}isLoggedIn(){return!!this.jwt}})}export{load};