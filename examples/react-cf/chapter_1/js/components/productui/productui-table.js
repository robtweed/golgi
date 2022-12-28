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

    async populate(PRODUCTS) {
      let categoryFound = {};

      for (const [index, product] of PRODUCTS.entries()) {
        if (!categoryFound[product.category]) {
          categoryFound[product.category] = true;
          let crow = await this.renderComponent('productui-category-row', this.tbody, this.context);
          crow.setState(product);
        }
        let row = await this.renderComponent('productui-row', this.tbody, this.context);
        row.setState(product);
      }
    }

  });
};
