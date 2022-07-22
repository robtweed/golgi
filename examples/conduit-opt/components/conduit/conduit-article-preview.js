function load(){let t="conduit-article-preview",i=-1;customElements.define(t,class extends HTMLElement{constructor(){super(),i++;this.html='<div class="article-preview"><div class="article-meta"><a href="#" golgi:prop="authorImgLink" golgi:on_click="profile"><img src="golgi:bind=image" decoding="async"></a><div class="info"><a href="#" golgi:prop="authorEl" golgi:on_click="profile">golgi:bind=author</a> <span golgi:prop="dateEl">golgi:bind=date</span></div><button class="btn btn-outline-primary btn-sm pull-xs-right" golgi:prop="favoritedBtn" golgi:on_click="favorite_toggle"><i class="ion-heart"></i> <span golgi:prop="favoritesCountEl">golgi:bind=favoritesCount</span></button></div><a href="#" class="preview-link" golgi:prop="articleLink" golgi:on_click="displayArticle"><h1>golgi:bind=title</h1><p>golgi:bind=text</p><span class="preview-readmore">Read more...</span><ul class="tag-list" golgi:prop="tagListEl"></ul></a></div>',this.name=t+"-"+i}setState(t){t.name&&(this.name=t.name)}displayArticle(){this.rootComponent.switchToPage("article",{slug:this.slug})}async favorite_toggle(){var t;this.rootComponent.isLoggedIn()?this.favorited?(t=await this.rootComponent.apis.unfavourite(this.slug)).error||this.toggleFavoritedBtn(t.article.favorited,t.article.favoritesCount):(t=await this.rootComponent.apis.favourite(this.slug)).error||this.toggleFavoritedBtn(t.article.favorited,t.article.favoritesCount):this.rootComponent.switchToPage("login",{returnTo:"home_page"})}profile(){var t;this.author&&(t={author:this.author},this.rootComponent.switchToPage("profile",t))}toggleFavoritedBtn(t,i){this.favorited=t,this.favoritesCountEl.textContent=i,this.setFavoritedBtnStyle()}setFavoritedBtnStyle(){this.favorited?(this.favoritedBtn.classList.add("btn-primary"),this.favoritedBtn.classList.remove("btn-outline-primary")):(this.favoritedBtn.classList.remove("btn-primary"),this.favoritedBtn.classList.add("btn-outline-primary")),this.favoritedBtn.blur()}async onDataUpdated(t){this.favorited=t.favorited,this.setFavoritedBtnStyle(),this.slug=t.slug,this.author=t.author,t.tags&&await this.renderComponentMap("conduit-article-tag",this.tagListEl,this.context,t.tags,"slug_"+t.slug)}})}export{load};