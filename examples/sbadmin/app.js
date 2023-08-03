(async () => {
  async function go() {
    const {golgi} = await import('https://cdn.jsdelivr.net/gh/robtweed/golgi/src/golgi.min.js');

    let path_prefix = '../examples/sbadmin';

    let context = {
      assemblyPath: path_prefix + '/assemblies/',
      componentPaths: {
        sbadmin: 'https://robtweed.github.io/golgi-sbadmin/components/'
      }
    };

    golgi.logging = true;

    // pre-load just the initially-required components and all assemblies

    await Promise.all([
      golgi.fetch_optimised_components(context, path_prefix + '/components/golgi-components-initial.js'),
      golgi.fetch_optimised_assemblies(context, 'golgi-assemblies-all.js')
    ]);

    golgi.on('root_assembly_rendered', function() {
      // at this point we'll load the rest of the components
      // because the UI is now awaiting user input and everything is quiet

      setTimeout(function() {
        golgi.fetch_optimised_components(context, 'https://robtweed.github.io/golgi-sbadmin/components/golgi-components.js')
      }, 2000);

    });

    await golgi.renderAssembly('root_assembly', 'body', context);
  }

  document.addEventListener('DOMContentLoaded', function() {
    // wait for all defered scripts to load, so everything needed to get going in ready
    go();
  });

})();
