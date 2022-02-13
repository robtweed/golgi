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
    
   onAfterHooks() {
      console.log(this.name + ' page loaded and hooks executed!');
      console.log('context for :' + this.name);
      console.log(this.context);
      if (!this.context.contentPages) {
        this.context.contentPages = new Map();
      }
      this.context.contentPages.set(this.name, this);
      this.context.ui_root.setPageActive(this.name);
    }

    //onSelected() {
    //  console.log('page ' + this.name + ' selected');
    //}

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.hide) {
        this.hide()
      }
      if (state.show && !this.rootElement.classList.contains('show')) {
        for (let component of this.context.contentPages.values()) {
          component.hide();
        }
        this.show();
      }
    }

    show() {
      this.rootElement.classList.add('show');
    }

    hide() {
      this.rootElement.classList.remove('show');
    }

    disconnectedCallback() {
      this.onUnload();
    }
    
  });
};