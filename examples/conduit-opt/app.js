(async () => {

  const p1 = import('../../src/golgi.min.js');
  const p2 = import('./js/rest-apis.min.js');

  const [{golgi}, {apis}] = await Promise.all([p1, p2]);

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
    stateMap: golgi.stateMap
  };

  context.apis = apis;

  //golgi.setLog(true);

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
