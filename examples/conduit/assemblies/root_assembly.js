export function load(ctx) {

  const gx=`
<conduit-root golgi:hook="initialise" golgi:stateMap="user">
  <script src="../conduit/js/auth0/jwt-decode.min.js" await="true"/> 

  <css src="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />
  <css src="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" />
  <css src="//demo.productionready.io/main.css" />
  <css src="../conduit/css/styles.css" />
  <meta charset="utf-8" />
</conduit-root>
  `;

  const hooks = {
    'conduit-root': {
      initialise: async function() {
        let {apis} = await import('../js/rest-apis.js');
        this.apis = apis(ctx).apis;

        await this.loginWithJWT();
        await this.switchToPage('home_page');
      }
    }
  };

  return {gx, hooks};
};
