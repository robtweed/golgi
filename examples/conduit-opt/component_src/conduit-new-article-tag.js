module.exports = {
  name: 'conduit-new-article-tag',
  html: `
<span class="tag-default tag-pill">
  <i class="ion-close-round" golgi:on_click="removeTag"></i>
  <span>golgi:bind</span>
</span>
  `,
  methods: `

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    removeTag() {

      // remove from tagList array in the conduit-new-article parent component

      let index = this.parentComponent.tagList.indexOf(this.text);
      if (index > -1) {
        this.parentComponent.tagList.splice(index, 1);
      }
      // now remove tag component
      this.remove();
    }

    onDataUpdated(dataObj) {
      this.text = dataObj;
    }

  `
};
