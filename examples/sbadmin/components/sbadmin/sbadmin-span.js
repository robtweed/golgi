export function load() {
    
  let componentName = 'sbadmin-span';
  let count = -1;
    
  customElements.define(componentName, class sbadmin_span extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<span></span>
      `;
    
      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }
    
    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.text) {
        console.log('text fired in sbadmin-span');
        this.rootElement.textContent = state.text;
      }
    }
    
  });
};
