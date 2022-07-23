let def = {
  name: 'conduit-content-page',
  html: `
<div class="collapse"></div>
  `,
  methods: `

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    show() {
      this.rootElement.classList.add('show');
    }

    hide() {
      this.rootElement.classList.remove('show');
    }

    onBeforeHooks() {
      this.rootComponent.contentPages.set(this.name, this);
    }

    onChildComponentReady(childComponent) {
      // register the page component by name
      // and create its state map using the name
      this.rootComponent.pageComponent.set(this.name, childComponent);
      childComponent.name = this.name;
      childComponent.addStateMap(this.name);
    }
  `
};
export {def};

