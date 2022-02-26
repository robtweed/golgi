export function load() {

  let componentName = 'sbadmin-content-heading';
  let count = -1;

  customElements.define(componentName, class sbadmin_content_heading extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<h1 class="mt-4"></h1>
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
    
  });
};
