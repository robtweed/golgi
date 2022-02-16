export function load() {

  let gx=`
<sbadmin-sidebar-menu>
  <sbadmin-sidebar-heading text="Core" />
  <sbadmin-sidebar-menu-item text="Dashboard" iconName="tachometer-alt" contentPage="dashboard"/>
  <sbadmin-sidebar-menu-item text="Charts" iconName="chart-area" contentPage="charts" />
</sbadmin-sidebar-menu>

<sbadmin-sidebar-footer>
  <div class="small">Logged in as:</div>
  <sbadmin-span golgi:stateMap="username:text" />
</sbadmin-sidebar-footer>
  `;

  return {gx};
};
