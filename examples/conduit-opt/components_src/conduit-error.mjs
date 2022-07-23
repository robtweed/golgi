let def = {
  name: 'conduit-error',
  html: `
<li>
  <span golgi:prop="text"></span>
</li>
  `,
  methods: `

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    setText(text) {
      this.text.textContent = text;
    }

  `
};
export {def};

