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
    - [The Golgi Root Application Module](#the-golgi-root-application-module)
      - [Loading The *Golgi* Module](#loading-the-golgi-module)
      - [Defining the *Golgi Component* and *Assembly* Paths](#defining-the-golgi-component-and-assembly-paths)
      - [Rendering the *demo-div Golgi Component*](#rendering-the-demo-div-golgi-component)
    - [The *demo-div Golgi Component*](#the-demo-div-golgi-component)
      - [The *Golgi Component* Pattern](#the-golgi-component-pattern)
      - [How Your Golgi Component Is Loaded and Rendered](#how-your-golgi-component-is-loaded-and-rendered)
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
      - [The DOM After the Child *gx* Tag is Rendered](the-dom-after-the-child-gx-tag-is-rendered)
  - [Try Out the *demo-div* Component Click Handler](#try-out-the-demo-div-component-click-handler)
  - [Adding *Hooks* To *Golgi COmponents* Within Assemblies](#adding-hooks-to-golgi-components-within-assemblies)
    - [What Are Hooks?](#what-are-hooks)
    - [An Example Use Case for Hooks](#an-example-use-case-for-hooks)
    - [Specifying a Hook](#specifying-a-hook)
      - [The *golgi:hook gx* Attribute](#the-golgihook-gx-attribute)
      - [The *hooks* Object](#the-hooks-object)
    - [Add A Hook To Our Example Assembly](#add-a-hook-to-our-example-assembly)
    - [Try It Out!](#try-it-out)

# First Steps 

You'll need access to a web server and its file system.  Any Web Server on any platform will do.

Create a directory that is accessible by the web server, eg */golgi*.

Then create a sub-directory within it named *components*, ie */golgi/components*.

# Golgi Components

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

      const {golgi} = await import('https://cdn.jsdelivr.net/gh/robtweed/golgi/src/golgi.min.js');
      
      let context = {
        componentPaths: {
          demo: window.location.origin + '/golgi/components/'
        }
      };
      
      golgi.renderComponent('demo-div', 'body', context);


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


## Run The Demo

Now, load the index file into a browser.  Note that it must be a modern browser that
supports WebComponents, eg:

      http://localhost:3000/golgi

or

      http://localhost:3000/golgi/index.html


If see the text below appearing in your browser:

      This is Golgi!

then *Gogli* is working for you and you're ready to explore it in more detail.


## How Did It Work?

Clearly this is a really unremarkable demonstration of *Golgi*'s abilities: all we've done is
display a *div* tag in your browser!  However, if we now analyse what happened and what we
specified in those three files, you'll begin to get an initial idea of how the most basic of *Golgi's*
building blocks - *Golgi Components* - are defined and used.

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


### The Golgi Root Application Module

The *demo.js* Module is an extremely simple example of a *Golgi* main or root application module.

Your root application module is where you define the main shape and starting point of your
UI and its application logic.  It must be defined as an ES6 Module using the following pattern

- load the Golgi Module
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
- the target element within your HTML page to which it will be appended.  We want to append it
to the *body* tag, so instead of specifying it in full, ie:

      golgi.renderComponent('demo-div', document.getElementsByTagName('body')[0], context);

  ... and because the *body* tag is a very common one to use as a target, the *renderComponent()*
method allows you to simply specify it as the *string* value *'body'*.

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


### The *demo-div Golgi Component*

So now we need to examine the last of our files (*demo-div.js*), which contains the 
definition of the *demo-div Golgi Component*.

#### The *Golgi Component* Pattern

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

            // assign a default name property to the WebComponent

            this.name = componentName + '-' + count;
          }

      });


So, in summary, this will create a WebComponent named *demo-div* that represents a simple
*div* tag with some pre-defined text.

#### How Your Golgi Component Is Loaded and Rendered

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

### Using *Golgi*'s Log

A further means of seeing and checking what *Golgi* is doing is to enable its log (by 
default it is disabled).  When enabled, *Golgi* reports various key steps to the browser's
console.  During development and debugging, it's a good idea to turn *Golgi*'s logging on.

To turn logging on, add this line to your root application module:

      golgi.setLog(true);

To inspect its log, use the *Console* tab in the browser's Developer Tools panel.


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
named *rootElement*.  In our example, that's the *div* tag.

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
tag, we'll now be able to reference and access that *span* tag as *this.spanTag*.

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


## Adding Handlers to *Golgi Components*

Something you'll often want to do is to add handlers to tags within a *Golgi Component*.  Sometimes
you'll want to do that when its WebComponent is being instantiated so that the handler(s) is/are
always present.

Once again, Golgi makes this very simple.  Let's add an *onClick* handler to our *demo-div* Component.

Edit the */golgi/components/demo-div.js* file once more, and add the following method to its
WebComponent:

      onBeforeState() {
        const fn = () => {
          this.setState({text: 'You clicked the div at ' + Date.now()});
        };
        this.addHandler(fn);
      }

Save the file and reload the *index.html* file in the browser, and now whenever you click
the text, you'll see it updating the *span* tag's text content.

Let's examine why this happened.

Whilst WebComponents provide built-in lifecycle methods (eg *connectedCallback* and 
*disconnectedCallback*), *Golgi* augments the WebComponent with several more, one of which is
*onBeforeState()*.

As its name implies, the *onBeforeState()* lifecycle method is invoked by *Golgi* before 
applying any state changes (the latter
being something that will begin to make sense when we later look at *Golgi Assemblies*).  
For now, consider it as a
good lifecycle method to use for situations where you want to add custom configurations to the
WebComponent, immediately after *Golgi* has activated and appended it to the DOM and before anything
else happens.

You'll also see that we're making use of a method - *addHandler* - that *Golgi* automatically adds
to every WebComponent.  For now, assume that it's a handy shortcut for the *addEventListener()* DOM
method, but, as you'll see later, there's a good reason for using *this.addHandler()* in preference to
the underlying raw DOM method.

By default, *addHandler()* assumes that you want to add an *onClick* handler which is probably what
you'll want in the majority of cases.  If you want a diffeent handler, eg *mouseover*, then you can
specify it as a second argument, eg:

      this.addHandler(fn, 'mouseover');

Also by default, *addHandler()* assumes you want the handler to be applied to the WebComponent as
a whole.  In a complex WebComponent consisting of a lot of HTML tags, you may want to be more
specific and apply it to a particular tag within the component.  If so, specify the target element 
as the second argument, eg to apply our 'click' handler specifically to the *span* tag in our
WebComponent, we could specify:

      this.addHandler(fn, this.spanTag);

and if we needed it to use a different event:

      this.addHandler(fn, this.spantag, 'mouseover');


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

Let's deal with these in reverse sequence.  As you saw in the previous example, we used *Golgi*'s
*addHandler()* method rather than the raw *addEventListener()* DOM method.  The *addHandler()* method
registers the handler in a Map that is maintained within the WebComponent.

Dealing with the first issue, by using *Golgi*'s *remove()* method, it will recurse down through any
lower-level nested *Golgi Component*s, starting at the lowest-level leaf Components, first removing 
any registered handlers and then deleting the WebComponent before moving up to its parent and repeating the
process.  The *remove()* method, together with the *addHandler()* method, therefore ensure that memory leaks
are avoided when deleting a *Golgi Component*.
 
So, let's put all these together into our example.

Edit your root Module (*/golgi/demo.js*), and add a *setTimeout* function that 
will remove the *demo-div* Component from the DOM after 5 seconds:

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

Now reload the *index.html* page.  After 5 seconds, the text will disappear, and if you examine
the DOM using the browser's Developer Tools *elements* tab, you'll see confirmation that the
*&lt;demo-div&gt;* tag no longer exists.

Try it again, and this time watch the *Golgi* log being reported to the browser's *Console*.

You'll see it reporting the removal of the *demo-div* element and its *click* handler.

----

# *Golgi Assemblies*

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


## Create A Simple Example

### Create An Assemblies Directory

Let's create a simple *Golgi Assembly* using the *demo-div* *Golgi Component* we created earlier.

First, it's a good idea to create a separate directory for your *Golgi Assemblies*. So, on your
web server, create a subdirectory beneath the */golgi* directory you created earlier, and name it
*assemblies*, ie you should now have a directory:

      /golgi/assemblies

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

### Edit The Root Application Module

Next, edit your root application module (ie */golgi/demo.js*) to render this assembly rather than the
single *Golgi Component* we've been using so far:

      const {golgi} = await import('./golgi.min.js');
      let context = {
        componentPaths: {
          demo: './components/'
        },
        assemblies: './assemblies'
      };

      golgi.setLog(true);

      await golgi.renderAssembly('demo_assembly', 'body', context);


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


## How And Why Did The Example Work?

Let's analyse in detail what happened and why.

### The Root Application Module

Let's start with the root application module.  

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

### Our *Golgi Assembly*

So now let's look at our simple demonstration *Golgi Assembly*.

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


#### How the *renderAssembly()* Method Works

The *renderAssembly()* method first dynamically *import*s the *Golgi Assembly* Module,
and then invokes its *load()* method.  This results in a cascade of activity: 

-each *Golgi Component*
referenced in your *gx* is dynamically imported and rendered in turn, first starting with the parent
*gx* tag(s), then, once each has completed its load and render sequence, any child *gx* tags
are similarly processed.  This process is repeated, recursing down through all the nested *gx* tags that 
you have specified.

**Note 1:** Golgi processes each child *gx* tag in strict sequence, to ensure that they
are correctly appended to their parent element's target(s) in the sequence,
as defined by the sequencing of your *gx* tags.  The
importation of each child's associated Golgi Component modules must therefore await completion of its
previous sibling before it can begin its own importation and processing.  However, once a *Golgi Component* is loaded, the processing of
any of its child components begins immediately: ie a next sibling Component does not
have to await the importation and processing of its previous sibling's child Components.  This
therefore minimises the overall importation time of an application's modules as much as possible,
allowing as many as possible to be imported in parallel.

**Note 2:** Each *Golgi Component* that you use is only physically imported once.  Any
subsequent references to/use of that same *Golgi Component* will use a cached version without
any noticeable overhead.  Also, of course, the browser itself will thereafter cache the modules
imported by your application, so any network transport delays will be significantly reduced
whenever the application is re-run in the browser.  

** Note 3:** Even if a large UI application involves the
importation of many *Golgi Components*, you should nevertheless find that both perceived and 
actual performance is very high because (a) the imported modules are typically tiny files;
(b) the progressive, "only as needed" build-out of an *Golgi* application
means that only those Component modules needed at any point within your application
 are actually physically imported; and (c) Your UI elements should appear in sequence as soon
as they are loaded, so the user shouldn't typically see any significant delays 
whilst looking at a blank screen.


### What Happened When Our Assembly Was Rendered?

Hopefully everything will become clearer if we step through our example Assembly and analyse how
*Golgi* processed it.

#### The Parent *gx* Tag

It starts with the parent *gx* tag which, in our case is:

      <demo-div text="Welcome to Golgi Assemblies">...</demo-div>

This tells *Golgi* to render our *demo-div* *Golgi Component*.  If it hasn't already been 
imported, Golgi does so, and once ready, it renders the Component, attaching it to the
parent DOM node defined by the *renderAssembly()* function's second argument.

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
        <span golgi:prop="spanTag">Click Me!</span>
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

          onBeforeState() {
            const fn = (e) => {
              e.stopPropagation();
              this.setState({text: 'You clicked the div at ' + Date.now()});
            };
            this.addHandler(fn, this.spanTag);
          }
        });
      };

#### The DOM After The Parent *gx* Tag is Rendered


At this point, your page's DOM will look like this:

      <body>
        <demo-div>
          <div>
            <span>Click Me!</span>
          </div>
        </demo-div>
      </body>

#### Setting State Using *gx* Tag Attributes

The next thing that happens is that *Golgi* looks through the *gx* tag's attributes.  Unless
prefixed with *golgi:*, each one is used to specify initial state for the *Component*, using
the *setState()* methods that are defined within its underlying WebComponent.

So, this attribute:

      text="Welcome to Golgi Assemblies"

is converted into:

      component.setState({text: "Welcome to Golgi Assemblies"});

So you can see in the *demo-div* WebComponent definition that setting 
*state.text* will result in:

      this.spanTag.textContent = state.text;

Remember that *this.spanTag* was defined by the *golgi:prop* attribute in the *span* tag here:

        <span golgi:prop="spanTag">Click Me!</span>

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


#### The Child *gx* Tag

*Golgi* now moves on to
process any of its child *gx* tags, and finds this one:

        <demo-div text="I'm inside the other div!" />

So it repeats the steps.  *Golgi* notices that it's already imported and registered
the *demo-div* WebComponent, so it can use it straight away.  It renders the WebComponent's
HTML and then it needs to decide where to append it.  

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


## Try Out the *demo-div* Component Click Handler

Now that the completed page is rendered in your browser, if you remember back to when we created the *demo-div* component, we added a *click* handler to its *span* tag:

          onBeforeState() {
            const fn = (e) => {
              e.stopPropagation();
              this.setState({text: 'You clicked the div at ' + Date.now()});
            };
            this.addHandler(fn, this.spanTag);
          }

Try clicking each of the lines of text.  You should notice that they each respond to clicks and also behave independently, each updating the text within their own instance of the *demo-div* WebComponent.


## Adding *Hooks* To *Golgi Components* Within Assemblies

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


### An Example Use Case for Hooks

So far you've seen how you can define properties and methods within the WebComponent
definition of a *Golgi Component*.  Such methods and properties become available for every instance
of that *Golgi Component* within your Assemblies.

You'll frequently have situations where you want to augment just one particular instance of a
*Golgi Component* within your Assemblies, for example adding a particular handler to it,
whilst leaving all other instances of the Component as standard.  Hooks
make this trivially simple.

### Specifying A Hook

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


### Try It Out!

Now all you need to do is try reloading your *index.html* page in your browser.  Whenever you 
run your mouse pointer over the second line of text, you should find that it changes.  However, 
the outer instance of the *demo-div* Component, which is showing the first line of text, won't
be affected by a *mouseover* event.  Both instances still respond to a *click* event, because this
is defined in the underlying WebComponent used by each instance.


## State Management and Data Binding In *Golgi*

*Golgi* provides a powerful means of state management and data binding which is deceptively
simple to use.  The *Golgi* Object includes a property named *state* which is actually a 
Proxy Object that traps any changes you make to it.

Within a *gx* tag in an Assembly, you can define a *State Map* that maps a *Golgi state*
object property name to a *setState()* property within the Component.  You do this by using
a special *gx* attribute named *golgi:stateMap*.  Its value has two parts, separated by a colon:

- the *Golgi state* object property name to trap.  This can use dot syntax to specify lower sub-levels within the *state* object. 
- the target Component's *setState* property to which to map the state value

For example:

      <demo-div text="Welcome to Golgi Assemblies" golgi:stateMap="message:text">


Having specified this, and once this *Golgi Component* has been rendered and is ready for use,
you can then do the following anywhere else in a component's methods, for example in a *hook* method:

      this.golgi_state.message = 'Hello World';

Note that *this.golgi_state* is how *Golgi*'s *state* Proxy is exposed within the context
of a COmponent.

What will happen is that the instance of the Component to which we applied the *stateMap* will
invoke its *setState()* method for the property named *text* as follows:

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
              this.golgi_state.message = 'I also noticed that at ' + Date.now();
            };
            this.addHandler(fn, this.spanTag, 'mouseover');
          }
        }
      };

Reload the *index.html* page in the browser, and now try running your mouse pointer over the
second line of text.  As if by magic, the top line will also now change!  This will happen
every time you mouse over the second line of text.



To follow...


## golgi:appendTo


## Loading assemblies using gx

## Using ordinady HTML tags in gx

# Advanced Stuff

## golgi:component-class in components



