export function load() {

  let componentName = 'sbadmin-nav-link';
  let count = -1;

  customElements.define(componentName, class sbadmin_nav_link extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<a class="nav-link" href="golgi:bind=href">golgi:bind=text</a>
      `;

      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }
    
    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      else {
        this.golgi_state[this.stateMapName] = state;
      }
    }

    onBeforeState() {
      this.stateMapName = 'nav-link-' + this.name;
      this.addStateMap(this.stateMapName);
    }

  });
};
