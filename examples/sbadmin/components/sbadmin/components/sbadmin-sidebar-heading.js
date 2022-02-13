export function load() {

  let componentName = 'sbadmin-sidebar-heading';
  let count = -1;

  customElements.define(componentName, class sbadmin_sidebar_heading extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<div class="sb-sidenav-menu-heading"></div>
      `;

      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.text) {
        this.rootElement.textContent = state.text;
      }
    }
    
    disconnectedCallback() {
      this.onUnload();
    }
    
  });
};
