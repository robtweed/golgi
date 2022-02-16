export function load() {

  let componentName = 'sbadmin-root';
  let sidebar_colour = 'bg-gradient-primary';
  let count = -1;
  let golgi = this;

  customElements.define(componentName, class sbadmin_root extends HTMLElement {
    constructor() {
      super();
      count++;
	  
      const html = `
<span>
  <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark" golgi:prop="topbarTarget"></nav>
  <div id="layoutSidenav">
    <div id="layoutSidenav_nav">
      <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion" golgi:prop="sidebarTarget"></nav>
    </div>
    <div id="layoutSidenav_content">
      <main>
        <div class="container-fluid px-4" golgi:prop="contentTarget"></div>
      </main>
      <footer class="py-4 bg-light mt-auto">
        <div class="container-fluid px-4">
          <div class="d-flex align-items-center justify-content-between small" golgi:prop="footerTarget"></div>
        </div>
      </footer>
    </div>
  </div>
</span>
      `;

       this.html = `${html}`;
    }

    setPageActive(pageName) {
      // set selected page to active
      let page = this.contentPages.get(pageName);
      page.setState({show: true});
      if (page.onSelected) page.onSelected();
    }

    async switchToPage(pageName) {
      if (!this.contentPages.has(pageName)) {
        await this.renderAssembly(pageName, this.contentTarget, this.context);
      }
      this.setPageActive(pageName);
    }

    setState(state) {
      if (state.sidebar_colour) {
        let target = this.sidebarTarget.classList;
        target.remove(sidebar_colour);
        sidebar_colour = state.sidebar_colour;
        if (!sidebar_colour.includes('-')) sidebar_colour = 'bg-gradient-' + state.sidebar_colour;
        target.add(sidebar_colour);
      }
    }

    async onBeforeState() {
      this.contentPages = new Map();
    }

  });
};
