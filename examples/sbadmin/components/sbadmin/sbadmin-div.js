    export function load() {
    
      let componentName = 'sbadmin-div';
      let count = -1;
    
      customElements.define(componentName, class sbadmin_div extends HTMLElement {
        constructor() {
          super();
          count++;

          const html = `
<div>
  <span golgi:prop="spanTag"></span>
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
            this.spanTag.textContent = state.text;
          }
        }

        observerCallback(mutation) {
          console.log('*** observerCallback invoked in sbadmin-div component ***');
          console.log(mutation);
        }

        onBeforeState() {
          this.observerStart();
        }
    
      });
    };