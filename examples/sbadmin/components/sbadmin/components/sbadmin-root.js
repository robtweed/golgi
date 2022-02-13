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
  <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark" golgi-prop="topbarTarget"></nav>
  <div id="layoutSidenav">
    <div id="layoutSidenav_nav">
      <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion" golgi-prop="sidebarTarget"></nav>
    </div>
    <div id="layoutSidenav_content">
      <main>
        <div class="container-fluid px-4" golgi-prop="contentTarget"></div>
      </main>
      <footer class="py-4 bg-light mt-auto">
        <div class="container-fluid px-4">
          <div class="d-flex align-items-center justify-content-between small" golgi-prop="footerTarget"></div>
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
      console.log('&&&& setPageActive for ' + pageName);
      console.log(this.context);
      let page = this.context.contentPages.get(pageName);
      page.setState({show: true});
      console.log('&&& sbadmin-root setPageActive - will try to invoke page.onSelected');
      if (page.onSelected) page.onSelected();
    }

    async switchToPage(pageName) {
      if (!this.contentPages.has(pageName)) {
        console.log('**** rendering ' + pageName);
        let element = await this.renderAssembly(pageName, this.contentTarget, this.context);
        console.log('***** switchToPage element = ');
        console.log(element);
        this.contentPages.set(pageName, element);
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
      this.name = 'root';
	
      this.addMetaTag({
        charset: 'utf-8'
      });
      this.addMetaTag({
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge'
      });
      this.addMetaTag({
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      });
	  
      document.getElementsByTagName('body')[0].classList.add('sb-nav-fixed');

      if (this.context.resourcePaths && this.context.resourcePaths.sbadmin) {
        await this.loadResources(this.context.resourcePaths.sbadmin);
      }
      else {
        /*
        //this.loadCSS('https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css', {crossorigin: 'anonymous'});
        this.loadCSS(this.rootPath + 'css/styles.css');

        this.loadJS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js', {crossorigin: 'anonymous'});
        //this.loadJS('https://cdn.jsdelivr.net/npm/simple-datatables@latest', {crossorigin: 'anonymous'});
        await this.loadJSAsync('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js', {crossorigin: 'anonymous'})
        */
      }
    }

    disconnectedCallback() {
      this.onUnload();
    }
  });
};
