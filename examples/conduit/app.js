(async () => {

  const {golgi} = await import('../../src/golgi.min.js');

  let context = {
    componentPaths: {
      conduit: '../examples/conduit/components/conduit/',
    },
    assemblyPath: '../examples/conduit/assemblies/',
    conduit: {
      rest_host: 'https://conduit.productionready.io',
      //rest_host: 'https://demos.mgateway.com',
      defaultImage: 'https://static.productionready.io/images/smiley-cyrus.jpg'
    },
    stateMap: golgi.stateMap
  };

  golgi.setLog(true);


  golgi.renderAssembly('root_assembly', 'body', context);

})();
