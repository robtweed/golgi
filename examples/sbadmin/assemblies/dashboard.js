export function load() {
  let gx=`
<sbadmin-content-page name="dashboard" golgi:hook="configure">
  <sbadmin-content-heading text="Dashboard" />
  <sbadmin-row>
    <sbadmin-card position="center" topMargin="5px" bgColor="warning" textColor="white">
      <sbadmin-card-header text="Warning Card" />
      <sbadmin-card-body text="Card body text" />
      <sbadmin-card-footer text="Footer text" />
    </sbadmin-card>
    <sbadmin-card position="center" topMargin="5px" bgColor="danger" textColor="dark">
      <sbadmin-card-header text="Danger Card" />
      <sbadmin-card-body text="Second Card body text" />
      <sbadmin-card-footer text="2nd Footer text" />
    </sbadmin-card>
    <sbadmin-card position="center" topMargin="5px" bgColor="success" textColor="dark">
      <sbadmin-card-header text="Success Card" />
      <sbadmin-card-body text="Third Card body text" />
      <sbadmin-card-footer text="3rd Footer text" />
    </sbadmin-card>
  </sbadmin-row>

</sbadmin-content-page>
  `;

  let hooks = {
    'sbadmin-content-page': {
      configure: function() {
        // how to perform additional things when page is selected
        this.on('selected', function(obj) {
          console.log(' selected');
          console.log(obj);
        });
      }
    }
  }
  return {gx, hooks};
};