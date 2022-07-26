# *Golgi* Server-Side Build and Optimisation Tools

# Index

# Background

The *Golgi* repository includes a number of useful optional server-side tools that server two specific purposes:

- to make it quicker and simpler to create *Golgi* Components, avoiding the repetitive and error-prone use and creation of boiler-plate WebComponent code,

- to optimise the loading into and execution of *Golgi* Assemblies and Components within the user's browser.

The tools have been written using JavaScript/Node.js and can be executed in one of two ways:

- natively in Node.js, meaning you'll need to install Node.js in order to use them;

- as JavaScript script files that can be executed using our [*Node-Runner*](https://github.com/robtweed/node-runner)
Docker-based Node.js "scratch-pad" Container, meaning that all you'll need to install is Docker.


NOTES: 

- These server-side tools are entirely optional.

- These server-side tools are designed to be used on a Linux platform.


# Installing

## Copy the *server-side-tools* Folder

To make use of the server-side tools, you should create a directory on the Linux machine on which you want to build and maintain your *Golgi* Assemblies and Components.  This does not have to be your web-server machine.  For example:

        mkdir ~/golgi-sst


Then copy the contents of the *Golgi* repository
 [*/server-side-tools*](https://github.com/robtweed/golgi/tree/master/server-side-tools)
folder into your directory.


## Install Node.js or Docker

- If you want to use the Node.js tools natively, make sure you have [Node.js](https://nodejs.org) installed.

  - then install/configure the tools directory:

        cd ~/golgi-sst
        npm install


- If you want to use the Docker-based tools, make sure you have [Docker](https://docs.docker.com/engine/install/) installed.

  - then pull the *Node-Runner* container:

       docker pull rtweed/node-runner


# Building Components

## Create Source and Destination Folders

Create a folder for your source components, and another for the generated versions that will be created by the *Golgi* server-side tools, eg:

        mkdir ~/components_src
        mkdir ~/components


## The *Golgi* Component Source Template

Within the source components directory, you create each of your Golgi Components using the following template:

        let def = {
          name: '{{namespace}}-{{componentName}}',
          html: `
            {{componentHTML}}
          `,
            methods: `
              {{componentMethods}}
          `
        };
        export {def};

Note the use of the back-tick character to surround your Component's HTML and methods


## Example Using the Template

For example, let's take one of the simple Components from the *Conduit* example in this repository components (ie from the *sbadmin* namespace) that is used in the examples within this repository.  This is used to display a tag:

        let def = {
          name: 'conduit-tag',
          html: `
        <a class="tag-pill tag-default" href="#">golgi:bind</a>
          `,
          methods: `
            setState(state) {
              if (state.name) {
                this.name = state.name;
              }
            }
          `
        };
        export {def};


Save this as *conduit-tag.mjs*.  

Note that the file extension for your source Component files **must** be *.mjs* rather than *.js*.


## Compile/Build Your *Golgi* Components

Once you've created your source Component definitions using the template above, you can compile/build the actual WebComponents that they represent.

### Native Node.js

If you're using Node.js natively:

- navigate to your Golgi Tools directory and invoke the component builder script:

        cd ~/golgi-sst
        npm run build_components
 
### Using the Node-Runner Docker Container

If you're using Docker:

- navigate to your Golgi Tools directory and invoke the component builder:

        cd ~/golgi-sst
        docker-compose run build_components


### Running the Build Script

Whether you run the scripts natively in Node.js or using Docker, you'll see the same dialogue:

You'll be asked for the directory path for your source component definitions and the directory path into which the compiled/generated WebComponents are to be saved.  It will suggest folders within the current tools directory, but you supply your own directory names.  Note:

- the source directory **must** exist

- if the destination directory does not exist, the script will create it for you and then ask you confirm it.

For example:


        $ npm run build_components
        
        > golgi-sst@0.1.1 build_components
        > node buildComponents.js
        
        
        This will create Golgi WebComponent files from all source files in a folder

        Source folder containing Golgi Component Definition Files (./components_src)
        
        Destination folder for optimised WebComponent files (./components)


## Examine the Generated WebComponents

Look in the destination components directory and you should now see a corresponding file for each of your source definition files, eg for our example above, you'll find:

        ~/components/conduit-tag.js

Note that the file extension for the generated files is *.js*.

Its contents will look like this:

        function load(){let t="conduit-tag",e=-1;customElements.define(
        t,class extends HTMLElement{constructor(){super(),e++;this.html
        ='<a class="tag-pill tag-default" href="#">golgi:bind</a>',this.
        name=t+"-"+e}setState(t){t.name&&(this.name=t.name)}})}export{load};

You'll see that the builder has minified the generated WebComponent code.

Take a further look in the directory and you'll find an additional file named *golgi-components.js*.  This is a single JavaScript module file that contains the minimised generated WebComponent code for **all** your Components.  It will look something like this:

        let golgi_components = [];
          ... etc
        golgi_components.push(function load(){let t="conduit-tag",e=-1;
        customElements.define(t,class extends HTMLElement{constructor()
        {super(),e++;this.html='<a class="tag-pill tag-default" href="#
        ">golgi:bind</a>',this.name=t+"-"+e}setState(t){t.name&&(this.n
        ame=t.name)}})});
        export {golgi_components}

----

# Optimising Assemblies

## Create Source and Destination Folders

Create a folder for your source Assembly files, and another for the generated versions that will be created by the *Golgi* server-side tools, eg:

        mkdir ~/assemblies_src
        mkdir ~/assemblies

If you've already created one or more *Golgi* Assembly files, copy them into the source folder.  

It's usually a good idea to have previously tested and debugged your Assembly files using their full source code, as the optimised versions will be minified and much more difficult to debug.

You **must** change the file extension of all your Assembly files to *.mjs*.  

You'll find that the *Golgi* tools directory includes a handy *bash* script file called *rename*.  You can use this to automate the process.  Copy it into your source assembly folder and change its permissions to make it executable.


## Example Source Assembly

Here's an example of a simple *Golgi* Assembly file (taken from the */examples* directory in this repository):

        export function load(ctx) {
          const gx=`
            <conduit-content-page name="profile">
              <conduit-profile />
            </conduit-content-page>
          `;
          return {gx};
        };

This would be saved in the source Assembly folder as *~/assemblies/profile.mjs*.


## Optimise Your *Golgi* Assemblies

You can now generate optimised versions of your Assemblies

### Native Node.js

If you're using Node.js natively:

- navigate to your Golgi Tools directory and invoke the component builder script:

        cd ~/golgi-sst
        npm run optimise_assemblies
 
### Using the Node-Runner Docker Container

If you're using Docker:

- navigate to your Golgi Tools directory and invoke the component builder:

        cd ~/golgi-sst
        docker-compose run optimise_assemblies


### Running the Optimisation Script

Whether you run the scripts natively in Node.js or using Docker, you'll see the same dialogue:

You'll be asked for the directory path for your source Assembly files and the directory path into which the optimised versions are to be saved.  It will suggest folders within the current tools directory, but you can supply your own directory names.  Note:

- the source directory **must** exist

- if the destination directory does not exist, the script will create it for you and then ask you confirm it.

For example:


        $ npm run optimise_assemblies
        
        > golgi-ssr@0.1.1 optimise_assemblies
        > node optimiseAssemblies.js
        
        
        This will create optimised Assembly files from all standard Golgi Assembly source files in a folder
        
        Source folder containing Golgi Assembly Files (./assemblies_src)
        
        Destination folder for optimised output files (./assemblies)


## Examine the Optimised Assemblies

Look in the destination Assemblies directory and you should now see a corresponding file for each of your source Assembly files, eg for our example above, you'll find:

        ~/assemblies/profile.js


It would now look like this in the destination folder:

        function load(e){return{gjson:{componentName:"conduit-content-page",
        state:{name:"profile"},children:[{componentName:"conduit-profile",
        state:{},assemblyName:"profile"}],assemblyName:"profile"}}}export{load};

You'll notice that two things have happened:

- the XML tags that were in the source version of the Assembly file have been converted to an equivalent JSON representation.  This would normally take place in the browser, but the optimisation script has pre-performed this conversion to save the browser from having to do it

- the generated Assembly code has been minified to reduce the time it will take a browser to download it.


Take a further look in the directory and you'll find an additional file named *golgi-assemblies.js*.  This is a single JavaScript module file that contains the minimised and optimised code for **all** your Assemblies.  It will look something like this:

        let golgi_assemblies = [];
        golgi_assemblies.push({name:'profile',code:function load(e){
        return{gjson:{componentName:"conduit-content-page",state:{
        name:"profile"},children:[{componentName:"conduit-profile",
        state:{},assemblyName:"profile"}],assemblyName:"profile"}}}});
        export {golgi_assemblies}


----

# Using the Optimised Components and Assemblies

## Copy the Generated Files to your Web Server

You can now copy the generated Component and Assembly files to their corresponding directories on your Web Server.

Make sure you also copy the *golgi-components.js* and *golgi-assemblies.js* files to your Web Server.


If you now try loading the application in a browser, you'll see that the optimised versions of the Assemblies and Components will be loaded.  This will save some download time and reducing processing overheads within the browser, so you should see a bit of an improvement in initial load times.


## Significantly Increasing Initial Load Times

You can make a significant improvement in *Golgi* application start-up/initial load times by making use of those composite generated files: *golgi-components.js* and *golgi-assemblies.js*.

To make use of them, modify the *app.js* file for your *Golgi* application as follows.

Let's say your *app.js* file looked like this (taken from the /examples):

        (async () => {
          let context = {
            componentPaths: {
              conduit: '../examples/conduit-opt/components/conduit/',
            },
            assemblyPath: '../examples/conduit-opt/assemblies/'
          };
          const {golgi} = await import('../../src/golgi.min.js');
          golgi.renderAssembly('root_assembly', 'body', context);
        })();


Simply change it to this:

        (async () => {
          let context = {
            componentPaths: {
              conduit: '../examples/conduit-opt/components/conduit/',
            },
            assemblyPath: '../examples/conduit-opt/assemblies/'
          };
          const {golgi} = await import('../../src/golgi.min.js');

          golgi.fetch_optimised_components('conduit', context);
          golgi.fetch_optimised_assemblies(context);

          golgi.on('assembliesLoaded', async function() {
            golgi.renderAssembly('root_assembly', 'body', context);
          });

        })();


This will now pre-fetch the composite optimised Components and Assembly files containing all your application's assemblies and Components in just two minified files.  This will significantly reduce the file download overhead, and it also means that by the time your *Golgi* application needs to use a WebComponent, it will already be loaded and ready to use.

It still takes a finite amount of time for *Golgi* to download and process your Assemblies, particularly if you have a lot of them, so you'll notice in the example above that the Root Assembly isn't loaded until the *fetch_optimised_assemblies* method has triggered an *assembliesLoaded* event:

          golgi.on('assembliesLoaded', async function() {
            golgi.renderAssembly('root_assembly', 'body', context);
          });

Once this event is emitted, *Golgi* can safely render the Root Assembly, but at that stage, all the pre-optimised Assemblies and minified WebComponents needed for your application are ready for use, so you won't experience any further delays due to downloads or processing.

----

# Further Potential Optimisations

You may find that you can make further optimisations to enhance the initial load time for your Golgi application by modifying the way you load other resources such as script files and CSS files.

Take a look at this example (actually from our own web site):

- the *index.html* file loads the various resources in an optimal sequence, making use of asynchronous loading techniques available in modern browsers, and loading the earliest-needed files first.  It also hard-codes the various *meta* tags rather than adding them dynamically within *Golgi* Assemblies:

        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>M/Gateway Developments Ltd</title>

            <link rel="preload" href="/js/components/sbadmin/css/styles.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
          </head>
        
          <body>
            <script type="module" src="/js/golgi.min.js"></script>
            <script type="module" src="/js/app.js"></script>
            <script type="module" src="/js/assemblies/golgi-assemblies.js"></script>
            <script type="module" src="/js/components/sbadmin/golgi-components.js"></script>
            <script async src="/js/feather.min.js" onload="feather.replace()"></script>
            <script async src="/js/bootstrap.bundle.min.js"></script>
            <script async src="/js/showdown.min.js"></script>
          </body>
        </html>


You'll notice that we're also using the *index.html* file to pre-load the various modules that are used in the *app.js* file, eg:

            <script type="module" src="/js/golgi.min.js"></script>
            <script type="module" src="/js/assemblies/golgi-assemblies.js"></script>
            <script type="module" src="/js/components/sbadmin/golgi-components.js"></script>

This ensures that by the time the *app.js* is loaded and begins executing, it doesn't have to wait any further to download these other resources: they should already be available.

By performing these additional, simple optimisation steps, you should see very significant initial load times.  We've been able to achieve full 100% Lighthouse performance values for *Golgi* applications, demonstrating just how performant a fully WebComponent-based application can be.
