export function load(ctx) {

  const gx=`
<conduit-root golgi:hook="initialise" golgi:stateMap="user" />
  `;

  const hooks = {
    'conduit-root': {
      initialise: async function() {
        if (ctx.apis && ctx.jwt_decode) {
          this.apis = ctx.apis(ctx).apis;     
          await this.loginWithJWT();
          this.switchToPage('home_page');
        }
      }
    }
  };
  return {gx, hooks};
};
