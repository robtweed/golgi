(async () => {

  const {golgi} = await import('./golgi.min.js');

  let context = {
    componentPaths: {
      productui: './components/productui/'
    },
    assemblyPath: './productui_assemblies/'
  };
  //golgi.logging = true;

  await golgi.renderAssembly('filterable-product-table', 'body', context);


})();