export function load(ctx) {

  let gx=`
<sbadmin-root golgi:hook="loadContent">
  <script src="/golgi/components/sbadmin/js/fontawesome-5.15.3.all.min.js" />
  <script src="/golgi/components/sbadmin/js/bootstrap.bundle.min.js" await="true" />
  <css src="/golgi/components/sbadmin/css/styles.css" />
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

  <assembly:header_assembly golgi:appendTo="topbarTarget" golgi:hook="testFn" /> 
  <assembly:footer_assembly golgi:appendTo="footerTarget" /> 
  <assembly:sidebar_assembly golgi:appendTo="sidebarTarget" /> 
</sbadmin-root>
  `;

  let hooks = {
    'sbadmin-root': {
      loadContent: async function() {
        console.log('hook for sbadmin-root: this =');
        console.log(this);
        await this.switchToPage('dashboard');
        setTimeout(() => {
          this.golgi_state.chart = [20000, 20162, 16263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451];
        }, 5000);
      }
    },
    'assembly:header_assembly': {
      testFn: async function() {
        console.log('assembly-header-assembly hook triggered!');
        console.log(this);
      }
    }
  };

  return {gx, hooks};
};