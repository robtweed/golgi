export function load() {

  let gx=`
<sbadmin-root golgi-hook="loadContent" name="root">
  <script src="/golgi/components/sbadmin/js/fontawesome-5.15.3.all.min.js" />
  <script src="/golgi/components/sbadmin/js/bootstrap.bundle.min.js" await="true" />
  <css src="/golgi/components/sbadmin/css/styles.css" />
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

  <assembly-header_assembly golgi-appendTo="topbarTarget" /> 
  <assembly-footer_assembly golgi-appendTo="footerTarget" /> 
  <assembly-sidebar_assembly golgi-appendTo="sidebarTarget" /> 
</sbadmin-root>
  `;

  let hooks = {
    'sbadmin-root': {
      loadContent: async function() {
        await this.switchToPage('dashboard');
        let _this = this;
        setTimeout(function() {
          _this.golgi_state.chart = [20000, 20162, 16263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451];
        }, 5000);
      }
    }
  }

  return {gx, hooks};
};