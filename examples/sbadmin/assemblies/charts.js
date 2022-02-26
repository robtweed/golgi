export function load(args) {
  let gx=`
<sbadmin-content-page name="charts" golgi:hook="configure">
  <sbadmin-content-heading text="Charts" />
</sbadmin-content-page>
  `;

  let hooks = {
    'sbadmin-content-page': {
      configure: function() {
        this.onSelected = function() {
          console.log('Page ' + this.name + ' selected');
        }
      }
    }
  }

  return {gx, hooks};
};