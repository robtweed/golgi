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
  <div class="view" golgi:prop="viewDiv" data-check="golgi:bind=checked; golgi:observer=checkChange">
    <input type="checkbox" class="toggle" golgi:prop="checkbox" golgi:on_change="taskCompleted"  />
    <label golgi:on_dblclick="editingOn">golgi:bind=value</label>
    <button class="destroy" golgi:on_click="destroy"></button>
  </div> 
  <input type="text" class="edit hidden" golgi:prop="editField" value="golgi:bind=value" golgi:on_blur="editingOff" golgi:on_keydown="testForEnd" />
</li>

      `;
      this.shadowRoot.innerHTML = `${html}`;
      this.name = componentName + '-' + count;
    }

    applyMode(mode, completed) {

      if (mode === 'active' && completed) {
        this.hide();
        return;
      }
      if (mode === 'completed' && !completed) {
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

    checkChange(check) {

      // mutation observer controls footer values and
      // updates persistent todo object
      // based on checked attribute value after
      // state change

      let mode = this.context.getDisplayMode();

      if (check === 'true') {
        this.checkbox.checked = true;
        this.strikethroughText(true);
        this.context.footerComponent.decrementItemCount();
        this.context.completeTodo(this.todoId);
        this.applyMode(mode, true)
      }
      else {
        this.checkbox.checked = false;
        this.strikethroughText(false);
        this.context.footerComponent.incrementItemCount();
        this.context.uncompleteTodo(this.todoId);
        this.applyMode(mode, false)
      }
    }

    taskCompleted() {

      if (this.checkbox.checked) {
        this.completeTask();
      }
      else {
        this.uncompleteTask();
      }
    }

    completeTask() {
      this.modifyState({
        checked: true
      });
    }

    uncompleteTask() {
      this.modifyState({
        checked: false
      });
    }

    editingOn() {

      this.originalValue = this.editField.value;

      // turn on the edit field

      this.viewDiv.classList.add('hidden');
      this.editField.classList.remove('hidden');
      this.editField.focus();
    }

    testForEnd(e) {
      if (e.key === 'Escape') {
        this.editField.value = this.originalValue;
      }
      if (e.key === 'Escape' || e.key === 'Enter') {
        this.editingOff();
      }
    }

    editingOff() {

      // turn off the edit field and transfer the new value to the UI and todos object

      let text = this.editField.value.trim();
      if (text === '') {
        this.destroy();
        return;
      }

      this.viewDiv.classList.remove('hidden');
      this.editField.classList.add('hidden');
      this.modifyState({
        value: text
      });
      this.context.editTodo(this.todoId, text);
    }

    destroy() {
      let todo = this.context.getTodo(this.todoId);
      let footerComponent = this.context.footerComponent;

      //remove this item:

      // from footer count if it had been active

      if (!todo.completed) footerComponent.decrementItemCount();

      // from persistent todos object

      this.context.deleteTodoById(this.todoId);

      // and hide the footer and toggle if no more items

      if (!this.context.hasTodos()) {
        footerComponent.hide();
        this.context.mainComponent.showToggle(false);
      }

      footerComponent.showClearBtn(this.context.hasCompletedTasks());

      // destroy this item component and its state proxy object

      delete this.golgi_state[this.name];
      this.remove();
    }

    show() {
      this.rootElement.classList.remove('hidden');
    }

    hide() {
      this.rootElement.classList.add('hidden');
    }

    modifyState(obj) {
      if (!this.golgi_state[this.name]) this.golgi_state[this.name] = {};
      for (let prop in obj) {
        this.golgi_state[this.name][prop] = obj[prop];
      }
    }

    onBeforeState() {
      this.addStateMap(this.name);

      this.modifyState({
        value: ''
      });
    }

  });
};