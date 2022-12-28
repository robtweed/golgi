export function load() {
    
  let componentName = 'productui-category-row';
    
  customElements.define(componentName, class productui_category_row extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      const html = `
<style>
.td {
  display: table-cell;
  font-weight: bold;
}
.colspan {
  max-width: 1px;
  overflow: visible;
  white-space: nowrap;
}
:host {
  display: table-row;
}
</style>
<div class="td colspan">golgi:bind=category</div>
      `;
      this.shadowRoot.innerHTML = `${html}`;
    }
   
  });
};