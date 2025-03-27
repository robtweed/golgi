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

Furthermore, DPP provides the basis for reactive control: any changes to the persistent
*todo* object trigger events, and these are used to invoke state updates within the 
application's *Golgi* WebComponents.

# The Design in a Nutshell

The application has a single Assembly that marshalls the main Components into place:

- the Root Component
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

The UI state is handled from within the Root Component.  It updates the state of each
Item Component and removes any Item Components that no longer have a matching *todo* record.
It also triggers a state update of the Footer Component.

DPP *save* and *delete* events are used to trigger the Root Component state updates.

User interactions within the application itself only change the contents of the *todos* object, which,
in turn, causes the UI state to be updated.

The resulting logic is surprisingly simple, clean and compact, demonstrating the benefits
of Golgi's WebComponent-based design, and further simplified by the use of DPP to 
transparently handle the persistent storage of the *todos* Object and to provide
reactive control.

**NOTE:** You must use a modern browser that supports WebComponents to run this example!

