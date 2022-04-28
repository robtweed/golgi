(async () => {

  let context = {
    componentPaths: {
      conduit: '../examples/conduit-opt/components/conduit/',
    },
    assemblyPath: '../examples/conduit-opt/assemblies/',
    conduit: {
      //rest_host: 'https://conduit.productionready.io',
      rest_host: 'https://demos.mgateway.com',
      defaultImage: 'https://static.productionready.io/images/smiley-cyrus.jpg'
    },
    apisReady: new Event('apisReady'),
  };

  setTimeout(async function() {
    const {apis} = await import('./js/rest-apis.min.js');
    context.apis = apis;
    let el = document.querySelector('conduit-root');
    if (el) el.dispatchEvent(context.apisReady);
  }, 0);

  setTimeout(async function() {
    await import('js/auth0/jwt-decode.min.js');
    context.jwt_decode = jwt_decode;
    let el = document.querySelector('conduit-root');
    if (el) el.dispatchEvent(context.apisReady);
  }, 0);

  const {golgi} = await import('../../src/golgi.min.js');

  context.stateMap = golgi.stateMap;

  //golgi.setLog(true);

  golgi.fetch_ssr('conduit', context);

  // manually optimise initial performance by asynchronously pre-loading key components
  golgi.preloadComponents([
    'conduit-root',
    'conduit-content-page',
    'conduit-home-page',
    'conduit-article-preview',
    'conduit-tag',
    'conduit-article-tag'
  ], context);

  // manually optimise by pre-fetching/processing home_page assembly asynchonously

  golgi.prefetchAssembly('home_page', context);

  // all the sub-components for the root assembly should already be ready by the time it
  // tries to use them, so no dependent waiting

  await golgi.renderAssembly('root_assembly', 'body', context);

  // behind the scenes, while nothing else is happening,
  //  quietly pre-fetch all the other assemblies, so the components
  //  are already available when needed by the user

  setTimeout(function() {
    golgi.prefetchAssemblies([
      'article',
      'new_article',
      'signup',
      'settings',
      'profile',
      'login'
    ], context);
  }, 2000);


})();
