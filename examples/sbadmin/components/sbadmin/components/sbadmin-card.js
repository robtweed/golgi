export function load() {

  let componentName = 'sbadmin-card';
  let count = -1;

  customElements.define(componentName, class sbadmin_card extends HTMLElement {
    constructor() {
      super();
      count++;

      const html = `
<div class="card mb-4" golgi-prop="configDiv">
  <div golgi-prop="headerTag" class="card-header"></div>
  <div class="card-body">
    <div golgi-prop="titleTag"></div>
    <div golgi-prop="bodyTag" />
  </div>
  <div golgi-prop="footerTag" class="card-footer d-flex align-items-center justify-content-between"></div>
</div>
      `;
      this.html = `${html}`;
      this.name = componentName + '-' + count;
    }
    
    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.title) {
        this.titleTag.textContent = state.title;
      }
      if (state.textColor) {
        if (this.allowedColors.includes(state.textColor)) {
          let cls = 'text-' + state.textColor;
          this.configDiv.classList.add(cls);
          if (this.textClass) {
            this.configDiv.classList.remove(this.textClass);
          }
          this.textClass = cls;
        }
      }
      if (state.bgColor) {
        if (this.allowedColors.includes(state.bgColor)) {
          let cls = 'bg-' + state.bgColor;
          this.configDiv.classList.add(cls);
          if (this.colorClass) {
            this.configDiv.classList.remove(this.colorClass);
          }
          this.colorClass = cls;
        }
      }
      if (state.layoutClass) {
        let classes = state.layoutClass.split(' ');
        let _this = this;
        classes.forEach(function(cls) {
          if (cls === 'noheader') {
            _this.headerTag.parentNode.removeChild(_this.headerTag);
          }
          else if (cls === 'nofooter') {
            console.log(_this);
            _this.footerTag.parentNode.removeChild(_this.footerTag);
          }
          else {
            _this.classList.add(cls);
          }
        });
      }
    }

    onBeforeState() {
      this.allowedColors = [
        'primary',
        'secondary',
        'warning',
        'success',
        'danger',
        'info',
        'light',
        'dark',
        'body',
        'white',
        'transparent'
      ];
    }

    disconnectedCallback() {
      this.onUnload();
    }
    
  });
};
