export function load() {

  let componentName = 'sbadmin-sidebar-toggle';
  let count = -1;

  customElements.define(componentName, class sbadmin_sidebar_toggle extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<style>
  .toggle-grey {
    color: rgb(255, 255, 255, 0.5);
  } 
</style>
<button class="btn btn-link btn-sm order-1 order-lg-0 toggle-grey" golgi:component-class="me-4 me-lg-0" href="#!" golgi:on_click="toggle">
  <i class="fas fa-bars"></i>
</button>
      `;
      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }
    
    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    toggle(e) {
      e.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
    }
    
  });
};
