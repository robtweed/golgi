export function load(ctx) {
  let componentName = 'todo-item';
  let count = -1;

  customElements.define(componentName, class todo_item extends HTMLElement {
    constructor() {
      super();
      count++;
      this.attachShadow({ mode: 'open' });
      const html = `
<style>

.todo {
    margin: 0;
    padding: 0;
    list-style: none;
}

.todo-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.hidden {
  display: none;
}

li {
	position: relative;
	font-size: 24px;
	border-bottom: 1px solid #ededed;
}



li.editing {
	border-bottom: none;
	padding: 0;
}

li.editing .edit {
	display: block;
	width: 506px;
	padding: 12px 16px;
	margin: 0 0 0 43px;
}

li.editing .view {
	display: none;
}

li .toggle {
	text-align: center;
	width: 40px;
	/* auto, since non-WebKit browsers doesn't support input styling */
	height: auto;
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto 0;
	border: none; /* Mobile Safari */
	-webkit-appearance: none;
	appearance: none;
}

li .toggle {
	opacity: 0;
}

li .toggle + label {

	background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
	background-repeat: no-repeat;
	background-position: center left;
}

li .toggle:checked + label {
	background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
}

li label {
	word-break: break-all;
	padding: 15px 15px 15px 60px;
	display: block;
	line-height: 1.2;
	transition: color 0.4s;
}

li.completed label {
	color: #d9d9d9;
	text-decoration: line-through;
}

li .destroy {
	display: none;
	position: absolute;
	top: 0;
	right: 10px;
	bottom: 0;
	width: 40px;
	height: 40px;
	margin: auto 0;
	font-size: 30px;
	color: #cc9a9a;
	margin-bottom: 11px;
	transition: color 0.2s ease-out;
}

li .destroy:hover {
	color: #af5b5e;
}

li .destroy:after {
	content: 'X';
}

li:hover .destroy {
	display: block;
}

li .edit.hidden {
	display: none;
}

li .edit {
	display: block;
}

li.editing:last-child {
	margin-bottom: -1px;
}
  
.edit {
    display: block;
    position: relative;
    margin: 0;
    width: 91%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    margin-left: 46px;
    outline: 0;
    border: 0;
    color: inherit;
    padding: 15px 15px 15px 15px;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0 rgb(0 0 0 / 20%);
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.view.hidden {
  display: none;
}

.view {
  display: block;
}

input[type='text']:not(.edit) {
  display: none
}

</style>

<li class="todo">
  <div class="view" golgi:prop="viewDiv">
    <input type="checkbox" class="toggle" golgi:prop="checkbox" golgi:on_change="taskCompleted"  />
    <label golgi:prop="itemText" golgi:on_dblclick="editingOn"></label>
    <button class="destroy" golgi:on_click="destroy"></button>
  </div> 
  <input type="text" class="edit hidden" golgi:prop="editField" golgi:on_blur="stopEditing" golgi:on_keydown="testForEnd" />
</li>

      `;
      this.shadowRoot.innerHTML = `${html}`;
      this.name = componentName + '-' + count;
    }

    updateState(displayMode) {
      let todo = this.context.getTodo(this.todoId);
      this.itemText.textContent = todo.text;

      this.checkbox.checked = todo.completed;
      this.strikethroughText(todo.completed);
      this.applyDisplayMode(displayMode,todo);
    }

    applyDisplayMode(displayMode, todo) {

      if (displayMode === 'active' && todo.completed) {
        this.hide();
        return;
      }
      if (displayMode === 'completed' && !todo.completed) {
        this.hide();
        return;
      }

      this.show();

    }

    strikethroughText(status) {
      if (status) {
        this.rootElement.classList.add('completed');
      }
      else {
        this.rootElement.classList.remove('completed');
      }
    }

    taskCompleted() {
      if (this.checkbox.checked) {
        this.context.completeTodo(this.todoId);
      }
      else {
        this.context.uncompleteTodo(this.todoId);
      }
      this.context.footerComponent.updateState();
    }

    editingOn() {

      // turn on the edit field

      this.editing = true;
      this.viewDiv.classList.add('hidden');
      this.editField.classList.remove('hidden');
      this.editField.value = this.itemText.textContent;
      this.editField.focus();
    }

    testForEnd(e) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        if (e.key === 'Enter') {
          this.itemText.textContent = this.editField.value.trim();
        }
        this.editingOff();
      }
    }

    stopEditing() {
      if (this.editing) {
        this.itemText.textContent = this.editField.value.trim();
        this.editingOff();
      }
    }

    editingOff() {
      let text = this.itemText.textContent;
      if (text === '') {
        this.destroy();
      }
      else {
        this.viewDiv.classList.remove('hidden');
        this.editField.classList.add('hidden');
        this.context.editTodo(this.todoId, text);
        this.context.footerComponent.updateState();
      }
      this.editing = false;
    }

    destroy() {
      this.context.deleteTodo(this.todoId);
      this.remove();
      this.context.footerComponent.updateState();
    }

    show() {
      this.rootElement.classList.remove('hidden');
    }

    hide() {
      this.rootElement.classList.add('hidden');
    }

  });
};