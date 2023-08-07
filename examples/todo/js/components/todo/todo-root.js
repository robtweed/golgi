export function load(ctx) {
  let componentName = 'todo-root';

  customElements.define(componentName, class todo_root extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      const html = `
<style>


.todoapp {
    margin: 130px 0 40px 0;
    position: relative;
}

h1 {
    position: relative;
    top: -30px;
    width: 100%;
    font-size: 120px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
}

</style>

<section class="todoapp">
  <h1>todos</h1>
  <span golgi:prop="childrenTarget"></span>
</section>

      `;
      this.shadowRoot.innerHTML = `${html}`;
      this.name = componentName + '-0';
    }
  });
};