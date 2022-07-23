(async () => {

  let context = {
    componentPaths: {
      conduit: '../examples/conduit-opt/components/conduit/',
    },
    assemblyPath: '../examples/conduit-opt/assemblies/',
    conduit: {
      //rest_host: 'https://conduit.productionready.io',
      //rest_host: 'https://demos.mgateway.com',
      rest_host: 'https://www.mgateway.com/conduit',
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
    await import('./js/auth0/jwt-decode.min.js');
    context.jwt_decode = jwt_decode;
    let el = document.querySelector('conduit-root');
    if (el) el.dispatchEvent(context.apisReady);
  }, 0);

  const {golgi} = await import('../../src/golgi.min.js');

  context.stateMap = golgi.stateMap;

  //golgi.setLog(true);

  golgi.fetch_optimised_components('conduit', context);
  golgi.fetch_optimised_assemblies(context);

  golgi.on('assembliesLoaded', async function() {
    await golgi.renderAssembly('root_assembly', 'body', context);
  });

})();
