export function load(ctx) {

  const gx=`
<conduit-root golgi:hook="initialise" golgi:stateMap="user" />
  `;

  const hooks = {
    'conduit-root': {
      initialise: async function() {
        //let {apis} = await import('/golgi-conduit/js/rest-apis.min.js');
        this.apis = ctx.apis(ctx).apis;     
        //this.apis = apis(ctx).apis;
        await this.loginWithJWT();
        //await this.switchToPage('home_page');
        this.switchToPage('home_page');
      }
    }
  };
  return {gx, hooks};
};
