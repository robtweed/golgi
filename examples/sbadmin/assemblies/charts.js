export function load(args) {
  let gx=`
<sbadmin-content-page name="charts" golgi:hook="configure">
  <sbadmin-content-heading text="Charts" />
</sbadmin-content-page>
  `;

  let hooks = {
    'sbadmin-content-page': {
      configure: function() {
        console.log('**** configuring sbadmin-content-page ' + this.name);
        console.log(this.context);
        let _this = this;
        this.onSelected = function() {
          console.log('Page ' + _this.name + ' selected');
        }
      }
    }
  }

  return {gx, hooks};
};