export function load() {

  let componentName = 'sbadmin-nav-link';
  let count = -1;

  customElements.define(componentName, class sbadmin_nav_link extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<a class="nav-link" href=""#"></a>
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

    disconnectedCallback() {
      this.onUnload();
    }

  });
};
