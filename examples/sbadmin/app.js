async function run() {

  const {golgi} = await import('../../src/golgi.js');


  let context = {
    componentPaths: {
      sbadmin: '../examples/sbadmin/components/sbadmin/',
      chart: '../examples/sbadmin/components/chart/'
    },
    assemblyPath: '../examples/sbadmin/assemblies/'
  };

  golgi.setLog(true);

  await golgi.renderAssembly('root_assembly', 'body', context);
}

run();






