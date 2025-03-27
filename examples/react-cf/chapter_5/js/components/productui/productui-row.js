export function load(ctx) {
  let componentName = 'productui-row';
  let count = -1;
  customElements.define(componentName, class productui_row extends HTMLElement {
    constructor() {
      super();
      count++;
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
      this.name = componentName + '-' + count;
      
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