const {golgi} = await import('/golgi/golgi.js');


let context = {
  componentPaths: {
    sbadmin: '/golgi/components/sbadmin/',
    chart: '/golgi/components/chart/'
  },
  assemblyPath: '/golgi/assemblies/'
};

golgi.setLog(true);

await golgi.renderAssembly('root_assembly', 'body', context);

console.log(golgi);


/*
  
If using CDN sources, change the JS resource paths above to:

        {
          path: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js',
          args: {
            'cross-origin': 'anonymous'
          }
        },
        {
          path: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
          args: {
            'cross-origin': 'anonymous'
          },
          await: true
        },

For chart set js resource path to:

         {
           path: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js',
           args: {
            'cross-origin': 'anonymous'
           },
           await: true
         }

*/





