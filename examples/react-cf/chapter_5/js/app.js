(async () => {

  const {golgi} = await import('./golgi.min.js');

  let context = {
    componentPaths: {
      productui: './components/productui/'
    },
    assemblyPath: './assemblies/'
  };
  golgi.logging = true;

  golgi.fetch_optimised_components(context, './components/productui/golgi-components-all.js');
  golgi.fetch_optimised_assemblies(context, 'golgi-assemblies-all.js');

  golgi.on('assembliesLoaded', async function() {
    console.log('this.assemblies:');
    console.log(this.assemblies);
    await golgi.renderAssembly('filterable-product-table', 'body', context);
  });

})();