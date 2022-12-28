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

    show() {
      this.style = "display: '';";
    }

    hide() {
      this.style = "display: none;";
    }

    visibility(only_instock, stocked) {
      if (only_instock) {
        // only display if in stock
        if (stocked) {
          this.show();
        }
        else {
          this.hide();
        }
      }
      else {
        this.show();
      }
    }

  });
};
