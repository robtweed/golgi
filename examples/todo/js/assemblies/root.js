export function load() {

  let gx=`
<todo-root>
  <todo-header golgi:hook="configure" />
  <todo-item-group golgi:hook="configure" />
  <todo-footer golgi:hook="configure" />
</todo-root>
  `;

  let hooks = {
    'todo-header': {
      configure: function(ctx) {
        ctx.headerComponent = this;
      }
    },
    'todo-item-group': {
      configure: function(ctx) {
        ctx.itemGroupComponent = this;
      }
    },
    'todo-footer': {
      configure: function(ctx) {
        ctx.footerComponent = this;
      }
    }
  };

  return {gx, hooks};
};