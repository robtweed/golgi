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
      if (typeof Chart === 'undefined') {
        if (this.context.resourcePaths && this.context.resourcePaths.chart) {
          console.log('** loading from');
          console.log(this.context.resourcePaths.chart);
          await this.loadResources(this.context.resourcePaths.chart);
        }
        else {
          //await this.loadJSAsync('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js', {crossorigin:'anonymous'});
        }
        console.log('Chart configuration');
        Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#292b2c';
        this.context.chartInitialised = true;
        console.log('***** Chart initialised *****');
      }
    }

    disconnectedCallback() {
      this.onUnload();
    }
    
  });
};
