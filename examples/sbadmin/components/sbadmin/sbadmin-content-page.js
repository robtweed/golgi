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
      this.ui_root = this.getParentComponent('sbadmin-root');
      this.ui_root.contentPages.set(this.name, this);
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
        for (let component of this.ui_root.contentPages.values()) {
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
    
  });
};