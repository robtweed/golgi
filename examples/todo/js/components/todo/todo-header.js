export function load(ctx) {
  let componentName = 'todo-header';

  customElements.define(componentName, class todo_header extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      const html = `
<style>

.base {
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
    font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.4em;
}

.new-todo {
    padding: 16px 16px 16px 60px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgb(0 0 0 / 3%);
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    outline: 0;
    position: relative;
    margin: 0;
    width: 100%;
    line-height: 1.4em;
    color: inherit;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

input:placeholder-shown {
   font-style: italic;
   opacity: 0.6;
}
  
</style>

<header class="base">
  <input class="new-todo" placeholder="What needs to be done?" autofocus="" golgi:prop="input" golgi:on_change="addTodo">
</header>
      `;
      this.shadowRoot.innerHTML = `${html}`;
      this.name = componentName + '-0';      
    }

    async addTodo() {
      let id = this.context.createTodo(this.input.value);
      let itemComponent = await this.context.mainComponent.addItem(id, this.input.value, false);
      this.context.registerItemComponent(id, itemComponent);
      this.input.value = '';
    }

  });
};