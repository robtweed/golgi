# *Golgi* Tutorial

# First Steps

You'll need access to a web server and its file system.  Any Web Server on any platform will do.

Create a directory that is accessible by the web server, eg */golgi*.

Then create a sub-directory within it named *components*, ie */golgi/components*.

Inside the */golgi* directory, create the following two files using the filenames and contents shown below:

## *index.html*

      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Golgi Demo</title>
        </head>
      
        <body>
          <script type="module" src="./demo.js"></script>
        </body>
      </html>


## *demo.js*

      const {golgi} = await import('https://cdn.jsdelivr.net/gh/robtweed/golgi/src/golgi.min.js');
      
      let context = {
        componentPaths: {
          demo: window.location.origin + '/golgi/components/'
        }
      };
      
      golgi.renderComponent('demo-div', 'body', context);


And then, in the */golgi/components directory create:

## *demo-div.js*

      export function load() {
      
        let componentName = 'demo-div';
        let count = -1;
      
        customElements.define(componentName, class demo_div extends HTMLElement {
          constructor() {
            super();
            count++;
      
            const html = `
      <div>This is Golgi!</div>
            `;
      
             this.html = `${html}`;
            this.name = componentName + '-' + count;
          }
        });
      };


Now, load the index file into a browser.  Note that it must be a modern browser that
supports WebComponents, eg:

      http://localhost:3000/golgi

or

      http://localhost:3000/golgi/index.html


If see the text below appearing in your browser:

      This is Golgi!

then *Gogli* is working for you and you're ready to explore it in more detail.


# What Just Happened?

Clearly this is a really unremarkable demonstration of *Golgi*'s abilities: all we've done is
display a *div* tag in your browser!  However, if we now analyse what happened and what we
specified in those files, you'll begin to get an initial idea of how the first of *Golgi's*
building blocks - *Golgi Components* - are defined and used.

## The *index.html* Page

Every *Golgi* application needs an HTML page from which it loads and starts.  You'll rarely need
anything other than the one you used in this simple example, so keep it as a template for
future use.  It's the bare minimum you need to kick everything off, even if your application
is a massive and complex one that needs additional JavaScript and
CSS Stylesheet files in order for its UI to behave correctly.

The idea of *Golgi* is that it allows you to build applications that are dynamically built out,
using only the stuff you need at the time.  This significantly reduces startup load times.  It is
ES6 Modules that really make this possible, and that's what *Golgi* harnesses for you.

So let's look at the bare-bones HTML page you used:

      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Golgi Demo</title>
        </head>
      
        <body>
          <script type="module" src="./demo.js"></script>
        </body>
      </html>


The key piece is this line:

          <script type="module" src="./demo.js"></script>

This tells the browser to load your main root application module, in this case *demo.js*.


## The *demo.js* Module

The *demo.js* Module is an extremely simple example of a *Golgi* main or root application module.

Your root application module is where you define the main shape and starting point of your
UI and its application logic.  It must be defined as an ES6 Module using the following pattern

- load the Golgi Module
- define the paths where your *Golgi Components* and *Golgi Assemblies* reside
- start rendering the initial *Golgi Components* or *Golgi Assemblies* that will kick off your application.

### Loading The *Golgi* Module

In our example, we dynamically loaded the *Golgi* Module directly from this Github repo:

      const {golgi} = await import('https://cdn.jsdelivr.net/gh/robtweed/golgi/src/golgi.min.js');

Loading it from Github in this way is a quick way to get started, but has two downsides:

- download speed may not be ideal
- All subsequent module *import*s performed internally by *Golgi*, eg to *import* your *Golgi Components*
will, if not otherwise specified, use paths relative to from where the *Golgi* Module itself was loaded, in
this case:

      https://cdn.jsdelivr.net/gh/robtweed/golgi/src/

### Defining the *Golgi Component* and *Assembly* Paths

You specify the paths from which the *Golgi* Module will *import* your *Golgi Components* and 
*Assemblies* in a *context* object:

      let context = {
        componentPaths: {
          {{namespace}}: {{path}}
        }
      };

*Golgi Components* are WebComponents, and WebComponents create custom HTML tags that must have
a hyphenated name, eg in our example:

      demo-div

In *Golgi*, the text before the first hyphen (in our case *demo*) is used as a *namespace*.  The idea
is you create one or more libraries of *Golgi Components* each of which have the same prefix or namespace.
These can be then be used for one or, indeed, for many of your applications.

Because we loaded the *Golgi* Module from the Github repo, we can't use relative paths for our
*Golgi* Components, so we need to specify the absolute path to your web server, which we can do
by making use of the *window.location.origin* value.  So, the path to our one and only
*Golgi* Component with the namespace *demo* is specified as follows:

      let context = {
        componentPaths: {
          demo: window.location.origin + '/golgi/components/'
        }
      }; 


Things are a lot simpler if you put a local copy of the *Golgi* module onto your web server, eg:

      /golgi/golgi.min.js

You can now load it using this:

      const {golgi} = await import('./golgi.min.js');

... and because it was loaded locally from the same location as your *Golgi Components*,
you can now use relative paths to point to their location on your web server:

      let context = {
        componentPaths: {
          demo: './components/'
        }
      };


### Rendering the *demo-div Golgi Component*

We now have everything needed to start our simple demo application.  In our case we just
want to render the *demo-div Golgi Component*.  We do that using *Golgi*'s *renderComponent()*
method:

      golgi.renderComponent('demo-div', 'body', context);

As you can see, this takes three arguments:

- the name of the *Golgi Component*
- the target element within your HTML page to which it will be appended.  We want to append it
to the *body* tag, so instead of specifying it in full, ie:

      golgi.renderComponent('demo-div', document.getElementsByTagName('body')[0], context);

  ... and because the *body* tag is a very common one to use as a target, the *renderComponent()*
allows you to simply specify it as the *string* value *'body'*.

- the context object which then becomes available for use by *Golgi* and also for use
in your *Golgi Components* if you need or want it.

The *renderComponent()* method dynamically *import*s the *demo-div* Module using a path constructed
as follows:

      context.componentPaths[{{namespace}}] + {{component name}} + '.js'

eg in our "local" example:

      './components/' + 'demo-div' + '.js'

So this highlights an important pattern you **must** adhere to when using *Golgi*: the filename for
each of your *Golgi Component*s must match the name of the WebComponent it defines.

Once *import*ed, the *Golgi Component*'s *load()* method is invoked to register its
WebComponent, and it is then appended to the specified target element of your HTML page.


## The *demo-div Golgi Component*

So now we need to examine our *demo-div Golgi Component*.

*Golgi Component*s must adhere to the following pattern:

      export function load() {
        // define the WebComponent
      };

In other words, they are simple ES6 Modules that wrap a single WebComponent within a *load()* method.

I recommend the following pattern for defining the WebComponent:

- define the component's name and an instance counter (initialised at -1).  
The component's name must match that of the filename in which the Module resides, ie in our example

      let componentName = 'demo-div';
      let count = -1;

Now define the WebComponent:

      customElements.define(componentName, class demo_div extends HTMLElement {

The class name must be unique.  By convention, I simply replace the hyphens in the component name
with underscores, ie:

      demo_div

What follows defines the Web Component in a fairly standard way.  I recommend you
adhere to the pattern and conventions shown here:

      customElements.define(componentName, class demo_div_1 extends HTMLElement {

          // standard WebComponent boilerplate stuff:

          constructor() {
            super();

            // increment the instance counter

            count++;

            // Now define the HTML tag(s) that this WebComponent represents
            // Make sure you use backticks around it

            const html = `
          <div>This is Golgi!</div>
            `;
            
            // now add this as the WebComponent's html property (for later use by Golgi)

            this.html = `${html}`;

            // assign a default name property to the WebComponent

            this.name = componentName + '-' + count;
          }

      });


So, in summary, this will create a WebComponent named *demo-div* that represents a simple
*div* tag with some pre-defined text.

What happens, then, is that *Golgi*'s *renderComponent()* method:

- *import*s the *demo-div.js* Module file
- invokes its *load()* method which instantiates an instance of the WebComponent it defines
- appends the WebComponent tag to the target HTML element that was specified in the *renderComponent()*
method invocation.

There's actually other stuff that *Golgi* does, but none of that is relevant yet to our simple example and we'll discover all that other good stuff later in the tutorial.

The net result is that the *div* tag appears in the browser with its text displaying:

      This is Golgi!


By now you're probably thinking: "That's an awfully complicated way to just display a *div* tag!

If that's all we wanted to do, then yes, of course, you'd be right.  But this simple example has
hopefully explained the basic mechanics of *Golgi* and the patterns you should adopt, without 
any other complexities getting in the way or confusing things.

We're now going to start building on top of this very simple demonstration example, and you'll 
gradually begin to see how *Golgi* can be used for UI development.






