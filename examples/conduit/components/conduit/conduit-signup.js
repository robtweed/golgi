/*

 ----------------------------------------------------------------------------
 | golgi-conduit: RealWorld Conduit UI Golgi Library                         |
 |                                                                           |
 | Copyright (c) 2022 M/Gateway Developments Ltd,                            |
 | Redhill, Surrey UK.                                                       |
 | All rights reserved.                                                      |
 |                                                                           |
 | http://www.mgateway.com                                                   |
 | Email: rtweed@mgateway.com                                                |
 |                                                                           |
 |                                                                           |
 | Licensed under the Apache License, Version 2.0 (the "License");           |
 | you may not use this file except in compliance with the License.          |
 | You may obtain a copy of the License at                                   |
 |                                                                           |
 |     http://www.apache.org/licenses/LICENSE-2.0                            |
 |                                                                           |
 | Unless required by applicable law or agreed to in writing, software       |
 | distributed under the License is distributed on an "AS IS" BASIS,         |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  |
 | See the License for the specific language governing permissions and       |
 |  limitations under the License.                                           |
 ----------------------------------------------------------------------------

 22 February 2022

*/

export function load() {

  const componentName = 'conduit-signup';

  customElements.define(componentName, class conduit_signup extends HTMLElement {
    constructor() {
      super();

      const html = `
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
      `;

      this.html = `${html}`;
    }

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

  });
}
