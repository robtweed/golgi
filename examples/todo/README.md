# Try It Out!

Run a [live version of this ToDo application](https://robtweed.github.io/golgi/examples/todo/).

The application is based on the UI design from the [ToDoMVC](https://todomvc.com/) examples,
but without a strict MVC design focus.  

Instead, this version uses all the key features
that are built into *Golgi*, including its StateMap and Mutation Observer functionality to
control the UI behaviour.  It also showcases the use of our 
[DPP](https://github.com/robtweed/DPP) abstraction of the IndexedDB database, which 
allows the persistent *todo* object to be treated in the *Golgi* application as if it was
just a plain old JavaScript object.

Each task is represented by an *Item* WebComponent, with its UI presentation controlled by
a *Golgi* Mutation Observer within the item Component.

New tasks are added via the *Header* WebComponent, and a *Footer* WebComponent provides 
the various buttons for filtering the display of active and completed tasks.

**NOTE:** You must use a modern browser that supports WebComponents to run this example!