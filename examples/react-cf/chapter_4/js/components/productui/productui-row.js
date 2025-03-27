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
<div class="td" status="golgi:bind=status; golgi:observer=setVisibility" style="golgi:bind=style">golgi:bind=name</div>
<div class="td">golgi:bind=price</div>
      `;
      this.shadowRoot.innerHTML = `${html}`;
    }

    onBeforeState() {
     this.observerStart();
    }

    setVisibility(value) {
      if (value === 'show') this.show();
      if (value === 'hide') this.hide();
    }

    show() {
      this.style = "display: '';";
    }

    hide() {
      this.style = "display: none;";
    }

  });
};
