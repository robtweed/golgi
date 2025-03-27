export function load(ctx) {
  let componentName = 'productui-category-row';
  let count = -1;
  customElements.define(componentName, class productui_category_row extends HTMLElement {
    constructor() {
      super();
      count++;
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
      this.name = componentName + '-' + count;
      
    }

  });
};