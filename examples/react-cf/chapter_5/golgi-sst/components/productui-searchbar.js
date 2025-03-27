export function load(ctx) {
  let componentName = 'productui-searchbar';
  let count = -1;
  customElements.define(componentName, class productui_searchbar extends HTMLElement {
    constructor() {
      super();
      count++;
      const html = `
<input type="text" placeholder="Search..." golgi:on_keyup="filter" />
<p>
  <input type="checkbox" golgi:on_click="checked" />
  &nbsp;Only show products in stock
</p>
  `;
      this.html = `${html}`;
      this.name = componentName + '-' + count;
      
    }

        onBeforeState() {
          this.only_instock = false;
          this.context.filter = '';
        }

        filter(e) {
          this.context.filter = e.target.value.toLowerCase();
          this.context.table.reformat(this.only_instock);
        }

        checked() {
          this.only_instock = !this.only_instock;
          this.context.table.reformat(this.only_instock);
        }
  
  });
};