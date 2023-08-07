export function load(ctx) {
  let componentName = 'todo-footer';

  customElements.define(componentName, class todo_footer extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      const html = `
<style>

.footer {
       background: #fff !important;
	color: #777;
	padding: 10px 15px;
	height: 20px;
	text-align: center;
	border-top: 1px solid #e6e6e6;
       font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
       position: relative;
       z-index: 2;
}

.footer.hidden {
  display: none;
}

.footer:before {
	content: '';
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 50px;
	overflow: hidden;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
	            0 8px 0 -3px #f6f6f6,
	            0 9px 1px -3px rgba(0, 0, 0, 0.2),
	            0 16px 0 -6px #f6f6f6,
	            0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

.todo-count {
	float: left;
	text-align: left;
}

.todo-count strong {
	font-weight: 300;
}

.filters {
	margin: 0;
	padding: 0;
	list-style: none;
	position: absolute;
	right: 0;
	left: 0;
}

.filters li {
	display: inline;
}

.filters li a {
	color: inherit;
	margin: 3px;
	padding: 3px 7px;
	text-decoration: none;
	border: 1px solid transparent;
	border-radius: 3px;
}

.filters li a:hover {
	border-color: rgba(175, 47, 47, 0.1);
}

.filters li a.selected {
	border-color: rgba(175, 47, 47, 0.2);
}

.clear-completed, .clear-completed:active {
    float: right;
    position: relative;
    line-height: 20px;
    text-decoration: none;
    cursor: pointer;
}

.clear-completed.hidden {
  display: none;
}

.clear-completed:hover {
  text-decoration: underline;
}

span.hidden {
  display: none;
}

button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

</style>

<footer class="footer hidden">
  <span class="todo-count">
   <strong golgi:prop="counter" data-count="golgi:bind=counter; golgi:observer=showController"></strong>
   item<span golgi:prop="plural">s</span> left
  </span>

  <ul class="filters">
    <li>
      <a href="#/all" golgi:prop="allSelector" class="selected" golgi:on_click="showAll">All</a>
    </li>
    <li>
      <a href="#/active" golgi:prop="activeSelector" golgi:on_click="showActive">Active</a>
    </li> 
    <li>
      <a href="#/completed" golgi:prop="completedSelector" golgi:on_click="showCompleted">Completed</a>
    </li>
  </ul> 

  <button class="clear-completed hidden" golgi:prop="clearBtn" golgi:on_click="clearCompletedItems">
    Clear completed
  </button>

</footer>

      `;
      this.shadowRoot.innerHTML = `${html}`;
      this.name = componentName + '-0';
    }

    showController(newValue, oldValue) {

      // mutation observer controls how count is displayed

      this.counter.textContent = newValue;

      if (!this.context.hasTodos()) {
        this.hide();
        this.context.mainComponent.showToggle(false);
      }
      else {
        this.show();
        this.context.mainComponent.showToggle(true);
        this.showPlural(+newValue !== 1);
      }

      // show clear-completed button if there are any completed tasks

      this.showClearBtn(this.context.hasCompletedTasks());
    }

    displayMode(mode) {
      if (mode === 'all') this.allSelected();
      if (mode === 'active') this.activeSelected();
      if (mode === 'completed') this.completedSelected();
    }

    allSelected() {
      this.showAllSelector(true);
      this.showActiveSelector(false);
      this.showCompletedSelector(false);
    }

    activeSelected() {
      this.showAllSelector(false);
      this.showActiveSelector(true);
      this.showCompletedSelector(false);
    }

    completedSelected() {
      this.showAllSelector(false);
      this.showActiveSelector(false);
      this.showCompletedSelector(true);
    }

    showAll() {
      this.allSelected()
      this.context.showTodos('all');
    }

    showActive() {
      this.activeSelected();
      this.context.showTodos('active');
    }

    showCompleted() {
      this.completedSelected();
      this.context.showTodos('completed');
    }

    incrementItemCount() {
      this.golgi_state.footer.counter++;
    }

    decrementItemCount() {
      this.golgi_state.footer.counter--;
    }

    clearCompletedItems() {
      this.context.clearCompletedTasks();
    }

    show() {
      this.rootElement.classList.remove('hidden');
    }

    hide() {
      this.rootElement.classList.add('hidden');
    }

    showAllSelector(show) {
      if (show) {
        this.allSelector.classList.add('selected');
      }
      else {
        this.allSelector.classList.remove('selected');
      }
    }

    showActiveSelector(show) {
      if (show) {
        this.activeSelector.classList.add('selected');
      }
      else {
        this.activeSelector.classList.remove('selected');
      }
    }

    showCompletedSelector(show) {
      if (show) {
        this.completedSelector.classList.add('selected');
      }
      else {
        this.completedSelector.classList.remove('selected');
      }
    }

    showPlural(show) {
      if (show) {
        this.plural.classList.remove('hidden');
      }
      else {
        this.plural.classList.add('hidden');
      }
    }

    showClearBtn(show) {
      if (show) {
        this.clearBtn.classList.remove('hidden');
      }
      else {
        this.clearBtn.classList.add('hidden');
      }
    }

    modifyState(obj) {
      if (!this.golgi_state.footer) this.golgi_state.footer = {};
      for (let prop in obj) {
        this.golgi_state.footer[prop] = obj[prop];
      }
    }

    onBeforeState() {

      // initial render status

      this.addStateMap('footer');

      this.modifyState({
        counter: 0
      });

      this.displayMode(this.context.getDisplayMode());

    }

  });
};