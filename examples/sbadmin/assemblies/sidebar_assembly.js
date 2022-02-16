export function load() {

  let gx=`
<sbadmin-sidebar-menu>
  <sbadmin-sidebar-heading text="Core" />
  <sbadmin-sidebar-menu-item text="Dashboard" iconName="tachometer-alt" contentPage="dashboard"/>
  <sbadmin-sidebar-heading text="Interface" />
  <sbadmin-sidebar-menu-heading text="Layouts" iconName="columns">
    <sbadmin-nav-link text="Static Navigation" href="layout-static.html" />
    <sbadmin-nav-link text="Light Sidenav" href="layout-sidenav-light.html" />
  </sbadmin-sidebar-menu-heading>

  <sbadmin-sidebar-menu-heading text="Pages" iconName="book-open">

    <sbadmin-sidebar-menu-heading text="Authentication">
      <sbadmin-nav-link text="Login" href="login.html" />
      <sbadmin-nav-link text="Register" href="register.html" />
      <sbadmin-nav-link text="Forgot Password" href="forgotpassword.html" />
    </sbadmin-sidebar-menu-heading>

  </sbadmin-sidebar-menu-heading>
  <sbadmin-sidebar-heading text="Addons" />
  <sbadmin-sidebar-menu-item text="Charts" iconName="chart-area" contentPage="charts" />
  <sbadmin-sidebar-menu-item text="Tables" iconName="table" href="tables.html"/>
</sbadmin-sidebar-menu>

<sbadmin-sidebar-footer>
  <div class="small">Logged in as:</div>
  <sbadmin-span golgi:stateMap="username:text" />
</sbadmin-sidebar-footer>
  `;

  return {gx};
};
