const {golgi} = await import('../../src/golgi.js');


let context = {
  componentPaths: {
    sbadmin: '../examples/sdadmin/components/sbadmin/',
    chart: '../examples/sdadmin/components/chart/'
  },
  assemblyPath: '../examples/sdadmin/assemblies/'
};

golgi.setLog(true);

await golgi.renderAssembly('root_assembly', 'body', context);






