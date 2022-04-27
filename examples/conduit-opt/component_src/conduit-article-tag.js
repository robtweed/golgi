module.exports = {
  name: 'conduit-article-tag',
  html: `
<li class="tag-default tag-pill tag-outline">
  <span>golgi:bind</span>
</li>
  `,
  methods: `

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

  `
};
