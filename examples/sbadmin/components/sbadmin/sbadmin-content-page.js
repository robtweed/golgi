export function load() {

  let componentName = 'sbadmin-content-page';
  let count = -1;

  customElements.define(componentName, class sbadmin_content_page extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<div class="collapse multi-collapse"></div>
      `;
      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }
    

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
    
  });
};
