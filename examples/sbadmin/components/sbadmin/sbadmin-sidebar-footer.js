export function load() {

  let componentName = 'sbadmin-sidebar-footer';
  let count = -1;

  customElements.define(componentName, class sbadmin_sidebar_footer extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<div golgi:component-class="sb-sidenav-footer" />
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
