const {golgi} = await import('/golgi/js/golgi.js');

let context = {
  componentPaths: {
    sbadmin: '/golgi/components/sbadmin/components/',
    chart: '/golgi/components/chart/components/'
  },
  assemblyPath: '/golgi/assemblies/',
  resourcePaths: {
    sbadmin: {
      css: [
        '/golgi/components/sbadmin/css/styles.css'
      ],
      js: [
        '/golgi/components/sbadmin/js/fontawesome-5.15.3.all.min.js',
        {
          path: '/golgi/components/sbadmin/js/bootstrap-5.1.3.bundle.min.js',
          await: true
        },
      ]
    }
    
  }
};

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

*/

golgi.setLog(true);

  // render the admin ui skeleton

let root = await golgi.renderComponent('sbadmin-root', 'body', context);

context.ui_root = root;

  // now add the various parts

golgi.renderAssembly('header_assembly', root.topbarTarget, context);
root.switchToPage('dashboard');
golgi.renderAssembly('footer_assembly', root.footerTarget, context);
await golgi.renderAssembly('sidebar_assembly', root.sidebarTarget, context);
golgi.state.username = 'Rob Tweed';

setTimeout(function() {
  golgi.state.chart = [20000, 20162, 16263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451];

  //golgi.state.chart = [];
  //golgi.state.chart.push(2000);
  

}, 2000);
