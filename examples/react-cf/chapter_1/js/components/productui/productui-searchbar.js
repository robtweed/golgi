export function load() {
  let componentName = 'productui-searchbar';
  customElements.define(componentName, class productui_searchbar extends HTMLElement {
    constructor() {
      super();
      const html = `
<input type="text" placeholder="Search..." />
<p>
  <input type="checkbox" />
  &nbsp;Only show products in stock
</p>
      `;
      this.html = `${html}`;
    }
  });
};
