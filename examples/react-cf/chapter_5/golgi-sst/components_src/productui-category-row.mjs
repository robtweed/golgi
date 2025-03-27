let def = {
  name: 'productui-category-row',
  useShadowDOM: true,
  html: `
<style>
.td {
  display: table-cell;
  font-weight: bold;
}
.colspan {
  max-width: 1px;
  overflow: visible;
  white-space: nowrap;
}
:host {
  display: table-row;
}
</style>
<div class="td colspan">golgi:bind=category</div>
  `
};
export {def};
