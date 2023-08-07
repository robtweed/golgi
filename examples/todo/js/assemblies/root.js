export function load() {

  let gx=`
<todo-root>
  <todo-header />
  <todo-main golgi:hook="configure" />
  <todo-footer golgi:hook="configure" />
</todo-root>
  `;

  let hooks = {
    'todo-main': {
      configure: function(ctx) {
        ctx.mainComponent = this;
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