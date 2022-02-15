export function load() {

  let componentName = 'sbadmin-card-title';
  let count = -1;

  customElements.define(componentName, class sbadmin_row extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<div>
  <i class="fas me-1" golgi-prop="iTag"></i>
  <span golgi-prop="textEl" />
</div>
      `;
      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }
    
    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.iconClass) {
        if (this.iconClass) {
          this.iTag.classList.remove(this.iconClass);
        }
        let cls = 'fa-' + state.iconClass;
        this.iTag.classList.add(cls);
        this.iconClass = cls;
      }
      if (state.title) {
        this.textEl.textContent = state.title;
      }
    }
    
  });
};
