export function load() {

  let componentName = 'sbadmin-sidebar-menu-item';
  let count = -1;

  customElements.define(componentName, class sbadmin_sidebar_menu_item extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<a class="nav-link" golgi:prop="aTag" href="#" golgi:on_click="switchPage">
  <div class="sb-nav-link-icon">
    <i class="fas" golgi:prop="iconElement"></i>
  </div>
  <span golgi:prop="textTarget"></span>
</a>
      `;
      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.contentPage) {
        this.contentPage = state.contentPage;
      }
      if (state.text) {
        this.textTarget.textContent = state.text;
      }
      if (state.iconName) {
        if (this.iconName) {
          this.iconElement.classList.remove('fa-' + this.iconName);
        }
        this.iconElement.classList.add('fa-' + state.iconName);
        this.iconName = state.iconName;
      }
      if (state.href) {
        this.rootElement.href = state.href;
      }
    }

    switchPage() {
      this.rootComponent.switchToPage(this.contentPage);
    }
    
  });
};
