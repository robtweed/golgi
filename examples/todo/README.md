# Try It Out!

Run a [live version of this ToDo application](https://robtweed.github.io/golgi/examples/todo/).

The application is based on the UI design from the [ToDoMVC](https://todomvc.com/) examples,
but without a strict MVC design focus.  

Instead, this version demonstrates how designing the application to use Golgi's WebComponents 
can be used to simplify the control of the UI in line with the state of the tasks and
the application's editing and filtering controls.

It also showcases the use of our 
[DPP](https://github.com/robtweed/DPP) abstraction of the IndexedDB database, which 
allows the persistent *todo* object to be treated in the *Golgi* application as if it was
just a plain old JavaScript object.

# The Design in a Nutshell

The application has a single Assembly that marshalls the main Components into place:

- the Header Component, where new Tasks are entered
- the Item-Group Component, which provides the parent target for each individual Task Item Component
- the Footer Component, which displays the counter and filtering controls

Each task is represented by an *Item* WebComponent which looks after the rendering and display of
each individual task. Each task Component is appended to the Item-Group Component.

Separately from the UI, a persistent object - *todos* - is maintained within the browser's
*indexedDB* database by DPP.  As far as the application is concerned, *todos* is simply
treated as a standard JavaScript Object.

The *todos* object holds the details of each Task, specifically:

- its text value
- whether or not it has been completed

It also holds the display mode (as determined by the Footor Component's buttons):

- display all tasks
- display only active tasks
- display only completed tasks

This information is used by each Item Component's *updateState()* method to correctly display
the Item in the UI.

Most of the UI control is handled within the Footer Component: its *updateState()* method
is triggered whenever any change is made to the *todos* object, and this, in turn,
invokes a state update for each of the *Item* Components that are attached to the
Item-Group Component.

You'll see, therefore, that the editing controls within the Item Component only directly
update the *todos* Object, and then call to the Footer Component to refresh the display based
on the new *todos* state.

The resulting logic is surprisingly simple and compact, demonstrating the benefits
of Golgi's WebComponent-based design, and further simplified by the use of DPP to 
transparently handle the persistent storage of the *todos* Object.

**NOTE:** You must use a modern browser that supports WebComponents to run this example!

