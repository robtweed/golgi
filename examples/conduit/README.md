# Golgi Implementation of the RealWorld Conduit Front End

This implementation of the [RealWorld Conduit](https://github.com/gothinkster/realworld)
 front-end User Interface (UI) makes use of its 
[Bootstrap Theme pages](https://github.com/gothinkster/conduit-bootstrap-template/tree/master/pages).

These have been adapted slightly to allow the creation of a single-page application, but
essentially use the same HTML.

Let's go through the basis of the Golgi implementation step by step.

## index.html

As described in the [Golgi Tutorial](../../TUTORIAL.md), the initially-loaded HTML
page is a bare-bones one, just enough to kick-start things by loading the application
root module:

      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Golgi Conduit</title>
        </head>
        <body>
          <script type="module" src="./app.js"></script>
        </body>
      </html>

## *app.js*: The Application Root Module

Once again, the pattern described in the Tutorial is followed.  This module:

- loads the Golgi module

- Defines the context object, providing Golgi with the details on where to find the
application's Assemblies and Components

- loads and renders the application's root assembly

      (async () => {

        const {golgi} = await import('../../src/golgi.min.js');

        let context = {
          componentPaths: {
            conduit: '../examples/conduit/components/conduit/',
          },
          assemblyPath: '../examples/conduit/assemblies/',
          conduit: {
            rest_host: 'https://demos.mgateway.com',
            defaultImage: 'https://static.productionready.io/images/smiley-cyrus.jpg'
          }
        };

        golgi.renderAssembly('root_assembly', 'body', context);

      })();


You'll notice that the context object also defines a couple of application-specific things:

- what Conduit back-end to use.  Here I'm using a QEWD/YottaDB based on that we operate, which
provides one of the fastest-available REST/database back-ends you can use for Conduit.

- a default image to be used for user profiles if they don't explicitly define one.


## The RealWorld Conduit Root Assembly

The real action begins with the rendering of the 
[Conduit *root_assembly* Assembly](./assemblies/root_assembly.js).

The assembly only does four things though:

- it loads the main *conduit-root* Component, which, as we'll see later, provides the main
HTML superstructure for the RealWorld UI and which contains all the common methods needed by
the subsidiary Components.  However, before actually loading this component:

- it first loads the bare-minumum of JavaScript and CSS resources needed by the *conduit-root*
component. Note that the only resource that must be awaited before proceeding is a standard
[Auth0-sourced JavaScript file](https://github.com/auth0/jwt-decode)
 that handles JSON Web Tokens (JWTs).  Everything else is allowed to load asynchronously whilst
everything else is being loaded.

- once the *conduit-root* Component is loaded, a hook method is fired which:

  - loads a module that provides the interface to the REST APIs used throughout the application

  - sets the application to either a logged-out or logged-in state, depending on whether or
not a valid user JWT is stored in the browser's local storage (something defined in the
RealWorld specification).

  - loads up and brings into view what I refer to as the main Home Page by invoking the
*conduit-root* Component's *switchToPage()* method. A you'll see later in more detail, 
this method does two things:

    - loads the correspondingly-named Assembly, ie 
[*home_page.js*](./assemblies/home_page.js), if it hasn't already been loaded, and appends it
to a particular target *div* tag within the *conduit-root* Component.

    - makes sure it is visible


So let's now take a look at the *conduit-root* Component.


## The *conduit-root* Component.

The [*conduit-root*](./components/conduit/conduit-root.js) Component provides the main
HTML superstructure for the entire UI, and also all the commonly-used methods that
are used for it and by the other subsidiary Components.

### HTML Infrastructure

The main HTML superstructure is closely based on the 
[*index.html* Template page](https://github.com/gothinkster/conduit-bootstrap-template/blob/master/pages/index.html)
provided in the RealWorld UI resource repository, but also includes
the [header HTML](https://github.com/gothinkster/conduit-bootstrap-template/blob/master/pages/partials/_header.html) and [footer HTML](https://github.com/gothinkster/conduit-bootstrap-template/blob/master/pages/partials/_footer.html), since there is little to be gained by
having these as separately loaded Components and because they form a part of the core HTML
superstructure.

You'll see that many of the HTML tags within this superstructure are specifically registered 
as properties (using the special *golgi:prop* attribute): this is primarily so that parts
of the superstructure can be shown or hidden depending on whether or not a user is logged-in.

A key line in the superstructure HTML is this one:

      <div class="container-fluid" golgi:prop="contentTarget"></div>

This provides the single target for all the other subsidiary pages that will be displayed to
the user, depending on what they're doing.  These pages are loaded and brought into view on an
as-needed basis only (using the *swtichToPage()* method).  This method ensures that at any one time, 
only one of the appended pages will be visible, and the others will be hidden.

The subsidiary pages are:

- home_page
- settings (for updating a user's profile)
- profile (for displaying a user's profile)
- article (for displaying an article)
- new_article (for entering new and editing existing articles)
- sign-up (to register as a new user)
- login (to allow a registered user to log in)

Each is defined as an assembly, and each of those assemblies loads a corresponding
Component that defines the HTML for its page and any specific methods, ie:

- conduit-home-page.js
- conduit-settings.js
- conduit-profile.js
- conduit-article.js
- conduit-new-article.js
- conduit-signup.js
- conduit-login.js


### Golgi LifeCycle Methods

The *onBeforeState()* Golgi Lifecycle method is used to set up some initial control structures,
some for the *switchToPage()* pagination logic and some for the logged-on/logged-off display
toggling.

### General-purpose Methods

As noted in the Tutorial, Golgi automatically defines the first Component that is loaded
and appended to the *index.html* file's *body* tag as the *rootComponent*.  Every other Component
that is appended to this *rootComponent* is augmented with a *rootComponent* property which points
back to the *rootComponent*.

Hence, the Components that represent the other subsidiary RealWorld UI pages
 (eg *conduit-home-page*, *conduit-settings*, *conduit-article* etc) can all access the
root Component's methods, eg:

      this.rootComponent.switchToPage()
      this.rootComponent.addErrors()
       ...etc







 





