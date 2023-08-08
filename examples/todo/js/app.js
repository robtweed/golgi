(async () => {

  // load resources in parallel

  const [{golgi}, {DPP}, {QOper8}] = await Promise.all([
    import('https://cdn.jsdelivr.net/gh/robtweed/golgi/src/golgi.min.js'),
    import('https://cdn.jsdelivr.net/gh/robtweed/DPP/src/dpp.min.js'),
    import('https://robtweed.github.io/QOper8/src/QOper8.min.js')
  ]);

  // instantiate the persistent storage proxy object: todos
  //  using DPP

  let dpp = new DPP({
    storeName: 'todos',
    QOper8: QOper8
  });

  let todos = await dpp.start();

  /*

    todos structure will be of the form:

    {
      nextId: 3,                 seeds the next item id
      mode: 'all',               display mode (all, active, completed)
      byId: {                    todo items by id
        1: {
          text: 'First ToDo',
          completed: true
        },
        2: {
          text: 'Second ToDo',
          completed: false
        }
      }
    }

    Any changes are automatically mapped to IndexedDB version by DPP
    Just use it like any normal object and DPP does the rest

  */

  // initialise the todos proxy object if it previously didn't exist in indexedDB

  if (!todos.nextId) {
    todos.nextId = 1;
  }
  if (!todos.byId) {
    todos.byId = {};
  }
  if (!todos.mode) {
    todos.mode = 'all';
  }

  /*
    use this style of path prefix in your local app

  let path_prefix = window.location.origin + '/todo/js/';

    below is for the Github repo live version:

  */

  let path_prefix = 'https://robtweed.github.io/golgi/examples/todo/js/';

  // create the Golgi Context object


  let context = {
    componentPaths: {
      todo: path_prefix + 'components/todo/'
    },
    assemblyPath: path_prefix + 'assemblies/',

    // methods for use in components

    createTodo: function(text) {
      let id = todos.nextId++;
      todos.byId[id] = {
        text: text,
        completed: false
      }
      return id;
    },

    editTodo: function(id, text) {
      let todo = todos.byId[id];
      if (todo) {
        todo.text = text;
      }
    },

    isTodoCompleted: function(id) {
      return todos.byId[id].completed;
    },

    completeTodo: function(id) {
      todos.byId[id].completed = true;
    },

    uncompleteTodo: function(id) {
      todos.byId[id].completed = false;
    },

    getTodo: function(id) {
      return todos.byId[id];
    },

    deleteTodo: function(id) {
      delete todos.byId[id];
    },

    getDisplayMode: function() {
      return todos.mode;
    },

    setDisplayMode: function(value) {
      todos.mode = value;
    },

    getAllTodos: function() {
      return todos.byId;
    }
  };

  //golgi.logging = true;

  await golgi.renderAssembly('root', 'body', context);

})();
