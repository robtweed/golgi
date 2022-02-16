export function load() {
  let componentName = 'sbadmin-copyright';
  let count = -1;

  customElements.define(componentName, class sbadmin_copyright extends HTMLElement {
    constructor() {
      super();
      count++;
      const html = `
<div class="text-muted">
  <span>Copyright &copy; </span>
  <span golgi:prop="textTarget" />
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
    }
    
  });
};
