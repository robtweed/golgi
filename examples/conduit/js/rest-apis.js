/*

 ----------------------------------------------------------------------------
 | golgi-conduit: RealWorld Conduit UI Golgi Library                         |
 |                                                                           |
 | Copyright (c) 2022 M/Gateway Developments Ltd,                            |
 | Redhill, Surrey UK.                                                       |
 | All rights reserved.                                                      |
 |                                                                           |
 | http://www.mgateway.com                                                   |
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

 25 February 2022

*/

export function apis(context) {

  context = context || {};

  let host = context.conduit.rest_host || '';

  let apis = {
    getArticlesList: async function(offset, limit, param) {
      offset = offset || 0;
      limit = limit || 10;
      let fetch_url = host + '/api/articles?offset=' + offset + '&limit=' + limit;
      if (param) {
        if (param.author) {
          fetch_url = fetch_url + '&author=' + param.author;
        }
        if (param.favourited) {
          fetch_url = fetch_url + '&favorited=' + param.favourited;
        }
        if (param.tag) {
          fetch_url = fetch_url + '&tag=' + encodeURIComponent(param.tag);
        }
      }
      let options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      };
      if (context.jwt) {
        options.headers.authorization = 'Token ' + context.jwt;
      }
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    getArticlesFeed: async function(offset, limit) {
      offset = offset || 0;
      limit = limit || 10;
      let fetch_url = host + '/api/articles/feed?offset=' + offset + '&limit=' + limit;
      let options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      };
      if (context.jwt) {
        options.headers.authorization = 'Token ' + context.jwt;
      }
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    getTags: async function(x) {
      let fetch_url = host + '/api/tags';
      if (x) fetch_url = fetch_url + '?x=' + x;
      let options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results.tags;
    },
    getProfile: async function(author) {
      author = author || context.author;
      let fetch_url = host + '/api/profiles/' + author;
      let options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      };
      if (context.jwt) {
        options.headers.authorization = 'Token ' + context.jwt;
      }
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results.profile;
    },
    getArticleBySlug: async function(slug) {
      slug = slug || context.slug;
      let fetch_url = host + '/api/articles/' + slug;
      let options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      };
      if (context.jwt) {
        options.headers.authorization = 'Token ' + context.jwt;
      }
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results.article;
    },
    getComments: async function(slug) {
      slug = slug || context.slug;
      let fetch_url = host + '/api/articles/' + slug + '/comments';
      let options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      };
      if (context.jwt) {
        options.headers.authorization = 'Token ' + context.jwt;
      }
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results.comments;
    },
    registerUser: async function(username, email, password) {
      let errors;
      if (!email || email === '') {
        if (!errors) errors = {};
        errors.email = ["can't be empty"]
      }
      if (!username || username === '') {
        if (!errors) errors = {};
        errors.username = ["can't be empty"];
      }
      if (!password || password === '') {
        if (!errors) errors = {};
        errors.password = ["can't be empty"];
      }
      if (errors) {
        return {errors: errors};
      }
      let fetch_url = host + '/api/users';
      let options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            username: username,
            email: email,
            password: password 
          }
        })
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    authenticateUser: async function(email, password) {
      let errors;
      email = email || '';
      password = password || '';
      if (email === '' || password === '') {
        errors = {
          'email or password': ['is invalid']
        };
        return {errors: errors};
      }
      let fetch_url = host + '/api/users/login';
      let options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            email: email,
            password: password 
          }
        })
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    getUser: async function(jwt) {
      jwt = jwt || context.jwt;
      let fetch_url = host + '/api/user';
      let options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        }
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    follow: async function(author) {
      let jwt = context.jwt;
      let fetch_url = host + '/api/profiles/' + author + '/follow';
      let options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        }
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    unfollow: async function(author) {
      let jwt = context.jwt;
      let fetch_url = host + '/api/profiles/' + author + '/follow';
      let options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        }
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    favourite: async function(slug) {
      let jwt = context.jwt;
      let fetch_url = host + '/api/articles/' + slug + '/favorite';
      let options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        }
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    unfavourite: async function(slug) {
      let jwt = context.jwt;
      let fetch_url = host + '/api/articles/' + slug + '/favorite';
      let options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        }
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    addComment: async function(slug, text) {
      let errors;
      if (!text || text === '') {
        errors = {
          'comment': ['is empty']
        };
        return {errors: errors};
      }
      let jwt = context.jwt;
      if (!jwt) {
        errors = {
          'user': ['is not authenticated']
        };
        return {errors: errors};
      }
      let fetch_url = host + '/api/articles/' + slug + '/comments';
      let options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        },
        body: JSON.stringify({
          comment: {
            body: text 
          }
        })
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    deleteComment: async function(slug, id) {
      let errors;
      let jwt = context.jwt;
      if (!jwt) {
        errors = {
          'user': ['is not authenticated']
        };
        return {errors: errors};
      }
      let fetch_url = host + '/api/articles/' + slug + '/comments/' + id;
      let options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        }
      };
      let response = await fetch(fetch_url, options);
      let results;
      try {
        results = await response.json();
      }
      catch(err) {
        results = {};
      }
      return results;
    },
    createArticle: async function(title, description, body, tagList) {
      let errors;
      if (!title || title === '') {
        if (!errors) errors = {};
        errors.title = ["can't be empty"]
      }
      if (!description || description === '') {
        if (!errors) errors = {};
        errors.description = ["can't be empty"];
      }
      if (!body || body === '') {
        if (!errors) errors = {};
        errors.body = ["can't be empty"];
      }
      let jwt = context.jwt;
      if (!jwt) {
        if (!errors) errors = {};
        error.user = ['is not authenticated'];
      }
      if (errors) {
        return {errors: errors};
      }
      let fetch_url = host + '/api/articles';
      let options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        },
        body: JSON.stringify({
          article: {
            title: title,
            description: description,
            body: body,
            tagList: tagList || []
          }
        })
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    deleteArticle: async function(slug) {
      let errors;
      let jwt = context.jwt;
      if (!jwt) {
        errors = {
          'user': ['is not authenticated']
        };
        return {errors: errors};
      }
      let fetch_url = host + '/api/articles/' + slug;
      let options = {
        method: 'delete',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        }
      };
      let response = await fetch(fetch_url, options);
      let results;
      try {
        results = await response.json();
      }
      catch(err) {
        results = {};
      }
      return results;
    },
    updateArticle: async function(slug, title, description, body, tagList) {
      let errors;
      if (!title || title === '') {
        if (!errors) errors = {};
        errors.title = ["can't be empty"]
      }
      if (!description || description === '') {
        if (!errors) errors = {};
        errors.description = ["can't be empty"];
      }
      if (!body || body === '') {
        if (!errors) errors = {};
        errors.body = ["can't be empty"];
      }
      let jwt = context.jwt;
      if (!jwt) {
        if (!errors) errors = {};
        error.user = ['is not authenticated'];
      }
      if (errors) {
        return {errors: errors};
      }
      let fetch_url = host + '/api/articles/' + slug;
      let options = {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        },
        body: JSON.stringify({
          article: {
            title: title,
            description: description,
            body: body,
            tagList: tagList || []
          }
        })
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    },
    updateUser: async function(params) {
      let email = params.email;
      let username = params.username;
      let errors;
      if (!email || email === '') {
        if (!errors) errors = {};
        errors.email = ["can't be empty"]
      }
      if (!username || username === '') {
        if (!errors) errors = {};
        errors.username = ["can't be empty"];
      }
      let jwt = context.jwt;
      if (!jwt) {
        if (!errors) errors = {};
        error.user = ['is not authenticated'];
      }
      if (errors) {
        return {errors: errors};
      }
      let fetch_url = host + '/api/user';
      let options = {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Token ' + jwt
        },
        body: JSON.stringify({
          user: params
        })
      };
      let response = await fetch(fetch_url, options);
      let results = await response.json();
      return results;
    }

  };

  return {apis};
};
