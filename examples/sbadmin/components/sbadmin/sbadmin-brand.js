export function load() {

  let componentName = 'sbadmin-brand';
  let count = -1;

  customElements.define(componentName, class sbadmin_brand extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<a golgi-component-class="navbar-brand" class="navbar-brand ps-3" href="#"></a>
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
      if (state.href) {
        this.rootElement.href = state.href;
      }
    }
    
  });
};
