function load(){let o="conduit-comment",t=-1;customElements.define(o,class extends HTMLElement{constructor(){super(),t++;this.html='<div class="card"><div class="card-block"><p class="card-text">golgi:bind=body</p></div><div class="card-footer"><a href="#" class="comment-author" golgi:on_click="profile"><img src="golgi:bind=image" class="comment-author-img" alt="golgi:bind=author" decoding="async"> </a>&nbsp; <a href="#" class="comment-author" golgi:on_click="profile">golgi:bind=author</a> <span class="date-posted">golgi:bind=date</span> <span class="mod-options" golgi:prop="deleteIcon" golgi:on_click="deleteComment"><i class="ion-trash-a"></i></span></div></div>',this.name=o+"-"+t}profile(){var o;this.comment&&this.comment.author&&(o={author:this.comment.author},this.rootComponent.switchToPage("profile",o))}async deleteComment(){console.log("deleting "+JSON.stringify(this.comment,null,2)),(await this.rootComponent.apis.deleteComment(this.comment.slug,this.comment.id)).error||this.remove()}onDataUpdated(o){this.comment=o,this.rootComponent.isLoggedIn()&&this.rootComponent.user.username===o.author?this.show(this.deleteIcon):this.hide(this.deleteIcon)}show(o){o.style="display:"}hide(o){o.style="display: none"}})}export{load};