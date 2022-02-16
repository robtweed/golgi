export function load(ctx) {

  let gx=`
<sbadmin-root golgi:hook="loadContent">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" await="true" />
  <css src="/golgi/examples/sbadmin/components/sbadmin/css/styles.css" />
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