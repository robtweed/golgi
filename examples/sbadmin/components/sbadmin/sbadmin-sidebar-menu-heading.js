export function load() {

  let componentName = 'sbadmin-sidebar-menu-heading';
  let count = -1;

  customElements.define(componentName, class sbadmin_sidebar_menu_heading extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<a class="nav-link collapsed" golgi:prop="aTag" href="#" data-bs-toggle="collapse" aria-expanded="false">
  <div class="sb-nav-link-icon">
    <i class="fas" golgi:prop="iconElement"></i>
  </div>
  <span golgi:prop="textTarget">Menu Heading Text</span>
  <div class="sb-sidenav-collapse-arrow">
    <i class="fas fa-angle-down"></i>
  </div>
</a>
<div class="collapse" golgi:prop="collapseDiv" data-bs-parent="#sidenavAccordion">
  <nav class="sb-sidenav-menu-nested nav" golgi:prop="childrenTarget"></nav>
</div>
      `;

      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
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
        this.hasIcon = true;
      }
    }

    onBeforeState() {

      // set up the various cross-linked/cross-referenced attributes

      this.collapseDiv.id = this.name;
      this.aTag.id = this.name + '-header';
      this.collapseDiv.setAttribute('aria-labelledby', this.aTag.id);
      this.aTag.setAttribute('data-bs-target','#' + this.name);
      this.aTag.setAttribute('aria-controls',this.name);

      this.hasIcon = false;
      this.hasChildHeadings = false;

      let parentComponent = this.getParentComponent();
      if (parentComponent.tagName === this.tagName) {
        if (!parentComponent.hasChildHeadings) {
          // modify the relevant parent heading tag classes
          parentComponent.childrenTarget.classList.add('accordion');
          let id = parentComponent.name + '-nav';
          parentComponent.childrenTarget.id = id;
          this.collapseDiv.setAttribute('data-bs-parent', '#' + id);
          parentComponent.hasChildHeadings = true;
        }
      }

    }
    
    onAfterState() {
      // remove icon tags if no icon was defined in assembly for this component instance
      if (!this.hasIcon) {
        this.iconElement.parentElement.textContent = '';
      }
    }
    
  });
};
