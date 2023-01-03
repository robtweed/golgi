let def = {
  name: 'productui-searchbar',
  html: `
<input type="text" placeholder="Search..." golgi:on_keyup="filter" />
<p>
  <input type="checkbox" golgi:on_click="checked" />
  &nbsp;Only show products in stock
</p>
  `,
  methods: `
        onBeforeState() {
          this.only_instock = false;
          this.context.filter = '';
        }

        filter(e) {
          this.context.filter = e.target.value.toLowerCase();
          this.context.table.reformat(this.only_instock);
        }

        checked() {
          this.only_instock = !this.only_instock;
          this.context.table.reformat(this.only_instock);
        }
  `
};
export {def};
