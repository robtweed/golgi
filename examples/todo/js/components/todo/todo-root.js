export function load(ctx) {
  let componentName = 'todo-root';

  customElements.define(componentName, class todo_root extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      const html = `
<style>


.todoapp {
    margin: 130px 0 40px 0;
    position: relative;
}

h1 {
    position: relative;
    top: -30px;
    width: 100%;
    font-size: 120px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
}

</style>

<section class="todoapp">
  <h1>todos</h1>
  <span golgi:prop="childrenTarget"></span>
</section>

      `;
      this.shadowRoot.innerHTML = `${html}`;
      this.name = componentName + '-0';
    }

    updateState(todos) {

      // iterate through rendered item components and
      //  update their state based on the display mode

      //  count the active tasks along the way

      let countActive = 0;
      let showClearBtn = false;

      let itemComponentArray = this.getComponentsByName('todo-item');

      for (let itemComponent of itemComponentArray) {
        let todo = todos.byId[itemComponent.todoId];
        if (todo) {
          if (todo.completed) {
            showClearBtn = true;
          }
          else {
            countActive++;
          }
          itemComponent.updateState(todos);
        }
        else {
          itemComponent.remove();
        }
      }

      // show or hide the toggle

      this.itemGroup.showToggle();

      // now update the appearance of the footer

      this.footer.updateState(todos, countActive, showClearBtn);

    }

    async renderTodo(id) {
      let itemComponent = await this.renderComponent('todo-item', this.itemGroup.itemHolder, this.context);
      itemComponent.todoId = id;
    }

    async populate(todos) {
      for (let id in todos.byId) {
        await this.renderTodo(id);
      }
    }

  });
};