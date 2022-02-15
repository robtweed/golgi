export function load() {

  let componentName = 'sbadmin-sidebar-menu';
  let count = -1;

  customElements.define(componentName, class sbadmin_sidebar_menu extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<div golgi-component-class="sb-sidenav-menu" class="sb-sidenav-menu">
  <div class="nav" golgi-prop="childrenTarget" />
</div>
      `;
      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }
    
  });
};
