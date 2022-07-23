let def = {
  name: 'conduit-pagination-link',
  html: `
<li class="page-item">
  <a class="page-link" href="#" golgi:prop="link" golgi:on_click="displayBatch"></a>
</li>
  `,
  methods: `

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.ownerPage) {
        this.ownerPage = state.ownerPage;
      }
      if (state.classification) {
        this.classification = state.classification;
      }
      if (state.limit) {
        this.limit = state.limit;
      }
      if (state.no) {
        this.no = state.no;
        this.link.textContent = state.no;
        if (this.no === 1) {
          this.active();
        }
      }
    }

    displayBatch() {
      this.active();
      let offset = ((this.no - 1) * this.limit);
      this.parentComponent.getAndDisplayArticles(offset, this.classification);
    }

    active() {
      if (!this.rootElement.classList.contains('active')) {
        this.rootElement.classList.add('active');
      }
      let activeLink = this.parentComponent.activeLink;
      if (activeLink) {
        activeLink.rootElement.classList.remove('active');
      }
      this.parentComponent.activeLink = this;
    }

  `
};
export {def};
