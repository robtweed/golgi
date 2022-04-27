module.exports = {
  name: 'conduit-signup',
  html: `
<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign Up</h1>
        <p class="text-xs-center">
          <a href="#" golgi:on_click="switchToLogin">Have an account?</a>
        </p>
        <ul class="error-messages" golgi:prop="errorsEl"></ul>
        <form golgi:on_submit="signup">
          <fieldset>
            <fieldset class="form-group">
              <input golgi:prop="username" class="form-control form-control-lg" type="text" placeholder="Username">
            </fieldset>
            <fieldset class="form-group">
              <input golgi:prop="email" class="form-control form-control-lg" type="email" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input golgi:prop="password" class="form-control form-control-lg" type="password" placeholder="Password">
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
      if (state.root) {
        this.root = state.root;
        state.root.login_page = this;
      }
    }

    // handlers

    async signup(e) {
      e.preventDefault();
      this.errorsEl.textContent = '';
      let response = await this.rootComponent.apis.registerUser(this.username.value, this.email.value, this.password.value);
      if (response.errors) {
        this.rootComponent.addErrors(response.errors, this.errorsEl);
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

    switchToLogin() {
      let obj = {returnTo: this.returnTo};
      this.rootComponent.switchToPage('login', obj);
    }

    // other methods

    onSelected(obj) {
      this.rootComponent.clearErrors(this.errorsEl);
      this.username.value = '';
      this.email.value = '';
      this.password.value = '';
      if (obj) this.returnTo = obj.returnTo;
    }

  `
};
