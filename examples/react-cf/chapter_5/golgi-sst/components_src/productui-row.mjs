let def = {
  name: 'productui-row',
  useShadowDOM: true,
  html: `
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
  `,
  methods: `

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
  `
};
export {def};
