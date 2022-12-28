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
<div class="td" status="golgi:bind=status" style="golgi:bind=style">golgi:bind=name</div>
<div class="td">golgi:bind=price</div>
      `;
      this.shadowRoot.innerHTML = `${html}`;
    }

    onBeforeState() {
     this.observerStart();
    }

    observerCallback(mutation) {
      if (mutation.attributeName === 'status') {
        let status = mutation.target.getAttribute('status');
        if (status !== 'undefined') this[status]();
      }
    }

    show() {
      this.style = "display: '';";
    }

    hide() {
      this.style = "display: none;";
    }

  });
};
