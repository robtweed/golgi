module.exports = {
  name: 'conduit-login',
  html: `
<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign In</h1>
        <p class="text-xs-center">
          <a href="#" golgi:on_click="signup">Need an account?</a>
        </p>
        <ul class="error-messages" golgi:prop="errorsEl"></ul>
        <form golgi:on_submit="login">
          <fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="email" placeholder="Email" golgi:prop="email">
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="password" placeholder="Password" golgi:prop="password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">Sign In</button>
          </fieldset>
        </form>
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

    async login(e) {
      e.preventDefault();
      this.errorsEl.textContent = '';
      let response = await this.rootComponent.apis.authenticateUser(this.email.value, this.password.value);
      if (response.errors) {
        this.rootComponent.addErrors(response.errors, this.errorsEl)
      }
      else {
        this.rootComponent.loggedIn(response.user);
        if (this.returnTo) {
          this.rootComponent.showLoggedInOptions();
          let obj = {returnTo: this.returnTo};
          this.rootComponent.switchToPage(this.returnTo, obj);
        }
        else {
          this.rootComponent.switchToPage('home_page');
        }
      }
    }

    signup() {
      let obj = {returnTo: this.returnTo};
      this.rootComponent.switchToPage('signup', obj);
    }

    // when page selected

    onSelected(obj) {
      this.rootComponent.clearErrors(this.errorsEl);
      this.email.value = '';
      this.password.value = '';
      if (obj) this.returnTo = obj.returnTo;
    }

  `
};
