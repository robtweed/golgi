let def = {
  name: 'conduit-tag',
  html: `
<a class="tag-pill tag-default" href="#">golgi:bind</a>
  `,
  methods: `

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }
  `
};
export {def};
