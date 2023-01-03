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
<div class="td" status="golgi:bind=status; golgi:observer=applyStatus" style="golgi:bind=style">golgi:bind=name; golgi:observer=textChange</div>
<div class="td">golgi:bind=price</div>
  `,
  methods: `
    applyStatus(value) {
      if (value === 'show') this.show();
      if (value === 'hide') this.hide();
    }

    textChange(value, targetTag, originalTag) {
      console.log('*** textChange ***');
      console.log(value);
      console.log(targetTag);
      console.log(originalTag);
      console.log(this);
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

