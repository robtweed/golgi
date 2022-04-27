module.exports = {
  name: 'conduit-settings',
  html: `
<div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>
        <ul class="error-messages" golgi:prop="errorsEl"></ul>
        <form golgi:on_submit="submitSettings">
          <fieldset>
              <fieldset class="form-group">
                <input golgi:prop="image" value="golgi:bind=image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input golgi:prop="username" value="golgi:bind=username" class="form-control form-control-lg" type="text" placeholder="Username">
              </fieldset>
              <fieldset class="form-group">
                <textarea golgi:prop="bio" value="golgi:bind=bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input golgi:prop="email" value="golgi:bind=email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input golgi:prop="password" value="golgi:bind=password" class="form-control form-control-lg" type="password" placeholder="New Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
          </fieldset>
        </form>
        <hr />
        <button class="btn btn-outline-danger" golgi:on_click="logout">
          Or click here to logout.
        </button>
      </div>

    </div>
  </div>
</div>
  `,
  methods: `

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    // handlers

    async submitSettings(e) {
      e.preventDefault();
      let params = {
        bio: this.bio.value,
        email: this.email.value,
        image: this.image.value,
        username: this.username.value,
        password: this.password.value
      };
        
      let results = await this.rootComponent.apis.updateUser(params);
      if (results.errors) {
        this.rootComponent.addErrors(results.errors, this.errorsEl);
      }
      else {
        this.rootComponent.loggedIn(results.user);

        if (this.returnTo) {
          let obj = {
            author: results.user.username
          }
          this.rootComponent.switchToPage(this.returnTo, obj);
        }
        else {
          this.rootComponent.switchToPage('home_page');
        }
      }
    }

    logout() {
      this.rootComponent.loggedOut();
    }

    // other methods

    show(el) {
      el.style = 'display:';
    }

    hide(el) {
      el.style = 'display: none';
    }

    onSelected(obj) {

      if (obj && obj.returnTo) this.returnTo = obj.returnTo;

      let user = this.rootComponent.user;

      this.golgi_state.settings_form = {
        image: user.image,
        username: user.username,
        bio: user.bio,
        email: user.email,
        password: ''
      };

      // clear down any errors

      this.rootComponent.clearErrors(this.errorsEl);
    }

    onBeforeState() {
      this.addStateMap('settings_form');
    }

  `
};
