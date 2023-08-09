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
   <strong golgi:prop="counter"></strong>
   item<span golgi:prop="plural">s</span> left
  </span>

  <ul class="filters">
    <li>
      <a href="#" golgi:prop="allSelector" class="selected" golgi:on_click="showAll">All</a>
    </li>
    <li>
      <a href="#" golgi:prop="activeSelector" golgi:on_click="showActive">Active</a>
    </li> 
    <li>
      <a href="#" golgi:prop="completedSelector" golgi:on_click="showCompleted">Completed</a>
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

    updateState(todos, countActive, showClearBtn) {
      this.displayFooter();
      this.counter.textContent = countActive;
      this.showPlural(countActive !== 1);
      this.displayMode(todos.mode);
      this.showClearBtn(showClearBtn);
    }

    displayFooter() {
      // hide the footer if there are no items

      let itemGroupComponent = this.getComponentsByName('todo-item-group')[0];
      let headerComponent = this.getComponentsByName('todo-header')[0];

      if (itemGroupComponent.count === 0) {
        this.hide();
        headerComponent.input.focus();
      }
      else {
        this.show();
      }
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
      this.context.setDisplayMode('all');
    }

    showActive() {
      this.context.setDisplayMode('active');
    }

    showCompleted() {
      this.context.setDisplayMode('completed');
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

    clearCompletedItems() {
      this.context.deleteAllCompletedTodos();
    }


  });
};