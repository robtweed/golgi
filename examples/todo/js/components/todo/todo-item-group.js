export function load(ctx) {
  let componentName = 'todo-item-group';

  customElements.define(componentName, class todo_item_group extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      const html = `
<style>

.main {
    position: relative;
    z-index: 2;
    border-top: 1px solid #e6e6e6;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
    font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.4em;
}

.toggle-all {
    text-align: center;
    border: none;
    opacity: 0;
    position: absolute;
}

.toggle-all + label:before {
	content: '>';
	font-size: 30px;
	color: #aeaeae;
	padding: 10px 27px 10px 27px;
}

.toggle-all + label {
    width: 60px;
    height: 34px;
    font-size: 0;
    position: absolute;
    top: -52px;
    left: -13px;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
}

.todo-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.hidden {
  display: none;
}


</style>

<section class="main">
  <input id="toggle-all" type="checkbox" class="toggle-all" golgi:on_change="toggleClicked"/>
  <label for="toggle-all" golgi:prop="toggle" class="hidden">Mark all as complete</label>
  <ul class="todo-list" golgi:prop="itemHolder"></ul>
</section>

      `;
      this.shadowRoot.innerHTML = `${html}`;
      this.name = componentName + '-0';
    }

    async renderTodo(id, updateFooterState) {
      let itemComponent = await this.renderComponent('todo-item', this.itemHolder, this.context);
      itemComponent.todoId = id;
      if (updateFooterState) this.context.footerComponent.updateState();
    }

    showToggle() {
      if (this.count > 0) {
        this.toggle.classList.remove('hidden');
      }
      else {
        this.toggle.classList.add('hidden');
      }
    }

    toggleClicked() {
      let allCompleted = true;
      this.forEachItem((itemComponent) => {
        if (!this.context.isTodoCompleted(itemComponent.todoId)) {
          allCompleted = false;
          return true;  // break the loop early
        }
      });
     
      if (!allCompleted) {
        this.completeAll();
      }
      else {
        this.uncompleteAll();
      }
    }

    completeAll() {
      this.forEachItem((itemComponent) => {
        this.context.completeTodo(itemComponent.todoId);
      });
      this.context.footerComponent.updateState();
    }

    uncompleteAll() {
      this.forEachItem((itemComponent) => {
        this.context.uncompleteTodo(itemComponent.todoId);
      });
      this.context.footerComponent.updateState();
    }

    clearCompletedItems() {
      this.forEachItem((itemComponent) => {
        if (this.context.isTodoCompleted(itemComponent.todoId)) {
          itemComponent.destroy();
        }
      });
    }

    get count() {
      return [...this.itemHolder.children].length;
    }

    forEachItem(callback) {
      for (let itemComponent of [...this.itemHolder.children]) {
        let res;
        if (callback) res = callback(itemComponent);
        if (res) break;
      }
    }

    async forEachItemAsync(callback) {
      for (let itemComponent of [...this.itemHolder.children]) {
        let res;
        if (callback) res = await callback(itemComponent);
        if (res) break;
      }
    }

  });
};