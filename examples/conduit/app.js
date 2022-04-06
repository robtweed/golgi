(async () => {

  const {golgi} = await import('../../src/golgi.min.js');

  let context = {
    componentPaths: {
      conduit: '../examples/conduit/components/conduit/',
    },
    assemblyPath: '../examples/conduit/assemblies/',
    conduit: {
      //rest_host: 'https://conduit.productionready.io',
      rest_host: 'https://demos.mgateway.com',
      defaultImage: 'https://static.productionready.io/images/smiley-cyrus.jpg'
    },
    stateMap: golgi.stateMap
  };

  golgi.setLog(true);


  golgi.prefetchAssembly('home_page', context);

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
