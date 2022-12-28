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
        if (!categoryFound[product.category]) {
          categoryFound[product.category] = true;
          let crow = await this.renderComponent('productui-category-row', this.tbody, this.context);
          crow.setState(product);
        }
        let row = await this.renderComponent('productui-row', this.tbody, this.context);
        row.setState(product);
        this.rows.push(row);
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
