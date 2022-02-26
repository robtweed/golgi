export function load() {

  let componentName = 'chart-area-plot';
  let count = -1;

  customElements.define(componentName, class chart_area_plot extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<style>
  .chart-layout {
    position: relative;
    width: 100%;
    height: 20rem;
  }
</style>
<div>
  <canvas class="chart-layout" golgi:prop="canvasTag" />
</div>
      `;
      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }
    
    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.update) {
        console.log('*** *** *** updating chart with state:');
        console.log(state);
        if (Array.isArray(state.update) && state.update.length !== 0) {
          this.chart.data.datasets[0].data = state.update;
          this.chart.update();
        }
      }
      if (state.width) {
        this.canvasTag.style.width = state.width;
      }
      if (state.height) {
        this.canvasTag.style.height = state.height;
      }
    }

    draw(config) {
      this.chart = new Chart(this.canvasTag.getContext('2d'), config);
    }

    disconnectedCallback() {
      if (this.chart) this.chart.destroy();
    }
    
  });
};
