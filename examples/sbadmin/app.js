(async () => {

  const {golgi} = await import('../../src/golgi.min.js');

  let context = {
    componentPaths: {
      sbadmin: '../examples/sbadmin/components/sbadmin/',
      chart: '../examples/sbadmin/components/chart/'
    },
    assemblyPath: '../examples/sbadmin/assemblies/'
  };

  //golgi.setLog(true);

  golgi.prefetchAssembly('dashboard', context);
  await golgi.renderAssembly('root_assembly', 'body', context);

})();