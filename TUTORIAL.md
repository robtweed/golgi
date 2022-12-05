# *Golgi* Tutorial

# Index

- [First Steps](#first-steps)
- [Golgi Components](#golgi-components)
  - [Create A Simple Demo](#create-a-simple-demo)
    - [*index.html*](#indexhtml)
    - [*demo.js*](#demojs)
    - [*demo-div.js*](#demo-divjs)
  - [Run The Demo](#run-the-demo)
  - [How Did It Work?](#how-did-it-work)
    - [The *index.html* Page](#the-indexhtml-page)
    - [The *Golgi* Root Application Module](#the-golgi-root-application-module)
      - [Loading The *Golgi* Module](#loading-the-golgi-module)
      - [Defining the *Golgi Component* and *Assembly* Paths](#defining-the-golgi-component-and-assembly-paths)
      - [Rendering the *demo-div Golgi Component*](#rendering-the-demo-div-golgi-component)
    - [The *demo-div Golgi Component*](#the-demo-div-golgi-component)
      - [The *Golgi Component* Pattern](#the-golgi-component-pattern)
      - [How Your *Golgi Component* Is Loaded and Rendered](#how-your-golgi-component-is-loaded-and-rendered)
    - [Check The Browser's Developer Tools](#check-the-browsers-developer-tools)
    - [Using *Golgi*'s Log](#using-golgis-log)
  - [Adding And Using A SetState() Method](#adding-and-using-a-setstate-method)
  - [Assigning WebComponent HTML Tags To Properties](#assigning-webcomponent-html-tags-to-properties)
  - [Adding Handlers to *Golgi Components*](#adding-handlers-to-golgi-components)
  - [Removing *Golgi Components* from the DOM](#removing-golgi-components-from-the-dom)
- [Golgi Assemblies](#golgi-assemblies)
  - [What Are *Golgi Assemblies*?](#what-are-golgi-assemblies)
  - [Create A Simple Example](#create-a-simple-example)
    - [Create An Assemblies Directory](#create-an-assemblies-directory)
    - [Create Your Assembly File](#create-your-assembly-file)
    - [Edit The Root Application Module](#edit-the-root-application-module)
    - [Run The Example](#run-the-example)
  - [How And Why Did The Example Work?](#how-and-why-did-the-example-work)
    - [The Root Application Module](#the-root-application-module)
      - [The Context Object](#the-context-object)
      - [The *renderAssembly()* Method](#the-renderassembly-method)
    - [Our *Golgi Assembly*](#our-golgi-assembly)
      - [The *Golgi Assembly* Pattern](#the-golgi-assembly-pattern)
      - [How the *RenderAssembly()* Method Works](#how-the-renderassembly-method-works)
    - [What Happened When Our Assembly Was Rendered?](#what-happened-when-our-assembly-was-rendered)
      - [The Parent *gx* Tag](#the-parent-gx-tag)
      - [The *demo-div Golgi Component*](#the-demo-div-golgi-component-1)
      - [The DOM After The Parent *gx* Tag is Rendered](#the-dom-after-the-parent-gx-tag-is-rendered)
      - [Setting State Using *gx* Tag Attributes](#setting-state-using-gx-tag-attributes)
      - [The DOM After State Is Set](#the-dom-after-state-is-set)
      - [The Child *gx* Tag](#the-child-gx-tag)
      - [The *childrenTarget* Property](#the-childrentarget-property)
      - [The DOM After the Child *gx* Tag is Rendered](#the-dom-after-the-child-gx-tag-is-rendered)
  - [Try Out the *demo-div* Component Click Handler](#try-out-the-demo-div-component-click-handler)
  - [Adding *Hooks* To *Golgi COmponents* Within Assemblies](#adding-hooks-to-golgi-components-within-assemblies)
    - [What Are Hooks?](#what-are-hooks)
    - [An Example Use Case for Hooks](#an-example-use-case-for-hooks)
    - [Specifying a Hook](#specifying-a-hook)
      - [The *golgi:hook gx* Attribute](#the-golgihook-gx-attribute)
      - [The *hooks* Object](#the-hooks-object)
    - [Add A Hook To Our Example Assembly](#add-a-hook-to-our-example-assembly)
    - [Try It Out!](#try-it-out)
  - [Customising How *Golgi Component*s Are Appended to their Parent Component](#customising-how-golgi-components-are-appended-to-their-parent-component)
    - [Re-assigning the *childrenTarget* Property](#re-assigning-the-childrentarget-property)
    - [Multiple Parent Append Target Elements](#multiple-parent-append-target-elements)
  - [Using *Golgi Assemblies* Within *gx*](#using-golgi-assemblies-within-gx)
  - [Using ordinary HTML tags within *gx*](#using-ordinary-html-tags-within-gx)
  - [Hoisting Classes to the Top-Level Component Element](#hoisting-classes-to-the-top-level-component-element)
  - [Dynamically Loading JavaScript and CSS Resources](#dynamically-loading-javascript-and-css-resources)
  - [Dynamically Adding Meta Tags to the DOM](#dynamically-adding-meta-tags-to-the-dom)
- [*Golgi Component* Lifecycle Methods](#golgi-component-lifecycle-methods)
- [*Golgi* Properties for Navigation between *Golgi Components*](#golgi-properties-for-navigation-between-golgi-components)
- [*Golgi* Methods For Use Within *Golgi Components* and *Hook* Methods](#golgi-methods-for-use-within-golgi-components-and-hook-methods)
- [State management and Data Binding in *Golgi*](#state-management-and-data-binding-in-golgi)
  - [Defining A State Map in an Assembly](#defining-a-state-map-in-an-assembly)
  - [Defining Data Binding Within A Component](#defining-data-binding-within-a-component)
  - [Rendering Multiple Copies of a Component Mapped to a State Array](#rendering-multiple-copies-of-a-component-mapped-to-a-state-array)
- [Automatically Detecting DOM Changes in *Golgi Components*](#automatically-detecting-dom-changes-in-golgi-components)
  - [Detecting Changes the Hard Way](#detecting-changes-the-hard-way)
  - [Activating a MutationObserver within a *Golgi Component*](#activating-a-mutationobserver-within-a-golgi-component)
  - [Handling Mutation Events](#handling-mutation-events)
  - [Simple Example](#simple-example)


# First Steps 

You'll need access to a web server and its file system.  Any Web Server on any platform will do.

Create a directory that is accessible by the web server, eg */golgi*.

Then create a sub-directory within it named *components*, ie */golgi/components*.

<br/>
<div align="right">
    <b><a href="#index">back to top</a></b>
</div>
<br/>

# *Golgi* Components

<br/>
<div align="right">
    <b><a href="#index">back to top</a></b>
</div>
<br/>

## Create a Simple Demo

Inside the */golgi* directory, create the following two files using the filenames and contents shown below:

### *index.html*

      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Golgi Demo</title>
        </head>
      
        <body>
          <script type="module" src="./demo.js"></script>
        </body>
      </html>


### *demo.js*

      (async () => {
        const {golgi} = await import('https://cdn.jsdelivr.net/gh/robtweed/golgi/src/golgi.min.js');
      
        let context = {
          componentPaths: {
            demo: window.location.origin + '/golgi/components/'
          }
        };
      
        golgi.renderComponent('demo-div', 'body', context);

      })();


And then, in the */golgi/components directory create:

### *demo-div.js*

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

<br/>
<div align="right">
  <b><a href="#create-a-simple-demo">Go Up</a></b>
</div>
<br/>

## Run The Demo

Now, load the index file into a browser.  Note that it must be a modern browser that
supports WebComponents, eg:

      http://localhost:3000/golgi

or

      http://localhost:3000/golgi/index.html


If see the text below appearing in your browser:

      This is Golgi!

then *Gogli* is working for you and you're ready to explore it in more detail.

<br/>
<div align="right">
  <b><a href="#golgi-components">Go Up</a></b>
</div>
<br/>

## How Did It Work?

Clearly this is a really unremarkable demonstration of *Golgi*'s abilities: all we've done is
display a *div* tag in your browser!  However, if we now analyse what happened and what we
specified in those three files, you'll begin to get an initial idea of how the most basic of *Golgi's*
building blocks - *Golgi Components* - are defined and used.

<br/>
<div align="right">
  <b><a href="#golgi-components">Go Up</a></b>
</div>
<br/>

### The *index.html* Page

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

<br/>
<div align="right">
  <b><a href="#how-did-it-work">Go Up</a></b>
</div>
<br/>

### The *Golgi* Root Application Module

The *demo.js* Module is an extremely simple example of a *Golgi* main or root application module.

Your root application module is where you define the main shape and starting point of your
UI and its application logic.

To make it work with all modern browsers, it should be wrapped as a self-loading
*async* function.  Safari, in particular, needs this due to the way it handles what's known as
*top-level await*.  So that's this piece:

      (async () => {

        ...etc

      })();

The contents of this self-loading function should adhere to the following pattern

- load the *Golgi* Module
- define the paths where your *Golgi Components* and *Golgi Assemblies* reside
- start rendering the initial *Golgi Components* or *Golgi Assemblies* that will kick off your application.

Let's drill down into each of those steps:

#### Loading The *Golgi* Module

In our example, we dynamically loaded the *Golgi* Module directly from this Github repo:

      const {golgi} = await import('https://cdn.jsdelivr.net/gh/robtweed/golgi/src/golgi.min.js');

Loading it from Github in this way is a quick way to get started, but has two downsides:

- download speed may not be ideal
- All subsequent module *import*s performed internally by *Golgi*, eg to *import* your *Golgi Components*
will, if not otherwise specified, use paths relative to from where the *Golgi* Module itself was loaded, in
this case:

      https://cdn.jsdelivr.net/gh/robtweed/golgi/src/

#### Defining the *Golgi Component* and *Assembly* Paths

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
is you create directories for each of your libraries of *Golgi Components*.  Within such a directory,
all your *Golgi Components* will have the same prefix or namespace.
These can be then be used as the basic building blocks for an application, or, indeed, for as many 
of your applications as you wish.

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


#### Rendering the *demo-div Golgi Component*

We now have everything needed to start our simple demo application.  In our case we just
want to render the *demo-div Golgi Component*.  We do that using *Golgi*'s *renderComponent()*
method:

      golgi.renderComponent('demo-div', 'body', context);

As you can see, this takes three arguments:

- the name of the *Golgi Component*
- the target element within your HTML page DOM to which it will be appended.  We want to append it
to the *body* tag, so instead of specifying it in full, ie:

      golgi.renderComponent('demo-div', document.getElementsByTagName('body')[0], context);

  ... and because the *body* tag is a very common one to use as an initial target, the 
*renderComponent()* method allows you to simply specify it as the *string* value *'body'*.

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

<br/>
<div align="right">
  <b><a href="#the-golgi-root-application-module">Go Up</a></b>
</div>
<br/>

### The *demo-div Golgi Component*

So now we need to examine the last of our files (*demo-div.js*), which contains the 
definition of the *demo-div Golgi Component*.

#### The *Golgi Component* Pattern

*Golgi Component*s must adhere to the following pattern:

      export function load() {
        // define the WebComponent
      };

In other words, they are simple ES6 Modules that wrap a single WebComponent within an
exported *load()* method.

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

      customElements.define(componentName, class demo_div extends HTMLElement {

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

            // assign a default, unique name property to the WebComponent
            //  you may later decide to redefine the name property with a
            //  more memorable name

            this.name = componentName + '-' + count;
          }

      });


So, in summary, this will create a WebComponent named *demo-div* that represents a simple
*div* tag with some pre-defined text.

##### Can you use Shadow DOM with Golgi?

In the simple tutorial example, we're not using the Shadow DOM capability that WebComponents provide.  However, Golgi supports the use of Shadow DOM: simply attach the shadowDOM and change the line that maps the Component's HTML, which should now be to *this.shadowRoot.innerHTML*.  See the lines highlighted by comments below:

      export function load() {
      
        let componentName = 'demo-div';
        let count = -1;
      
        customElements.define(componentName, class demo_div extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' });      // <==== ****
            count++;
      
            const html = `
      <div>This is Golgi!</div>
            `;
      
            this.shadowRoot.innerHTML = `${html}`;    // <===== *****
            this.name = componentName + '-' + count;
          }
        });
      };


#### How Your *Golgi Component* Is Loaded and Rendered

In our simple example, we're loading and rendering our *demo-div* *Golgi Component* by
using the *renderComponent()* method.  What this method does is to:

- *import* the *demo-div.js* Module file
- invoke its *load()* method which instantiates an instance of the WebComponent it defines
- append the WebComponent tag to the target HTML element that was specified in the *renderComponent()*
method invocation.

There's actually other stuff that *Golgi* does, but none of that is relevant yet to our simple example and we'll discover all that other good stuff later in the tutorial.

The net result is that the *div* tag appears in the browser with its text displaying:

      This is Golgi!


By now you're probably thinking: "That's an awfully complicated way to just display a *div* tag!"

If that's all we wanted to do, then yes, of course, you'd be right.  But this simple example has
hopefully explained the basic mechanics of *Golgi* and the patterns you should adopt, without 
any other complexities getting in the way or confusing things.

We're now going to start building on top of this very simple demonstration example, and you'll 
gradually begin to see how *Golgi* can be used for UI development.

<br/>
<div align="right">
  <b><a href="#the-demo-div-golgi-component">Go Up</a></b>
</div>
<br/>


### Check The Browser's Developer Tools

Before we move on, if you're using a browser such as Chrome, you can open the Developer 
Tools panel, and, if you
select the *Network* tab, you'll be able to see the sequence of events that occur when you
load/reload the *index.html* page.  You should see in sequence:

- *index.html* is loaded
- *demo.js* is then loaded by *index.html*
- *golgi-min.js* is then loaded, and once it's finished loading:
- *demo-div.js* is loaded by the *renderComponent()* method in *demo.js*


If you select the *Elements* tab, you'll be able to see what your *index.html* page now looks like in the browser:

      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Golgi Demo</title>
          <style>...</style>
        </head>
        <body>
          <script type="module" src="./demo-1a.js"></script>
          <demo-div>
            <div>This is Golgi!</div>
          </demo-div>
        </body>
      </html>

We can ignore the *style* tag that's been added by your browser to the *head* section.

The important thing to notice is the *&lt;demo-div&gt;* tag that has been added, inside of
which is the *div* tag we defined in its WebComponent.

The Developer Tools panel is a very useful and powerful tool to use when developing with *Golgi*,
allowing you to check that the correct things have loaded as you'd expected, and that the
HTML document's DOM is being correctly updated by your *Golgi Component*s and *Assemblies*.

I'd recommend that you refer to it throughout the rest of this tutorial when you load/reload
each new version of the demonstration application.

<br/>
<div align="right">
  <b><a href="#how-did-it-work">Go Up</a></b>
</div>
<br/>

### Using *Golgi*'s Log

A further means of seeing and checking what *Golgi* is doing is to enable its log (by 
default it is disabled).  When enabled, *Golgi* reports various key steps to the browser's
console.  During development and debugging, it's a good idea to turn *Golgi*'s logging on.

To turn logging on, add this line to your root application module:

      golgi.setLog(true);

To inspect its log, use the *Console* tab in the browser's Developer Tools panel.

<br/>
<div align="right">
  <b><a href="#how-did-it-work">Go Up</a></b>
</div>
<br/>

## Adding And Using A SetState() Method

One of the things you'll want to be able to do with your *Golgi Component*s is to manipulate
their state.  The convention I use is to add a method named *setState()* to your
*Golgi Component*.

To see this in operation, edit your */golgi/components/demo-div.js* file, adding this method to the
WebComponent definition:

      setState(state) {
        if (state.text) {
          this.rootElement.textContent = state.text;
        }
      }

Within a WebComponent, *this* refers to the Component itself.  When processed by *Golgi*, 
the root HTML element in the HTML you specified is automatically referenced via a property
named *rootElement* (even if you choose to use Shadow DOM).  In our example, that's the *div* tag.

So this *setState()* method will replace the *div* tag's *textContent* with whatever you specify
in the *state* object's *text* property.

The new version of your *demo-div* *Golgi Component* should now therefore look like this:

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
      
          setState(state) {
            if (state.text) {
              this.rootElement.textContent = state.text;
            }
          }
        });
      };


Let's now edit your root application module (*/golgi/demo.js*)

First we'll change the invocation of the *golgi.renderComponent()* method to the following:

      let demoComponent = await golgi.renderComponent('demo-div', 'body', context);

So we *await* completion of the asynchronous *renderComponent()* method, and what it
then returns to us is the actual instance of the *demo-div* WebComponent that was rendered.

We can now access any of that WebComponent's methods and properties.

So let's add this:

      demoComponent.setState({text: 'Hello World'});

In summary, the */golgi/demo.js* file should now look like this:

      const {golgi} = await import('./golgi.min.js');
      let context = {
        componentPaths: {
          demo: './components/'
        }
      };

      golgi.setLog(true);
      
      let demoComponent = await golgi.renderComponent('demo-div', 'body', context);
      demoComponent.setState({text: 'Hello World'});

Save the file and reload the *index.html* page in the browser.

Instead of the text "This is Golgi!", you should now see the text:

      Hello World

<br/>
<div align="right">
  <b><a href="#golgi-components">Go Up</a></b>
</div>
<br/>

## Assigning WebComponent HTML Tags To Properties

Thus far, the WebComponent within our demonstration *Golgi Component* consists of a single
*div* tag.  However, the WebComponent can define as much and as complex a chunk of nested
HTML tags as you wish.  When you do this, you'll often want to be able to access specific
tags within the WebComponent so that you can later manipulate them.

Whilst you could achieve this using the standard HTML DOM APIs, this would end up being very
laborious during development, and not particularly easy to follow and maintain at a later date.

*Golgi* provides a very simple alternative way to make these assignments by allowing you to
add a special reserved attribute name - *golgi:prop* - to any tag you define within a
WebComponent.  The value of this attribute is used as a property name, that property being
automatically added to the WebComponent, and that property value provides the DOM pointer to
that tag.  

Let's try it out and it will become much clearer.

First, we're going to modify the *demo-div* *Golgi Component*.  So edit the
*/golgi/components/demo-div.js* file, and change the HTML assignment to the following:

      <div>
        <span golgi:prop="spanTag"></span>
      </div>

If you remember from earlier, the outer *div* tag is already automatically referenceable via
*Golgi* as *this.rootElement*.  By adding the *golgi:prop* attribute to its new child *span*
tag, we'll now be able to reference and access that *span* tag as *this.spanTag* (note that this
would be true even if we had chosen to use Shadow DOM).

Let's now modify the *setState()* method to use this, because we now want *state.text* 
to modify the *textContent* of the *span* tag rather than the *div* tag:

      setState(state) {
        if (state.text) {
          this.spanTag.textContent = state.text;
        }
      }


Try saving this edited version and reload the page in the browser.  It should display the exact same thing as before - "Hello World" = but if you examine the Elements view in the browser's Developer Tools, you should
now see that the text is inside the *span* tag:

      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Golgi Demo</title>
          <style>...</style>
        </head>
        <body>
          <script type="module" src="./demo-1a.js"></script>
          <demo-div>
            <div>
              <span>This is Golgi!</span>
            </div>
          </demo-div>
        </body>
      </html>


As a further demonstration, try editing the */golgi/demo.js* root Module as follows:

      let demoComponent = await golgi.renderComponent('demo-div-3', 'body', context);
      demoComponent.setState({text: demoComponent.spanTag.tagName});

You can see from this that the *spanTag* property created by the *golgi:prop* attribute gives us
access directly to the *span* tag within our instance of the *demo-div* WebComponent.

<br/>
<div align="right">
  <b><a href="#golgi-components">Go Up</a></b>
</div>
<br/>

## Adding Handlers to *Golgi Components*

Something you'll often want to do is to add handlers to tags within a *Golgi Component*.  Sometimes
you'll want to do that when its WebComponent is being instantiated so that the handler(s) is/are
always present.

Once again, *Golgi* makes this very simple.  Let's add an *onClick* handler to our *demo-div* Component.

Edit the */golgi/components/demo-div.js* file once more, and change the HTML assignment within the
WebComponent:


      <div>
        <span golgi:prop="spanTag" golgi:on_click="report"></span>
      </div>


and within the body of the WebComponent, add a method named *report*:

      report() {
        this.setState({text: 'You clicked the div at ' + Date.now()});
      };


Save the file and reload the *index.html* file in the browser, and now whenever you click
the text, you'll see it updating the *span* tag's text content.

Let's examine why this happened.

When running the *renderComponent()* method, one of the things *Golgi* looks for within the
HTML that you define in each of your WebComponents is a special attribute: *golgi:on{{eventName}}*,
where *eventName* is any applicable DOM event (eg *click*, *mouseover*, *submit* etc).  In our
example we want a *click* event, hence we specified the attribute name *golgi:on_click*.  The value
you specify is used by *Golgi* to add an event listener to the DOM element, invoking the specified
WebComponent method.  In our example, this is a method named *report* which we added to the
WebComponent, and which, when invoked, updates the Component's *text* state property.

**Note:** *Golgi* ensures that the *this* context within the method is the WebComponent itself,
as you'd expect.

<br/>
<div align="right">
  <b><a href="#golgi-components">Go Up</a></b>
</div>
<br/>


## Removing *Golgi Components* from the DOM

Sometimes you'll want to remove stuff from the DOM that represents your UI.  You should do
this by using the *remove()* method that is automatically added to WebComponents by *Golgi*.

It's not a good idea to use the simple, raw *removeChild()* DOM method to remove
 *Golgi Components*.  That's because:

- as you'll discover when we look at *Golgi Assemblies*, the *Golgi Component* you're removing 
may have other child *Golgi Component*s nested within it, which, in turn, 
may have others nested within them, and so on ad nauseam.  Each of these child Components should 
be cleanly and explicitly removed too in order to avoid memory leaks.

- furthermore, the WebComponent(s) being removed may have been augmented with handler functions (as per
our previous example), and these will be left hanging about in memory if you simply use *removeChild()*
to delete the WebComponent from your DOM.

Let's deal with these in reverse sequence.  When adding handlers via the *golgi:on_* attribute,
*Golgi* registers the handler in a Map that is maintained within the WebComponent.

Then, dealing with the first issue, by using *Golgi*'s *remove()* method, it will recurse down through any
lower-level nested *Golgi Component*s, starting at the lowest-level leaf Components, first removing 
any registered handlers and then deleting the WebComponent before moving up to its parent and repeating the
process.  The *remove()* method, together with the *addHandler()* method, therefore ensure that memory leaks
are avoided when deleting a *Golgi Component*.
 
So, let's put all these together into our example.

Edit your root Module (*/golgi/demo.js*), and add a *setTimeout* function that 
will remove the *demo-div* Component from the DOM after 5 seconds:

      (async () => {
        const {golgi} = await import('./golgi.min.js');
        let context = {
          componentPaths: {
            demo: './components/'
          }
        };
        golgi.setLog(true);
        let demoComponent = await golgi.renderComponent('demo-div', 'body', context);
        
        setTimeout(function() {
          demoComponent.remove();
        }, 5000);
      })();

Now reload the *index.html* page.  After 5 seconds, the text will disappear, and if you examine
the DOM using the browser's Developer Tools *elements* tab, you'll see confirmation that the
*&lt;demo-div&gt;* tag no longer exists.

Try it again, and this time watch the *Golgi* log being reported to the browser's *Console*.

You'll see it reporting the removal of the *demo-div* element and its *click* handler.

<br/>
<div align="right">
  <b><a href="#golgi-components">Go Up</a></b>
</div>
<br/>

----

# *Golgi Assemblies*

<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

## What Are *Golgi Assemblies*?

So far we've just looked at how to define and use a single *Golgi Component*.  Where things begin
to get really interesting and powerful is when we start to look at *Golgi Assemblies*.

At their simplest, *Golgi Assemblies* are a set of nested *Golgi Components*.

However, *Golgi* allows you to do all sorts of things to customise the *Golgi Components* 
you use within an *Assembly*.

*Golgi Assemblies* always follow the simple pattern:

      export function load(ctx) {

        // Define your assembly as a nested set of XML tags, known as "gx"
        // with each XML tag repesenting a Golgi Component of the same name

        // optionally define one or more "hook" methods linked to the gx tags

        return {gx, hooks};  // or return {gx} if you didn't define any hooks
      }; 

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

## Create A Simple Example

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

### Create An Assemblies Directory

Let's create a simple *Golgi Assembly* using the *demo-div* *Golgi Component* we created earlier.

First, it's a good idea to create a separate directory for your *Golgi Assemblies*. So, on your
web server, create a subdirectory beneath the */golgi* directory you created earlier, and name it
*assemblies*, ie you should now have a directory:

      /golgi/assemblies

<br/>
<div align="right">
  <b><a href="#create-a-simple-example">Go Up</a></b>
</div>
<br/>

### Create Your Assembly File

Within this new directory, create a file named demo_assembly.js (ie */golgi/assemblies/demo_assembly.js*),
containing the following:


      export function load(ctx) {
        let gx=`
      <demo-div text="Welcome to Golgi Assemblies">
        <demo-div text="I'm inside the other div!" />
      </demo-div>
        `;
      
        return {gx};
      };

<br/>
<div align="right">
  <b><a href="#create-a-simple-example">Go Up</a></b>
</div>
<br/>

### Edit The Root Application Module

Next, edit your root application module (ie */golgi/demo.js*) to render this assembly rather than the
single *Golgi Component* we've been using so far:

      (async () => {
        const {golgi} = await import('./golgi.min.js');
        let context = {
          componentPaths: {
            demo: './components/'
          },
          assemblies: './assemblies'
        };
        
        golgi.setLog(true);
       
        await golgi.renderAssembly('demo_assembly', 'body', context);
      })();

<br/>
<div align="right">
  <b><a href="#create-a-simple-example">Go Up</a></b>
</div>
<br/>

### Run The Example

That's it!  Now see what happens when you reload the *index.html* page in your browser.

You should see two lines:

      Welcome to Golgi Assemblies
      I'm inside the other div!

Take a look at the browser's Developer Tools Elements view and you'll see that it has indeed rendered
and nested two of our *demo-div* Components:

      <demo-div>
        <div>
          </span>Welcome to Golgi Assemblies</span>
          <demo-div>
            <div>
              </span>I'm inside the other div!</span>
            </div>
          </demo-div>
        </div>
      </demo-div>

<br/>
<div align="right">
  <b><a href="#create-a-simple-example">Go Up</a></b>
</div>
<br/>


## How And Why Did The Example Work?

Let's analyse in detail what happened and why.

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

### The Root Application Module

Let's start with the root application module.

<br/>
<div align="right">
  <b><a href="#how-and-why-did-the-example-work">Go Up</a></b>
</div>
<br/>

#### The Context Object

The first thing to notice is that we extended
the *context* object with the path for the directory we created for our assembly files:

      let context = {
        componentPaths: {
          demo: './components/'
        },
        assemblies: './assemblies'
      };


In an individual *Golgi* application, all your *Golgi Assembly* files must reside together in
the same directory.  The *Golgi Components* used by your *Assemblies* may come from more than
one path: if you remember, *Golgi Components* are namespaced according to the prefix in their
hyphenated name.

<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

#### The *renderAssembly()* Method

A *Golgi* application will normally be started by rendering an initial "root" *Golgi Assembly*.
That *Assembly* or its logic within it may render other Assemblies, but your main application
module should render the root *Assembly* using *Golgi*'s *renderAssembly()* method.  Here
that is in our example:

      await golgi.renderAssembly('demo_assembly', 'body', context);

You'll notice that this is almost identical to the *renderComponent()* method we used previously.  
It doesn't return anything, but requires three similar arguments:

- the name of the *Golgi Assembly*
- the target element within your HTML page to which the root Component within the
*Assembly* will be appended.  We want to append it to the *body* tag, so instead of 
specifying it in full, ie:

      await golgi.renderAssembly('demo_assembly', document.getElementsByTagName('body')[0], context);

  ... and because the *body* tag is a very common one to use as a target, the *renderAssembly()*
method allows you to simply specify it as the *string* value *'body'*.

- the context object which then becomes available for use within
your *Golgi Assembly*'s exported function if you need or want it.

The *renderAssembly()* method dynamically *import*s the *demo_assembly* Module using a path constructed
as follows:

      context.componentPaths.assemblyPath + {{assembly name}} + '.js'

eg in our example:

      './assemblies/' + 'demo_assembly' + '.js'

So this highlights an important pattern you **must** adhere to when using *Golgi*: the filename for
each of your *Golgi Assemblies* must match the name by which your refer to it.

<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

### Our *Golgi Assembly*

So now let's look at our simple demonstration *Golgi Assembly*.

<br/>
<div align="right">
  <b><a href="#how-and-why-did-the-example-work">Go Up</a></b>
</div>
<br/>

#### The *Golgi Assembly* Pattern

The first thing to notice is that it must be defined as an ES6 module that exports a
function named *load().  This function has a single argument which is the *context* object
that you passed into the *renderAssembly()* method as its third argument:

      export function load(ctx) {
        // assembly definition
      };

Inside this function, we define something refered to as *gx* which is a group of XML tags representing
the *Golgi Components* and/or other *Golgi Assemblies* that constitute our Assembly.

Note that the *gx* **must** be specified within back-ticks:

        let gx=`
      <demo-div text="Welcome to Golgi Assemblies">
        <demo-div text="I'm inside the other div!" />
      </demo-div>
        `;

The block of *gx* **must** follow the basic XML rules, so that means no attributes without values, and
no unclosed tags: this **isn't** lazy-formatted HTML!

The *gx* that you define **must** be returned using:

      return {gx};

<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

#### How the *renderAssembly()* Method Works

The *renderAssembly()* method first dynamically *import*s the *Golgi Assembly* Module,
and then invokes its *load()* method.  This results in a cascade of activity: 

-each *Golgi Component*
referenced in your *gx* is dynamically imported and rendered in turn, first starting with the parent
*gx* tag(s), then, once each has completed its load and render sequence, any child *gx* tags
are similarly processed.  This process is repeated, recursing down through all the nested *gx* tags that 
you have specified.

**Note 1:** *Golgi* processes each child *gx* tag in strict sequence, to ensure that they
are correctly appended to their parent element's target(s) in the sequence,
as defined by the sequencing of your *gx* tags.  The
importation of each child's associated *Golgi Component* modules must therefore await completion of its
previous sibling before it can begin its own importation and processing. All of the previous sibling's
descendent Components also have to complete rendering before the next sibling Component's rendering can
complete.

**Note 2:** Each *Golgi Component* that you use is only physically imported once.  Any
subsequent references to/use of that same *Golgi Component* will use a cached version without
any noticeable overhead.  Also, of course, the browser itself will thereafter cache the modules
imported by your application, so any network transport delays will be significantly reduced
whenever the application is re-run in the browser.  

**Note 3:** Even if a large UI application involves the
importation of many *Golgi Components*, you should nevertheless find that both perceived and 
actual performance is very high because (a) the imported modules are typically tiny files;
(b) the progressive, "only as needed" build-out of an *Golgi* application
means that only those Component modules needed at any point within your application
 are actually physically imported; and (c) Your UI elements should appear in sequence as soon
as they are loaded, so the user shouldn't typically see any significant delays 
whilst looking at a blank screen.

<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

### What Happened When Our Assembly Was Rendered?

Hopefully everything will become clearer if we step through our example Assembly and analyse how
*Golgi* processed it.

<br/>
<div align="right">
  <b><a href="#how-and-why-did-the-example-work">Go Up</a></b>
</div>
<br/>

#### The Parent *gx* Tag

It starts with the parent *gx* tag which, in our case is:

      <demo-div text="Welcome to Golgi Assemblies">...</demo-div>

This tells *Golgi* to render our *demo-div* *Golgi Component*.  If it hasn't already been 
imported, *Golgi* imports it, and once ready, it renders the Component, attaching it to the
parent DOM node defined by the *renderAssembly()* function's second argument.

<br/>
<div align="right">
  <b><a href="#what-happened-when-our-assembly-was-rendered">Go Up</a></b>
</div>
<br/>

#### The *demo-div Golgi Component*

Let's just remind ourselves what the *demo-div* *Golgi Component*t looked like:

      export function load() { 
        let componentName = 'demo-div';
        let count = -1;
        customElements.define(componentName, class demo_div extends HTMLElement {
          constructor() {
            super();
            count++;
            const html = `
      <div>
        <span golgi:prop="spanTag" golgi:on_click="report"></span>
      </div>
            `;
            this.html = `${html}`;
            this.name = componentName + '-' + count;
          }

          setState(state) {
            if (state.text) {
              this.spanTag.textContent = state.text;
            }
          }

          report(e) {
            e.stopPropagation();
            this.setState({text: 'You clicked the div at ' + Date.now()});;
          }
        });
      };

<br/>
<div align="right">
  <b><a href="#what-happened-when-our-assembly-was-rendered">Go Up</a></b>
</div>
<br/>

#### The DOM After The Parent *gx* Tag is Rendered


At this point, your page's DOM will look like this:

      <body>
        <demo-div>
          <div>
            <span>Click Me!</span>
          </div>
        </demo-div>
      </body>

<br/>
<div align="right">
  <b><a href="#what-happened-when-our-assembly-was-rendered">Go Up</a></b>
</div>
<br/>

#### Setting State Using *gx* Tag Attributes

The next thing that happens is that *Golgi* looks through the *gx* tag's attributes.  Unless
prefixed with *golgi:*, each one is used to specify initial state for the *Component*.

The logic used by *Golgi* is as follows:

- if a method with the same name as the attribute name exists within the WebComponent, 
it is invoked and the attribute's value is used as the argument for that method

- if no matching method is found, *Golgi* will try to use the WebComponent's *setState()* method.

So, on finding this attribute:

      text="Welcome to Golgi Assemblies"

... then, if a method named *test()* exists within the WebComponent, it is executed, ie:

      component.text("Welcome to Golgi Assemblies")

...and if not, the Component's *setState()* method is used, ie:

      component.setState({text: "Welcome to Golgi Assemblies"});

So you can see in the *demo-div* WebComponent definition it will use the latter, which 
will result in:

      this.spanTag.textContent = state.text;

Remember that *this.spanTag* was defined by the *golgi:prop* attribute in the *span* tag here:

        <span golgi:prop="spanTag" golgi:on_click="report"></span>

<br/>
<div align="right">
  <b><a href="#what-happened-when-our-assembly-was-rendered">Go Up</a></b>
</div>
<br/>

#### The DOM After State Is Set

And so the text within the *demo-div* Component's *span* tag will change to
*Welcome to Golgi Assemblies*, ie:

      <body>
        <demo-div>
          <div>
            <span>Welcome to Golgi Assemblies</span>
          </div>
        </demo-div>
      </body>


So that completes the processing of the parent *gx* tag.  

<br/>
<div align="right">
  <b><a href="#what-happened-when-our-assembly-was-rendered">Go Up</a></b>
</div>
<br/>

#### The Child *gx* Tag

*Golgi* now moves on to
process any of its child *gx* tags, and finds this one:

        <demo-div text="I'm inside the other div!" />

So it repeats the steps.  *Golgi* notices that it's already imported and registered
the *demo-div* WebComponent, so it can use it straight away.  It renders the WebComponent's
HTML and then it needs to decide where to append it.  

<br/>
<div align="right">
  <b><a href="#what-happened-when-our-assembly-was-rendered">Go Up</a></b>
</div>
<br/>

#### The *childrenTarget* Property

Unless told otherwise, *Golgi* will
assume that the rendered HTML should be appended to the parent Component's element designated by a 
*childrenTarget* property.  By default, and unless otherwise instructed to do so, *Golgi* will
automatically assign a WebComponent's HTML *rootElement* to be the *childrenTarget*.  

We'll see later how you can change and control this, but in our example, *Golgi* has used 
its default logic, so the *childrenTarget* is the outer *&lt;div&gt;* tag of the *demo-div* Component, ie:

                       <body>
                         <demo-div>
      childrenTarget ==>   <div>
                             <span>Welcome to Golgi Assemblies</span>
                           </div>
                         </demo-div>
                       </body>

As a result, the second instance of the *demo-div* WebComponent is appended as a child of the
first instance's *div* tag.  

<br/>
<div align="right">
  <b><a href="#what-happened-when-our-assembly-was-rendered">Go Up</a></b>
</div>
<br/>

#### The DOM After the Child *gx* Tag is Rendered

So the DOM now looks like this:

      <body>
        <demo-div>
          <div>
            <span>Welcome to Golgi Assemblies</span>

            <demo-div>
              <div>
                <span>Click Me!</span>
              </div>
            </demo-div>

          </div>
        </demo-div>
      </body>


The *text* attribute of the inner *demo-div* *gx* tag is now processed:

     text="I'm inside the other div!"

which, once again, applies the *setState()* method, but this time applied to the
inner WebComponent instance, resulting in the DOM changing to:

      <body>
        <demo-div>
          <div>
            <span>Welcome to Golgi Assemblies</span>

            <demo-div>
              <div>
                <span>I'm inside the other div!</span>
              </div>
            </demo-div>

          </div>
        </demo-div>
      </body>

and with that, *Golgi* find no more *gx* tags in our Assembly, so processing of our example completes!

<br/>
<div align="right">
  <b><a href="#what-happened-when-our-assembly-was-rendered">Go Up</a></b>
</div>
<br/>

## Try Out the *demo-div* Component Click Handler

Now that the completed page is rendered in your browser, if you remember back to when we created the *demo-div* component, we added a *click* handler to its *span* tag which invoked a method named
*report*:

          report(e) {
            e.stopPropagation();
            this.setState({text: 'You clicked the div at ' + Date.now()});
          }

Try clicking each of the lines of text.  You should notice that they each respond to clicks and also behave independently, each updating the text within their own instance of the *demo-div* WebComponent.

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

## Adding *Hooks* To *Golgi Components* Within Assemblies

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

### What Are Hooks?

*Golgi Assemblies* have a very powerful trick up their sleeve: *Hooks*.
  
*Hooks* are methods that you can
optionally define and assign to specific Components within your Assemblies.  

A Hook Method is
invoked immediately after its owner Component is rendered and attached to the DOM.  Critically, 
the Hook Method
is only invoked for the instance of the Component for which it is defined.

**Note: ** a Component's Hook Method is invoked immediately after the Component's state is
updated in accordance with any attributes in the Component's *gx* tag,

<br/>
<div align="right">
  <b><a href="#adding-hooks-to-golgi-components-within-assemblies">Go Up</a></b>
</div>
<br/>

### An Example Use Case for Hooks

So far you've seen how you can define properties and methods within the WebComponent
definition of a *Golgi Component*.  Such methods and properties become available for every instance
of that *Golgi Component* within your Assemblies.

You'll frequently have situations where you want to augment just one particular instance of a
*Golgi Component* within your Assemblies, for example adding a particular handler to it,
whilst leaving all other instances of the Component as standard.  Hooks
make this trivially simple.

<br/>
<div align="right">
  <b><a href="#adding-hooks-to-golgi-components-within-assemblies">Go Up</a></b>
</div>
<br/>

### Specifying A Hook

<br/>
<div align="right">
  <b><a href="#adding-hooks-to-golgi-components-within-assemblies">Go Up</a></b>
</div>
<br/>

#### The *golgi:hook gx* Attribute

You add a hook to a Component by adding the special attribute *golgi:hook* to the Component's *gx* tag.
You must provide a name for the method (this allows you to have multiple instances of a Component
within your Assembly, each with a different hook method if you wish).

So change the *gx* of your example Assembly as follows, adding a hook to the inner instance
of the *demo-div* tag:

      let gx=`
      <demo-div text="Welcome to Golgi Assemblies">
        <demo-div text="I'm inside the other div!" golgi:hook="addHandler" />
      </demo-div>
      `;

<br/>
<div align="right">
  <b><a href="#specifying-a-hook">Go Up</a></b>
</div>
<br/>

#### The *hooks* Object

We now need to define the actual *addHandler* hook method.  We do that by adding an object
named *hooks* within your Assembly's *load()* function.  The *hooks* object should
follow the pattern below:


      let hooks = {
        {{gx tag name}}: {

          {{hook name}}: function() {

            // define the hook logic here

          }
        }
      }

Note that provided you use the syntax above, specifically defining the function usng
*function() {....}*, then the *this* context within the Hook method will be the
instance of the Web Component within the specified *Golgi Component*.

You can define as many hook methods with an Assembly as you like, one for every
*gx* tag if you want!  Simply ensure that the object names in the *hooks* object
match up with the tag names and *golgi:hook" values used in the *gx* tags.

Having added the *hooks* object, you **must** add it to the exports from the Assembly's
*load* function.  This is the most common mistake I make and then I wonder why my 
hooks aren't working!

      return {gx, hooks};

<br/>
<div align="right">
  <b><a href="#specifying-a-hook">Go Up</a></b>
</div>
<br/>

### Add A Hook To Our Example Assembly

So, let's now add our *addHandler()* Hook to our Assembly:

      let hooks = {
        'demo-div': {
          addHandler: function() {

            // note that "this" refers to the specific instance of
            // the owner WebComponent when the Hook is invoked

            const fn = () => {
              this.spanTag.textContent = 'You moused over at ' + Date.now();
            };
            this.addHandler(fn, this.spanTag, 'mouseover');
          }
        }
      };

      return {gx, hooks};

You'll notice that we're using a special method - *this.addHandler()* - that *Golgi* has
automatically added to the WebComponent for you during rendering.  The *addHandler()*
method adds the DOM EventListener, but also registers the handler within *Golgi*, and,
in doing so, it ensures that if this Component is destroyed using *this.remove()*, then
the handler will also be removed from memory.  

You should **always** use *this.addHandler()* when dynamically adding event listeners to any
*Golgi Components*.

*this.addHandler()* takes up to 3 arguments:

- the function to be executed when the handler is triggered
- the DOM element to which the listener should be attached
- the event to be listened for.  If not specified, *click* is assumed.

<br/>
<div align="right">
  <b><a href="#adding-hooks-to-golgi-components-within-assemblies">Go Up</a></b>
</div>
<br/>

### Try It Out!

Now all you need to do is try reloading your *index.html* page in your browser.  Whenever you 
run your mouse pointer over the second line of text, you should find that it changes.  However, 
the outer instance of the *demo-div* Component, which is showing the first line of text, won't
be affected by a *mouseover* event.  Both instances still respond to a *click* event, because this
is defined in the underlying WebComponent used by each instance.

<br/>
<div align="right">
  <b><a href="#adding-hooks-to-golgi-components-within-assemblies">Go Up</a></b>
</div>
<br/>

## Customising How *Golgi Component*s Are Appended to their Parent Component

As you've seen earlier, by default, child Components are appended to the *rootElement* of
their parent Component.

This is because:

- by default, a child *Golgi Component* is appended to the element denoted by its parent
component's *childrenTarget* property

- unless told otherwise, *Golgi* assigns a Component's root element to its *childrenTarget*
property.

You have control over both of these factors.

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

### Re-assigning the *childrenTarget* Property

You've seen previously how you can assign a property name to an element within a *Golgi Component*
by adding the special *golgi:prop* attribute to it.  For example, in our *demo-div* component
we assigned its *span* tag to its *spanTag* property:

      const html = `
      <div>
        <span golgi:prop="spanTag">Click Me!</span>
      </div>
      `;

Let's amend the *demo-div* Component definition as follows:

     const html = `
      <div>
        <span golgi:prop="spanTag" golgi:on_click="report">Click Me!</span>
        <pre>+++++++++</pre>
        <div class="test" golgi:prop="childrenTarget"></div>
        <pre>---------</pre>
      </div>
      `;

and try reloading the *index.html* page in your browser.  You'll see that it now looks
a little different.  Take a look at the DOM using the browser's Developer Tools *Elements* tab,
and you'll see that it now looks like this:

      <body>
        <demo-div>
          <div>
            <span>Welcome To Golgi Assemblies</span>
            <pre>+++++++++</pre>
            <div class="test">

              <demo-div>
                <div>
                  <span>I'm inside the other div!</span>
                  <pre>+++++++++</pre>
                  <div class="test"></div>
                  <pre>---------</pre>
                </div>
              </demo-div>

            </div>
            <pre>---------</pre>
          </div>
        </demo-div>
      </body>

So, simply by specifying:

      golgi:prop="childrenTarget"

within one of the HTML elements in a *Golgi Component* reassigns it as the target element to
which child Components will be automatically appended.

<br/>
<div align="right">
  <b><a href="#customising-how-golgi-components-are-appended-to-their-parent-component">Go Up</a></b>
</div>
<br/>

### Multiple Parent Append Target Elements

Sometimes you might want to define more than one element in a parent Component as target elements
for child Components to be appended to.  For example, you might design a UI Component 
named *my-card* that
defines within it an empty head, body and footer section.  It would be nice to be able to do the following with such a Component:

      <my-card>
        <my-card-header-content />
        <my-card-body-content />
        <my-card-footer-content />      
      </my-card>

but how would *Golgi* know not to simply append all three child components to the *my-card* Component's *childrenTarget* element?

It's actually a very simple two-step process:

- within the parent Component, *my-card* in the example above, specify property names to the
three elements that need to act as the header, body and footer targets, eg:

      ...
      <div class="header" golgi:prop="headerTarget" />
      ....
      <div class="body" golgi:prop="bodyTarget" />
      ...
      <div class="footer" golgi:prop="footerTarget" />
      ...

- in each of the child Component *gx* tags, add the special *golgi:appendTo* property, with
its name specifying the relevant parent property name, eg:


      <my-card>
        <my-card-header-content golgi:appendTo="headerTarget" />
        <my-card-body-content golgi:appendTo="bodyTarget" />
        <my-card-footer-content golgi:appendTo="footerTarget" />      
      </my-card>


Let's try something similar with our *demo-div* example.  

Edit its HTML definition to the following:

     const html = `
      <div>
        <span golgi:prop="spanTag" golgi:on_click="report">Click Me!</span>
        <pre>+++++++++</pre>
        <div class="test" golgi:prop="testTarget"></div>
        <pre>---------</pre>
      </div>
      `;

And now change the *gx* tags within the *demo_assembly* to this:

      let gx=`
      <demo-div text="Welcome to Golgi Assemblies" >
        <demo-div text="I'm attached to the parent's root element" golgi:hook="addHandler" />
        <demo-div text="I'm attached to the parent's testTarget" golgi:appendTo="testTarget" />
      </demo-div>
      `;

Then reload the *index.html* page in your browser and confirm that it worked by examining
the DOM using the browser's Developer Tools *Elements* tab.  Note how we used the
default *childrenTarget* property in the parent for the first child *demo-div* *gx* tag.

<br/>
<div align="right">
  <b><a href="#customising-how-golgi-components-are-appended-to-their-parent-component">Go Up</a></b>
</div>
<br/>


## Using *Golgi Assemblies* within *gx*

So far we've seen how the *gx* within a *Golgi Assembly* defines the set of *Golgi Components*
that we want to put together.

You've probably been wondering, is it possible to refer to another *Golgi Assembly* within
*gx*?

The answer is yes.  You can specify an Assembly in *gx* by prefixing its name with *assembly:*, eg:

      <demo-div>
        <assembly:my_assembly />
      </demo-div>

This tells *Golgi* to load and render an Assembly module named *my_assembly.js* and append
it to the *childrenTarget* element of its parent *demo-div* Component.

Essentially the usual *gx* features apply, eg:

- you can specify the parent target element to which to append the Assembly by using the 
*gx* *golgi:appendTo* attribute.  By default it will be appended to the parent Component's
*childrenTarget* element.

- you can specify a *Hook* method by using the *gx* *golgi:hook* attribute.  The *Hook* method
is invoked immediately after the Assembly has completed loading and being appended to its
parent element. 

  **Note:** unlike a Component, *this* within an Assembly Hook method refers to the 
*Golgi* object itself, not an individual WebComponent.  Nevertheless, you still have access
to the same methods as you would have within a Component.

**Note 1:** A *gx assembly:* tag cannot have child tags.

**Note 2:** One thing to be careful of - make sure you don't try to load an Assembly that
also tries to load another instance of itself.  You'll put *Golgi* into an infinite loop if you do!

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>


## Using ordinary HTML tags within *gx*

Normal HTML markup tags can be used within a *Golgi Assembly*'s *gx*.

You can even use the *golgi-appendTo* and *golgi-hook* attributes, and the
HTML tag can include *gx* *Golgi Components* or *Assemblies* as child *gx* tags!

Here's an example:

      let gx=`
      <demo-div text="Welcome to Golgi Assemblies" golgi:stateMap="message:text" >
        <demo-div text="I'm inside the parent root element" />

        <div class="testing" golgi:appendTo="testTarget" golgi:hook="divhook">
          <demo-div text="demo-div within html div!" />
        </div>

        <demo-div text="I'm inside the parent testTarget" golgi:appendTo="testTarget" />
      </demo-div>
      `;

      let hooks = {
        div: {
          divhook: function() {
           // do something when div tag has loaded and attached!
          }
        }
      }

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

## Hoisting Classes to the Top-Level Component Element

When using a UI Library such as Bootstrap 5 with *Golgi*, you will sometimes need to
specify a particular class or group of classes within the actual Component's outer
tag.  By default, when you define the HTML for a *Golgi Component*, you're actually
defining the associated WebComponent's *innerHTML* which is appended to the WebComponent's
element tag.

In many/most circumstances it won't matter if you apply the required class(es) to the
*rootElement* of the WebComponent's *innerHTML*, but if the styling gets confused, you'll
need to hoist the class(es) to the WebComponent's own element tag.

For example, suppose we needed to define a particular class in a *Golgi Component*
(*sbadmin-sidebar-menu*) that defined a Bootstrap 5 sidebar menu as follows:

      const html = `
      <div class="sb-sidenav-menu">
        <div class="nav" golgi:prop="childrenTarget" />
      </div>
      `;

If we find that the styling inside this menu doesn't work properly, it's probably because that
*sb-sidenav-menu* class needs to be on the &lt;sbadmin-sidebar-menu&gt; tag rather than the
&lt;div&gt; tag of its *innerHTML*.

Now we could easily fix that programmatically within the Component's *onBeforeState()* lifecycle
method, but you can instead do it declaratively within the HTML as follows:


      const html = `
      <div golgi:component-class="sb-sidenav-menu">
        <div class="nav" golgi:prop="childrenTarget" />
      </div>
      `;

The special *golgi:component-class* attribute allows you to tell *Golgi* to hoist the class value
up to the &lt;sbadmin-sidebar-menu&gt; tag, resulting in this Component being added to the DOM as:

      <sbadmin-sidebar-menu class="sb-sidenav-menu">
        <div>
          <div class="nav"></div>
        </div>
      </sbadmin-sidebar-menu>

Now the styling issues should disappear!

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

## Dynamically Loading JavaScript and CSS Resources

Although many JavaScript UI frameworks are beginning to provide their JavaScript files
as ES6 modules, many are still only available to a browser by loading them using a
&lt;script&gt; tag within the HTML page.

Similarly, when using *Golgi* with another UI framework, you'll need to load its CSS stylesheets
by using a &lt;link&gt; tag within the HTML page's *head* section.

Although you could add these &lt;script&gt; and &lt;link&gt; tags to the *index.html* file that
you use to start your *Golgi* application, *Golgi* makes it easy for you to load such resources
dynamically from within a *Golgi Assembly*'s *gx*.

"Why would you want to do this?", you might ask.  

There are several reasons:

- keeping the *index.html* pared down to the bare minimum, with no application dependency needed

- keeping any resource dependencies defined within the associated *Golgi Assemblies* that use them.
This is extremely useful from a maintenance perspective.

- you might need a specialised UI library, eg a charting library such as 
[Chart.js](https://www.chartjs.org/), but not until the user clicks a link to generate a chart.  If
that was a relatively rare occurrence within the application, pre-loading the Chart.js Javascript
file would be a waste of time for most users.

*Golgi* therefore allows you to dynamically load any resources on a "just in time* basis by adding
&lt;script&gt; and &lt;css&gt; tags as child *gx* tags of a parent Component *gx* tag.

For example:

      <chart-root>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" await="true" />

        <chart-area-plot golgi:hook="draw" golgi:stateMap="chart:update"/>
      </chart-root>

This tells *Golgi* to dynamically load the *Chart.js* JavaScript file from a CDN source
immediately before importing and rendering the *chart-root* *Golgi Component* module.

The *gx script* tag attribute *await="true" forces the importing and rendering of the
*chart-root* Component to await the completion of the loading of the JavaScript file.

Dynamic loading of such JavaScript files is actually performed by *Golgi* adding a 
*script* tag to the DOM.


Here's another example, dynamically loading resources needed for a Bootstrap 5 application:

      let gx=`
      <sbadmin-root golgi:hook="loadContent">

        <script src="/golgi/components/sbadmin/js/fontawesome-5.15.3.all.min.js" />
        <script src="/golgi/components/sbadmin/js/bootstrap.bundle.min.js" await="true" />
        <css src="/golgi/components/sbadmin/css/styles.css" />

        ... etc
 
      </sbadmin-root>
  `;

In this example, two JavaScript files and one CSS file are loaded before the *sbadmin-root*
Component is imported and loaded.  Notice that *Golgi* will wait until the Bootstrap 5
JavaScript file is fully loaded and ready, but it doesn't need to wait for the
fontawesome JavaScript.

Similarly, *Golgi* doesn't need to await the completion of the CSS file loading.

Whether or not your Components need to wait for the JavaScript and CSS resources to complete
loading will vary depending on the UI library you use.  The important thing is that *Golgi*
provides you with the mechanism to await or not before proceeding with its Component rendering.

**Note:** Both the *gx* *script* and *css* tags allow you to also specify the attribute
*crossorigin="anonymous* which, if added, adds this to the actual *script* tag that is added
to the DOM.

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

## Dynamically Adding Meta Tags to the DOM

Responsive, mobile-first UI libraries such as Bootstrap 5 require you to add a number
of &lt;meta&gt; tags to your HTML page.

As discussed above for JavaScript and Stylesheet resource loading, you can, of course,
add these to the *index.html* file that you use to launch your *Golgi* application.

However, to keep any application dependencies localised to your *Golgi Assemblies",
*Golgi* also allows these &lt;meta&gt; tags to be added to the DOM dynamically from within
an Assembly's *gx*.

Simply add the required &lt;meta&gt; tags as child *gx* tags of your application's
top-level Assembly's *gx*.  For example:

      <sbadmin-root>
        <script src="/golgi/components/sbadmin/js/fontawesome-5.15.3.all.min.js" />
        <script src="/golgi/components/sbadmin/js/bootstrap.bundle.min.js" await="true" />
        <css src="/golgi/components/sbadmin/css/styles.css" />

        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        ... etc

      </sbadmin-root>

The corresponding &lt;meta&gt; tags will be added dynamically to the DOM by *Golgi* before the
parent Component is imported and rendered.

<br/>
<div align="right">
  <b><a href="#golgi-assemblies">Go Up</a></b>
</div>
<br/>

----

# *Golgi Component* Lifecycle Methods

*Golgi* provides a number of lifecycle methods that you can specify within the WebComponent
definition of a *Golgi Component*.  In lifecycle sequence they are:

- *onBeforeState() {...}*

  This is invoked immediately after the *Golgi* Component is loaded into the DOM, and before
any state values (as specified as *gx* attributes) are applied.

  This is a useful lifecycle method to use for additional custom augmentation of the
Component's WebComponent's methods and/or properties.

- *onBeforeHooks() {...}*

  This is invoked after any state values (as specified as *gx* attributes) are applied to
the WebComponent, but before the Component's Hook Method (if defined) is invoked


- *onAfterHooks() {...}*

  This is invoked after the Component's Hook Method (if defined) is invoked.  This is the last
lifecycle method to fire before *Golgi* moves on to process the next *gx* tag.

- *onChildComponentReady(childComponent) {...}*

  This is invoked if the Component, when rendered as part of an Assembly, has one or more
child Components.  If so, each Child Component will trigger a call to its parent Component's
*onChildComponentReady()* method (if present).  The instance of the Child Component is passed
to this method as its argument.

  This method is useful in situations where the parent Component's methods need later access
to its Child Component's properties or methods.


Note that any or all of these lifecycle methods can be specified as *async* if required.


**Note:** If you have augmented the WebComponent with anything else that *Golgi* is unaware of, and that
should be explicitly destroyed if the Component is removed, you should use the standard
WebComponent *disconnectedCallback()* lifecycle method.

<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

----

# *Golgi* Properties for Navigation between *Golgi Components*

During Component rendering, *Golgi* adds a number of useful properties to Components and Elements
within Components.  These allow you to quickly and efficiently navigate between your rendered
Components:

- *this.rootComponent*

  The value of this property, assigned to every *Golgi Component*, is your application's
*root Component*, ie the first one you render within your application root module, and
which you will have appended to the DOM's *body* tag.

- *this.parentComponent*

  Every Component, except the *root Component* has this property whose value is the
Component to which it has been appended

- *this.ownerComponent*

  Every HTML Element within a Component is given this property whose value is the
Component containing the Element


<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

# *Golgi* Methods For Use Within *Golgi Components* and *Hook* Methods


The WebComponents that underpin your *Golgi Components* are automatically augmented
with a number of methods that allow you to manipulate and navigate about within your
rendered Components in the DOM.  They are all accessed as *this.{{methodName}}*.

- *this.addHandler(fn [, targetElement] [, eventName])*

  This method should always be used to dynamically add event handlers to your Components, because
the *remove()* method will automatically destroy the handler methods if the Component is
removed (either directly or via a removed parent Component).

  The handler function should always be specified

  If the second argument (*targetElement) is not specified, the handler will be added
to the Component's *rootElement*.

  If the third argument (*eventName*) is not specified, a 'click' event is assumed.

- *this.getComponentByName(componentName [, name_property_value] [, parentElement])*

  This method is used to find and return one or more Components matching the
specified name.  What it returns will depend on the arguments you specify:

  - if you just specify the first argument (*componentName), then a NodeList of
all Components in the DOM with the specified *tagName* is returned.

  - if you specify a second argument (*name_property_value*), then it will return
the first Component it finds whose *name* property matches the specified value.  For this
to work you must make sure that such Components include a *setState()* condition to allow
the *name* property to be set.

  - if you specify a third argument (*parentElement), the search for matching Components
is limited to descendant nodes of the specified parent Element.


- *this.getParentComponent(componentName)*

  This method recurses up through the DOM, starting from the current Component, until it finds an
element whose *tagName* matches the specified Component Name.  It then returns that Component Element.
Note that this method also automatically caters for Components that use ShadowDOM.

- *this.remove()*

  Removes the current Component and all of its child Components.  This method also removes any
handlers that were added to the removed Components, provided those handlers were added using the
*this.addHandler()* method

- *this.renderAssembly(assembly_name, append_target_element, context)*

  This method will import and load the specified *Golgi Assembly* and, when ready, will append it to the
specified target Element (*append_target_element*).  The *Golgi* Context object, available
within the current Component as *this.context*, should also be specified as the third argument).

- *this.renderComponent(component_name, append_target_element, context)*

  This method will import and load the specified *Golgi Component* and, when ready, will append it to the
specified target Element (*append_target_element*).  The *Golgi* Context object, available
within the current Component as *this.context*, should also be specified as the third argument).

- *this.addStateMap(state_property_name)*

  This method is described in detail in the next section. It is used to add a
data-binding state map to the component.  Note that the *state_property_name* value
should be unique to the specific instance of the Component.

<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

----

# State Management and Data Binding In *Golgi*

<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

## Defining A State Map in an Assembly

*Golgi* provides a powerful means of state management and data binding which is deceptively
simple to use.  The *Golgi* Object includes a property named *golgi_state* which is actually a 
Proxy Object that traps any changes you make to it.

Within a *gx* tag in an Assembly, you can define a *State Map* that maps a *golgi_state*
object property name to a *setState()* property within the Component.  You do this by using
a special *gx* attribute named *golgi:stateMap*.  Its value has two parts, separated by a colon:

- the *golgi_state* object property name to trap.  This can use dot syntax to specify lower sub-levels within the *state* object. 
- the target Component's method or *setState* property to which to map the state value

For example:

      <demo-div text="Welcome to Golgi Assemblies" golgi:stateMap="message:text">


Having specified this, and once this *Golgi Component* has been rendered and is ready for use,
you can then do the following anywhere else in a component's methods, for example in a *hook* method:

      this.golgi_state.message = 'Hello World';

Note that *this.golgi_state* is how you access the state object from within a *Golgi Component*.

What will happen is that the instance of the Component to which we applied the *stateMap* will
invoke:

- a WebComponent method named *text* if it is defined:

      component.text('Hello World');

- if not, the WebComponent's *setState()* method for the property named *text* as follows:

      component.setState({text: 'Hello World'});


In our example *demo-div* Component, this, of course, updates the Component's *span* text content.

          setState(state) {
            if (state.text) {
              this.spanTag.textContent = state.text;
            }
          }

Of course, when defining a *Golgi Component*'s setState() method logic, we could define all sorts of
different state properties with all manner of actions, so you can assign a stateMap to as complex
logic as you wish.  For example, mapping an array of data points to an *update* state property could
cause a graph to be plotted, simply by setting the data points array in the *Golgi* state object.

Let's try this out in your example.  First change the outer *gx* tag in your Assembly to:

      <demo-div text="Welcome to Golgi Assemblies" golgi:stateMap="message:text">

and now modify the hook method we defined for the inner *gx* tag:


      let hooks = {
        'demo-div': {
          addHandler: function() {
            const fn = () => {
              this.spanTag.textContent = 'You moused over at ' + Date.now();

              // add this line:

              this.golgi_state.message = 'I also noticed that at ' + Date.now();

            };
            this.addHandler(fn, this.spanTag, 'mouseover');
          }
        }
      };

Reload the *index.html* page in the browser, and now try running your mouse pointer over the
second line of text.  As if by magic, the top line will also now change!  This will happen
every time you mouse over the second line of text.

<br/>
<div align="right">
  <b><a href="#state-management-and-data-binding-in-golgi">Go Up</a></b>
</div>
<br/>

## Defining Data Binding Within A Component

Rather than having to define lots of methods within a Component, each of which controls the
state of DOM elements within your WebComponent, *Golgi* provides a further, declarative
approach which allows you to define the specific data binding used in the Component's state map.

First, you can specify the state map that the Component should use with the *addStateMap()*
method.  You'd usually define this in the Component's *onBeforeState()* lifecycle method, eg:

      onBeforeState() {
        this.addStateMap('article');
      }

If you did this, and then, at some later point, assigned an object to this state property, eg:

      this.golgi_state.article = {
        author: 'Rob',
        title: 'My Great Article',
        description: 'An amazing piece of work!',
        image: 'https://static.productionready.io/images/smiley-cyrus.jpg'
      };

... you can declaratively specify how and where to bind those three properties (author, title
and description) within the Component's HTML assignment by using the special keyword
*golgi:bind={{property_name}}*, eg:

      let html = `
      <div class="article-page">
        <div class="banner">
          <div class="container">
            <h1>golgi:bind=title</h1>
            <div>
              <h2>Author</h2>
              <img src="golgi:bind=image" />
              <span class="follow-author">golgi:bind=author</span>
            </div>
            <div>
              <h2>Description</h2>
              <span class="desc">golgi:bind=description</span>
            </div>
          </div>
        </div>
      </div>
      `;

You can see that you can apply the *golgi-bind* keyword as either an attribute value or
as a tag's text content.

You can even apply it to an &lt;input&gt; or &lt;textarea&gt; field by specifying it as 
a *value* attribute, eg:

              <fieldset class="form-group">
                <input golgi:prop="image" value="golgi:bind=image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>


The result is that whenever the appropriate *golgi_state* property is set, if its value is
an object, then the object's properties are automatically set to the corresponding DOM element
attributes or text content, as defined with the *golgi:bind* keyword.

In the case of an &lt;input&gt; or &lt;textarea&gt; field, its *value* property is assigned
the value, making it appear in the form.


You'll see examples of this use of *golgi:bind* within the examples provided in this
repository.


- **Note:** If you have multiple instances of a Component within your application at any time,
and if you have used the *golgi:bind* keyword within it, then you need to ensure that each
Component instance uses its own unique *golgi_state* property.

  Here's how you could achieve this:

  - within the Component's *onBeforeState()* lifecycle method, assign a unique name to the
instance, and then use that as the state map name, eg:

          onBeforeState() {
            this.stateMapName = 'acticle-' + this.name;
            this.addStateMap(this.stateMapName);
          }


  - then when it comes to mapping/binding state values:

          this.golgi_state[specificComponent.stateMapName] = {
            author: 'Rob',
            title: 'My Great Article',
            description: 'An amazing piece of work!',
            image: 'https://static.productionready.io/images/smiley-cyrus.jpg'
          }

    where *specificComponent* is the instance of the Component you want to upate with these
values.

<br/>
<div align="right">
  <b><a href="#state-management-and-data-binding-in-golgi">Go Up</a></b>
</div>
<br/>


## Rendering Multiple Copies of a Component Mapped to a State Array

Suppose you want to render error messages returned from a back-end system, and the layout/presentation
of each error message is defined in a *Golgi Component*.

Alternatively, imaging the back-end returns an array of results, each element in the array
being an object whose key/value pairs represent columns in a table row that you want to display.
The layout/presentation of each row might be defined in a *Golgi Component*.

Essentially, therefore, in both example scenarios, for each member of the
data array, you want to do two things:

- render an instance of a *Golgi Component* that will display the array member

- map the data in the array member's key/value pairs to fields defined in the *Golgi Component*
using the *golgi:bind* keyword.

*Golgi* makes this very simple, and you can see examples of its use in the *RealWorld Conduit UI*
example that is included in this repository.

Within any Component, you have access to the *Golgi*-provided method: *this.renderComponentMap()*

It has the following arguments:


- *componentName*: the name of the *Golgi Component* to be rendered for each data array member
- *targetElement*: the DOM element to which each instance of the Component is to be appended
- *context*: the *Golgi* Content object (accessible as *this.context* within all Components)
- *dataArray*: the array containing the data you want to map to each Component Instance
- *stateMapPropertyName*: the name of the *this.golgi_state* property to be used for data binding.
- *callback*: an optional callback function that is invoked after each Component is rendered and
after databinding has occurred.  The callback function has two arguments:

  - *component*: the instance of the Component that has been rendered and populated
  - *dataArrayRow*: the data array member that has been used to populate the instance of the Component

You'll see numerous examples of this method in use 
[within this example Component](./examples/conduit/components/conduit/conduit-root.js).

<br/>
<div align="right">
  <b><a href="#state-management-and-data-binding-in-golgi">Go Up</a></b>
</div>
<br/>

----

# Automatically Detecting DOM Changes in *Golgi Components*

<br/>
<div align="right">
  <b><a href="#index">back to top</a></b>
</div>
<br/>

## Detecting Changes the Hard Way

Deep within your application you might have a *Golgi Component* that displays some text that you might want to change programmatically.  Of course, to make the actual text change you can use the data binding provinded by 
[*Golgi's* StateMap mechanism](#state-management-and-data-binding-in-golgi).

Suppose, however, that whenever the text changes, you want to invoke a method within the Component, causes other
things to happen.  Some HTML tags, for example *input*, allow you to add a *change* EventListener, so for these, within
the Component's HTML definition you could do something like this:

        <input golgi:prop="myInput" golgi:on_change="doSomething" />

and you could then define a method within the Component:

        doSomething() {
          // do something because this.myInput.value has changed
        }

However, if the HTML tag was a simple *div* tag, this wouldn't work.  You could, instead, define a
MutationObserver for the *div* tag and trap any events associated with any Mutation *childList* types.

You don't need to do this, however, since *Golgi* already automates much of the MutationObserver logic for you within your Components.

<br/>
<div align="right">
  <b><a href="#automatically-detecting-dom-changes-in-golgi-components">Go Up</a></b>
</div>
<br/>

## Activating a MutationObserver within a *Golgi Component*

To activate a MutationOBserver, invoke *this.observerStart()* in one of the Component's lifeCycle event handers such as *onBeforeState*, eg:

        onBeforeState() {
         this.observerStart();
        }

*observerStart()* will detect all the standard mutation types, ie what *Golgi* actually runs for you (for each HTML tag within your component) is:

      golgi.observer.observe(target, {
        attributes: true, 
        attributeOldValue: true, 
        characterData: true, 
        characterDataOldValue: true,
        childList: true, 
        subtree: true
      });


<br/>
<div align="right">
  <b><a href="#automatically-detecting-dom-changes-in-golgi-components">Go Up</a></b>
</div>
<br/>

## Handling Mutation Events

When *this.observerStart()* is invoked, any DOM changes within any of the Component's HTML tags will trigger the Component's *observerCallback()* method (if it is defined).  This callback is triggered for each and every DOM change.  What you do in this callback method is up to you, eg:

        observerCallback(mutation) {
          // do something as a result of this specific mutation object
        }

The *mutation* argument for the *observerCallback()* is a standard MutationObserver object representing a specific mutation, so it has all the standard properties you'd expect, eg:

        mutation.type: the type of mutation
        mutation.target: the DOM element that has mutated


<br/>
<div align="right">
  <b><a href="#automatically-detecting-dom-changes-in-golgi-components">Go Up</a></b>
</div>
<br/>

## Simple Example

To detect all changes to the text within a *div* tag in your Component:

- define the *div* tag within the Component's HTML definition, eg:

        <div golgi:prop="myText">golgi:bind=theText</div>


- start the Mutation Observer and also define the state map for data binding within the component:

        onBeforeState() {
          this.observerStart();
          this.addStateMap('myExample');
        }

- define the *observerCallback()* method:

        observerCallback(mutation) {
          // any text change will trigger a childList mutation...

          if (mutation.type === 'childList') {

            // When using Golgi's data binding, the mutation will have
            // actually occurred on a span tag that is added to the div
            // as a child tag

            // So we can determine that the mutation has occurred to
            // the myText div as follows:

            if (mutation.target.parentNode === this.myText) {
              this.doSomething();
            }
          }
        }


- define the *doSomething()* method:

        doSomething() {
          console.log('The text was changed to ' + this.myText.textContent);
        }


- now the *div*'s text can be changed from anywhere within your application logic by simply setting the state map object:

        this.golgi_state.myExample = {
          theText: 'A new value for the div'
        }


  and as a result, the *doSomething()* method will also fire within the Component.

<br/>
<div align="right">
  <b><a href="#automatically-detecting-dom-changes-in-golgi-components">Go Up</a></b>
</div>
<br/>

