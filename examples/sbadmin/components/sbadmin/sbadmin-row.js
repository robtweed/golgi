export function load() {

  let componentName = 'sbadmin-row';
  let count = -1;

  customElements.define(componentName, class sbadmin_row extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<span class="row" />
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
