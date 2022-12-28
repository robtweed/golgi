export function load() {

  let componentName = 'productui-row';
  
  customElements.define(componentName, class productui_row extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      const html = `
<style>
.td {
  display: table-cell;
}
:host {
  display: table-row;
}
</style>
<div class="td" golgi:prop="name"></div>
<div class="td" golgi:prop="price"></div>
      `;
      this.shadowRoot.innerHTML = `${html}`;
    }

    setState(state) {
      if (state.name) {
        this.name.textContent = state.name;
      }
      if (state.price) {
        this.price.textContent = state.price;
      }
      if (state.stocked) {
        this.name.style = 'color: black;';
      }
      else {
        this.name.style = 'color: red;';
      }
    }

  });
};
