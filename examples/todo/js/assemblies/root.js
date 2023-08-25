export function load() {

  let gx=`
<todo-root>
  <todo-header golgi:ref="header" />
  <todo-item-group golgi:ref="itemGroup" />
  <todo-footer golgi:ref="footer" />
</todo-root>
  `;

  return {gx};
};