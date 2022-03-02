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

 01 March 2022

*/

export function apis(context) {

  context = context || {};

  let host = context.conduit.rest_host || '';
  let authHeader = 'X-CustomHeader';
  //let authHeader = 'Authorization';

  async function send(method, url, prop, body, useJWT) {
    if (typeof useJWT === 'undefined') useJWT = true;
    method = method || 'GET';
    let options = {
      method: method.toUpperCase(),
      headers: {
        mode: 'no-cors',
        'Content-type': 'application/json'
      }
    };
    if (context.jwt && useJWT) {
      options.headers[authHeader] = 'Token ' + context.jwt;
    }
    if (body) {
      options.body = JSON.stringify(body);
    }

    //options.withCredentials = true;

    let response = await fetch(url, options);
    let results = await response.json();
    if (!results.error && prop) return results[prop];
    return results;
  }

  let apis = {
    getArticlesList: async function(offset, limit, param) {
      offset = offset || 0;
      limit = limit || 10;
      let url = host + '/api/articles?offset=' + offset + '&limit=' + limit;
      if (param) {
        if (param.author) {
          url = url + '&author=' + param.author;
        }
        if (param.favourited) {
          url = url + '&favorited=' + param.favourited;
        }
        if (param.tag) {
          url = url + '&tag=' + encodeURIComponent(param.tag);
        }
      }
      return await send('get', url);
    },
    getArticlesFeed: async function(offset, limit) {
      offset = offset || 0;
      limit = limit || 10;
      let url = host + '/api/articles/feed?offset=' + offset + '&limit=' + limit;
      return await send('get', url);
    },
    getTags: async function() {
      let url = host + '/api/tags';
      return await send('get', url, 'tags', null, null, false);
    },
    getProfile: async function(author) {
      author = author || context.author;
      let url = host + '/api/profiles/' + author;
      return await send('get', url, 'profile');
    },
    getArticleBySlug: async function(slug) {
      slug = slug || context.slug;
      let url = host + '/api/articles/' + slug;
      return await send('get', url, 'article');
    },
    getComments: async function(slug) {
      slug = slug || context.slug;
      let url = host + '/api/articles/' + slug + '/comments';
      return await send('get', url, 'comments');
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
      let url = host + '/api/users';
      let body = {
        user: {
          username: username,
          email: email,
          password: password 
        }
      };
      return await send('post', url, null, body, false);
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
      let url = host + '/api/users/login';
      let body = {
        user: {
          email: email,
          password: password 
        }
      };
      return await send('post', url, null, body, false);
    },
    getUser: async function(jwt) {
      jwt = jwt || context.jwt;
      let url = host + '/api/user';
      let options = {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-type': 'application/json'
        }
      };
      options.headers[authHeader] = 'Token ' + jwt;
      let response = await fetch(url, options);
      let results = await response.json();
      return results;
    },
    follow: async function(author) {
      let url = host + '/api/profiles/' + author + '/follow';
      return await send('post', url);
    },
    unfollow: async function(author) {
      let url = host + '/api/profiles/' + author + '/follow';
      return await send('delete', url);
    },
    favourite: async function(slug) {
      let url = host + '/api/articles/' + slug + '/favorite';
      return await send('post', url);
    },
    unfavourite: async function(slug) {
      let url = host + '/api/articles/' + slug + '/favorite';
      return await send('delete', url);
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
      let url = host + '/api/articles/' + slug + '/comments';
      let body = {
        comment: {
          body: text 
        }
      };
      return await send('post', url, null, body);
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
      let url = host + '/api/articles/' + slug + '/comments/' + id;
      let options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        }
      };
      options.headers[authHeader] = 'Token ' + jwt;
      let response = await fetch(url, options);
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
      let url = host + '/api/articles';
      let bodyObj = {
        article: {
          title: title,
          description: description,
          body: body,
          tagList: tagList || []
        }
      };
      return await send('post', url, null, bodyObj);
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
      let url = host + '/api/articles/' + slug;
      let options = {
        method: 'delete',
        headers: {
          'Content-type': 'application/json'
        }
      };
      options.headers[authHeader] = 'Token ' + jwt;
      let response = await fetch(url, options);
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
      let url = host + '/api/articles/' + slug;
      let bodyObj = {
        article: {
          title: title,
          description: description,
          body: body,
          tagList: tagList || []
        }
      };
      return await send('put', url, null, bodyObj);
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
      let url = host + '/api/user';
      let body = {
        user: params
      };
      return await send('put', url, null, body);
    }

  };

  return {apis};
};
