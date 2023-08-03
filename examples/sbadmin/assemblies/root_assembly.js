export function load(ctx) {

  let gx=`
<sbadmin-root>

  <span golgi:appendTo="topbarTarget">
    <sbadmin-sidebar-toggle />
    <sbadmin-brand text="Golgi Demo" />
  </span>

  <sbadmin-footer-text golgi:appendTo="footerTarget">
    Developed using the golgi-sbadmin WebComponent Library
  </sbadmin-footer-text>

  <sbadmin-sidebar-menu golgi:appendTo="sidebarTarget">
    <sbadmin-sidebar-heading text="Core" />
    <sbadmin-sidebar-menu-item text="Dashboard" iconName="watch" contentPage="dashboard" golgi:hook="loadPage" />
    <sbadmin-sidebar-menu-item text="Carousel" iconName="repeat" contentPage="carousel" />
  </sbadmin-sidebar-menu>


  <sbadmin-sidebar-footer bgColor="#eeeeee" golgi:appendTo="sidebarTarget">
    <sbadmin-footer-text text="Not Logged In" />
  </sbadmin-sidebar-footer>

</sbadmin-root>
  `;

  let hooks = {
    'sbadmin-sidebar-menu-item': {
      loadPage: async function() {
        await this.rootComponent.switchToPage('dashboard');
      }
    }
  };

  return {gx, hooks};
};