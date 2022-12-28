export function load() {

  let componentName = 'productui-table';
  
  customElements.define(componentName, class productui_table extends HTMLElement {
    constructor() {
      super();
      const html = `
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody golgi:prop="tbody"></tbody>
</table>
      `;
      this.html = `${html}`;
    }

    onBeforeState() {
      this.context.table = this;
    }

    async populate() {
      let categoryFound = {};

      for (const [index, product] of this.context.PRODUCTS.entries()) {
        let state_name = 'product' + index;
        if (!categoryFound[product.category]) {
          categoryFound[product.category] = true;
          let crow = await this.renderComponent('productui-category-row', this.tbody, this.context);
          crow.addStateMap(state_name);
        }
        let row = await this.renderComponent('productui-row', this.tbody, this.context);
        row.addStateMap(state_name);
        if (product.stocked) {
          product.style = 'color: black;'; 
        }
        else {
          product.style = 'color: red;'; 
        }
        this.golgi_state[state_name] = product;
      }
    }

    reformat(only_instock) {

      function visibility(stocked) {
        if (only_instock) {
          // only display if in stock
          if (stocked) {
            return 'show';
          }
          else {
            return 'hide';
          }
        }
        else {
          return 'show';
        }
      }

      for (const [index, product] of this.context.PRODUCTS.entries()) {
        if (this.context.filter !== '') {
          if (product.name.toLowerCase().includes(this.context.filter)) {
            product.status = visibility(product.stocked);
          }
          else {
            product.status = 'hide';
          }
        }
        else {
          product.status = visibility(product.stocked);
        }
        this.golgi_state['product' + index] = product;
      }
    }

  });
};
