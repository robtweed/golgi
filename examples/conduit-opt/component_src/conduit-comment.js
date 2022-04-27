module.exports = {
  name: 'conduit-comment',
  html: `
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
  `,
  methods: `

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

  `
};
