export function load() {

  let componentName = 'chart-root';
  let count = -1;

  customElements.define(componentName, class chart_root extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<div></div>
      `;
      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }
    
    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    async onBeforeState() {
      // Chart.js should be loaded using a child <script> tag

      if (!this.context.chartInitialised) {
        Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#292b2c';
        this.context.chartInitialised = true;
      }
    }
    
  });
};
