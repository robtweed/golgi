function load(){let t="conduit-article",e=-1;customElements.define(t,class extends HTMLElement{constructor(){super(),e++;this.html='<div class="article-page"><div class="banner"><div class="container"><h1>golgi:bind=title</h1><div class="article-meta"><a golgi:prop="authorImgLink" href="#" golgi:on_click="profile"><img golgi:prop="authorImg" src="golgi:bind=image" decoding="async"></a><div class="info"><a href="#" golgi:prop="authorEl" golgi:on_click="profile">golgi:bind=author</a> <span class="date">golgi:bind=date</span></div><button golgi:prop="followBtn" class="btn btn-sm btn-outline-secondary" golgi:on_click="follow_toggle"><i class="ion-plus-round"></i> &nbsp; <span class="follow-toggle">golgi:bind=following</span> <span class="follow-author">golgi:bind=author</span></button> &nbsp;&nbsp; <button golgi:prop="favouriteBtn" class="btn btn-sm btn-outline-primary" golgi:on_click="favorite_toggle"><i class="ion-heart"></i> &nbsp; <span class="favourite-toggle">golgi:bind=favorited</span> <span class="counter">golgi:bind=favoritesCount</span></button> <span golgi:prop="maintenanceEl" class="article-maintain"><button golgi:prop="editArticleBtn" class="btn btn-sm btn-outline-secondary" golgi:on_click="editArticle"><i class="ion-edit"></i> <span>Edit Article</span></button> <button golgi:prop="deleteArticleBtn" class="btn btn-sm btn-outline-danger" golgi:on_click="deleteArticle"><i class="ion-trash-a"></i> <span>Delete Article</span></button></span></div></div></div><div class="container page"><div class="row article-content"><div class="col-xs-12"><div class="content-body">golgi:bind=body</div><ul golgi:prop="tagListEl" class="tag-list"></ul></div></div><hr><div class="row"><div class="col-xs-12 col-md-8 offset-md-2"><div golgi:prop="loggedOutEl" class="not-logged-in"><p><a golgi:prop="signInEl" class="sign-in" href="#" golgi:on_click="login">Sign in</a> &nbsp;or&nbsp; <a golgi:prop="signUpEl" class="sign-up" href="#" golgi:on_click="signup">sign up</a> to add comments on this article</p></div><div golgi:prop="loggedInEl" class="logged-in"><form class="card comment-form" golgi:on_submit="postComment"><div class="card-block"><textarea golgi:prop="commentFormText" class="form-control" placeholder="Write a comment..." rows="3"></textarea></div><div class="card-footer"><img src="golgi:bind=image" class="comment-author-img" decoding="async"> <button class="btn btn-sm btn-primary">Post Comment</button></div></form></div><div golgi:prop="commentsEl" class="article-comments"></div></div></div></div></div>',this.name=t+"-"+e}async follow_toggle(){if(this.rootComponent.isLoggedIn()){let t;"Follow"===this.article.following?(t=await this.rootComponent.apis.follow(this.article.author),console.log("follow results: "+JSON.stringify(t,null,2)),t.error||(this.article.following="Unfollow",this.golgi_state.article=this.article,this.rootComponent.pageComponent.get("home_page").refresh_home_page())):(t=await this.rootComponent.apis.unfollow(this.article.author),console.log("unfollow results: "+JSON.stringify(t,null,2)),t.error||(this.article.following="Follow",this.golgi_state.article=this.article,this.rootComponent.pageComponent.get("home_page").refresh_home_page())),this.followBtn.blur()}else this.rootComponent.switchToPage("login",{returnTo:"article"})}async favorite_toggle(){var t;this.rootComponent.isLoggedIn()?("Favorite Article"===this.article.favorited?(t=await this.rootComponent.apis.favourite(this.article.slug)).error||(this.article.favoritesCount=t.article.favoritesCount,this.article.favorited="Unfavorite Article",this.golgi_state.article=this.article,this.rootComponent.pageComponent.get("home_page").refresh_home_page()):(t=await this.rootComponent.apis.unfavourite(this.article.slug)).error||(this.article.favorited="Favorite Article",this.article.favoritesCount=t.article.favoritesCount,this.golgi_state.article=this.article,this.rootComponent.pageComponent.get("home_page").refresh_home_page()),this.favoriteBtn.blur()):this.rootComponent.switchToPage("login",{returnTo:"article"})}profile(){this.context.author=this.article.author;var t={author:this.author};this.rootComponent.switchToPage("profile",t)}async postComment(o){o.preventDefault();o=await this.rootComponent.apis.addComment(this.slug,this.commentFormText.value);if(!o.error){o=this.normaliseComment(o.comment);this.commentFormText.value="";let t=await this.renderComponent("conduit-comment",this.commentsEl,this.context);var i="newComment"+ ++e;t.addStateMap(i),this.golgi_state[i]=o}}login(){this.rootComponent.switchToPage("login",{returnTo:"article"})}signup(){this.rootComponent.switchToPage("signup",{returnTo:"article"})}editArticle(){var t={editing_article:this.article};this.rootComponent.switchToPage("new_article",t)}async deleteArticle(){(await this.rootComponent.apis.deleteArticle(this.slug)).errors||this.rootComponent.switchToPage("home_page",{refresh_home_page:!0})}onDataUpdated(t){this.rootComponent.isLoggedIn()&&this.rootComponent.user.username===t.author?(this.hide(this.followBtn),this.hide(this.favouriteBtn),this.show(this.maintenanceEl)):(this.show(this.followBtn),this.show(this.favouriteBtn),this.hide(this.maintenanceEl)),t.tags&&(this.removeTags(),this.addTags(t.tags))}async addTags(t){await this.renderComponentMap("conduit-article-tag",this.tagListEl,this.context,t,"article_tags")}removeTags(){this.removeAllByName("conduit-article-tag",this.tagListEl)}async fetchArticle(t){t=await this.rootComponent.apis.getArticleBySlug(t);this.normaliseArticle(t)}normaliseArticle(t){console.log("**** normalising article *&*****"),console.log(t),t.image=t.author.image,t.tags=t.tagList,this.rootComponent.isLoggedIn()&&(t.userImage=this.rootComponent.user.image),t.date=this.rootComponent.formatDate(t.updatedAt),t.favoritesCount="("+t.favoritesCount+")",t.rawBody=t.body,t.body=this.markdownConverter.makeHtml(t.body),!1===t.author.following?t.following="Follow":t.following="Unfollow",!1===t.favorited?t.favorited="Favorite Article":t.favorited="Unfavorite Article",t.author=t.author.username,void 0!==t.image&&""!==t.image||(t.image=this.rootComponent.defaultImage),this.article=t}async getAndDisplayArticle(t){await this.fetchArticle(t);this.golgi_state.article=this.article}async getAndDisplayComments(t){this.removeComments();let i=await this.rootComponent.apis.getComments(t),e=(console.log("slug = "+t),console.log("**** comments: "+JSON.stringify(i,null,2)),this);i.forEach(function(t,o){i[o]=e.normaliseComment(t)}),await this.renderComponentMap("conduit-comment",this.commentsEl,this.context,i,"comments")}removeComments(){this.removeAllByName("conduit-comment",this.commentsEl)}async addComment(t){console.log("adding comment using:"),console.log(t);let o=await this.renderComponent("conduit-comment",this.commentsEl,this.context);o.addStateMap(o.name),this.golgi_state[o.name]=t}normaliseComment(t){return t.date=this.rootComponent.formatDate(t.updatedAt),t.image=t.author.image,void 0!==t.image&&""!==t.image||(t.image=this.rootComponent.defaultImage),t.author=t.author.username,t.slug=this.slug,t}show(t){t.style="display:"}hide(t){t.style="display: none"}onSelected(t){this.slug=t.slug,this.rootComponent.isLoggedIn()?(this.show(this.loggedInEl),this.hide(this.loggedOutEl)):(this.hide(this.loggedInEl),this.show(this.loggedOutEl)),"article"!==this.context.return_to&&(this.getAndDisplayArticle(this.slug),this.getAndDisplayComments(this.slug),this.rootComponent.homeLink.classList.contains("active")&&this.rootComponent.homeLink.classList.remove("active"))}onBeforeState(){this.markdownConverter=new showdown.Converter}})}export{load};