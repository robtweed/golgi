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

  // initialise item component lookup hash

  let itemComponents = {};

  /*
    use this style of path prefix in your local app

  let path_prefix = window.location.origin + '/todo/js/';

    below is for the Github repo live version:

  */

  let path_prefix = '../examples/todo/js/';


  // create the Golgi Context object


  let context = {
    componentPaths: {
      todo: path_prefix + 'components/todo/'
    },
    assemblyPath: path_prefix + 'assemblies/',

    // methods for use in components

    createTodo: function(text, completed) {
      completed = completed || false;
      let id = todos.nextId++;
      todos.byId[id] = {
        text: text,
        completed: completed
      }
      return id;
    },

    registerItemComponent: function(id, itemComponent) {
      itemComponents[id] = itemComponent;
    },

    editTodo: function(id, text) {
      let todo = todos.byId[id];
      if (todo) {
        todo.text = text;
      }
    },

    deleteTodoById: function(id) {
      delete itemComponents[id];
      delete todos.byId[id];
    },
    
    hasTodos: function() {
      for (let id in todos.byId) {
        return true;
      }
      return false;
    },

    hasCompletedTasks: function() {
      for (let id in todos.byId) {
        if (todos.byId[id].completed) return true;
      }
      return false;
    },

    getTodo: function(id) {
      return todos.byId[id];
    },

    allCompleted() {
      let completed = 0;
      let total = 0;
      for (let id in todos.byId) {
        if (todos.byId[id].completed) completed++;
        total++;
      }
      return (completed > 0 && completed === total) ? true : false;
    },

    completeTodo: function(id) {
      todos.byId[id].completed = true;
    },

    uncompleteTodo: function(id) {
      todos.byId[id].completed = false;
    },

    completeAllTodos: function() {
      for (let id in itemComponents) {
        if (!todos.byId[id].completed) {
          itemComponents[id].completeTask();
          context.completeTodo(id);
        }
      }
    },

    uncompleteAllTodos: function() {
      for (let id in itemComponents) {
        itemComponents[id].uncompleteTask();
        context.uncompleteTodo(id);
      }
    },

    getDisplayMode() {
      return todos.mode;
    },

    showTodos: function(mode) {
      todos.mode = mode;
      for (let id in itemComponents) {
        itemComponents[id].applyMode(mode, todos.byId[id].completed);
      }
    },

    clearCompletedTasks: function() {
      for (let id in itemComponents) {
        if (todos.byId[id].completed) itemComponents[id].destroy();
      }
    }
  };

  //golgi.logging = true;

  await golgi.renderAssembly('root', 'body', context);

  // pre-populate from DPP-stored todo object

  for (let id in todos.byId) {
    let todo = todos.byId[id];
    itemComponents[id] = await context.mainComponent.addItem(id, todo.text, todo.completed);
  }

})();
