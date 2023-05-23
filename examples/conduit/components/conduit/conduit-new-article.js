/*

 ----------------------------------------------------------------------------
 | golgi-conduit: RealWorld Conduit UI Golgi Library                         |
 |                                                                           |
 | Copyright (c) 2023 MGateway Ltd,                                          |
 | Redhill, Surrey UK.                                                       |
 | All rights reserved.                                                      |
 |                                                                           |
 | https://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                                |
 |                                                                           |
 |                                                                           |
 | Licensed under the Apache License, Version 2.0 (the "License");           |
 | you may not use this file except in compliance with the License.          |
 | You may obtain a copy of the License at                                   |
 |                                                                           |
 |     http://www.apache.org/licenses/LICENSE-2.0                            |
 |                                                                           |
 | Unless required by applicable law or agreed to in writing, software       |
 | distributed under the License is distributed on an "AS IS" BASIS,         |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  |
 | See the License for the specific language governing permissions and       |
 |  limitations under the License.                                           |
 ----------------------------------------------------------------------------

 23 February 2022

*/

export function load() {

  const componentName = 'conduit-new-article';

  customElements.define(componentName, class conduit_new_article extends HTMLElement {
    constructor() {
      super();

      const html = `
<div class="editor-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-10 offset-md-1 col-xs-12">
        <ul class="error-messages" golgi:prop="errorsEl"></ul>
        <form>
          <fieldset>
            <fieldset class="form-group">
                <input golgi:prop="article_title" type="text" value="golgi:bind=title" class="form-control form-control-lg" placeholder="Article Title" />
            </fieldset>
            <fieldset class="form-group">
                <input golgi:prop="description" type="text" value="golgi:bind=description" class="form-control" placeholder="What's this article about?" />
            </fieldset>
            <fieldset class="form-group">
                <textarea golgi:prop="body" class="form-control" rows="8" value="golgi:bind=body" placeholder="Write your article (in markdown)"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input golgi:prop="tagListField" type="text" value="golgi:bind=tagListField" class="form-control" placeholder="Enter tags" golgi:on_change="displayTagIcon" />
                <div class="tag-list" golgi:prop="tagListEl"></div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button" golgi:on_click="submitArticle">Publish Article</button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
      `;

      this.html = `${html}`;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    // handlers

    async displayTagIcon() {
      console.log('changed!');
      const value = this.tagListField.value;

      if (this.tagList.indexOf(value) !== -1) {
        // already added this tag, so ignore and clear the field
        this.tagListField.value = '';
        return;
      }

      // create a new tag icon and clear the tag entry field
      this.tagList.push(value);
      this.tagListField.value = '';
      await this.addTag(value);
    }

    async submitArticle(e) {
      console.log('submit button!');
      //e.preventDefault();
      let results;

      if (this.mode === 'editing') {
        // submitting edits to an existing article
        results = await this.rootComponent.apis.updateArticle(this.article.slug, this.article_title.value, this.description.value, this.body.value, this.tagList);
      }
      else {
        // submitting a new article
        results = await this.rootComponent.apis.createArticle(this.article_title.value, this.description.value, this.body.value, this.tagList);
      }
      if (!results.errors) {
        let homePageComp = this.rootComponent.pageComponent.get('home_page');
        homePageComp.refresh_home_page();

        let obj = {
          slug: results.article.slug
        };
        this.rootComponent.switchToPage('article', obj);
      }
      else {
        this.rootComponent.addErrors(results.errors, this.errorsEl);
      }
    }

    // other methods

    async addTags(tags) {
      let _this = this;
      this.renderComponentMap('conduit-new-article-tag', this.tagListEl, this.context, tags, 'new_article_tags')
    }

    async addTag(tag) {
      let tagComp = await this.renderComponent('conduit-new-article-tag', this.tagListEl, this.context);
      let mapName = 'new_article_tag_' + tag;
      tagComp.addStateMap(mapName);
      this.golgi_state[mapName] = tag;
    }

    onSelected(obj) {

      this.rootComponent.clearErrors(this.errorsEl);
      this.removeAllByName('conduit-new-article-tag', this.tagListEl);

      if (obj && obj.editing_article) {
        // editing an existing article, so
        // populate the form with data from the selected article

        this.article = obj.editing_article;
        this.mode = 'editing';

        this.golgi_state.article_form = {
          title: this.article.title,
          description: this.article.description,
          body: this.article.rawBody,
          tagListField: ''
        };

        this.addTags(this.article.tagList);
        this.tagList = this.article.tagList;

      }
      else {
        // new article

        this.golgi_state.article_form = {
          title: '',
          description: '',
          body: '',
          tagListField: ''
        };

        this.tagList = [];
        this.mode = 'new';
      }
    }

    onBeforeState() {
      this.addStateMap('article_form');
    }

  });
};
