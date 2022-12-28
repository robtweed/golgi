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
      this.rows = [];
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
        this.rows.push(row);
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
      for (const [index, product] of this.context.PRODUCTS.entries()) {
        let row = this.rows[index];
        if (this.context.filter !== '') {
          if (product.name.toLowerCase().includes(this.context.filter)) {
            row.visibility(only_instock, product.stocked);
          }
          else {
            row.hide();
          }
        }
        else {
          row.visibility(only_instock, product.stocked);
        }
      }
    }

  });
};
