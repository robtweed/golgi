# Golgi: Dynamically-loading WebComponent Assembly Framework
 
Rob Tweed <rtweed@mgateway.com>  
14 February 2022, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

# What is Golgi?

*Golgi* (pronounced Gol-jee) is a new approach to browser-based User Interface (UI) development that
makes use of the latest Web Technologies, in particular WebComponents, ES6 Modules, Proxies and
MutuationObserver.

*Golgi* allows you to build UIs using WebComponents as composable units, abstracted as 
XML/XHTML tags and delivered progressively
on-demand, without the need for a time-consuming bundling/compilation step, and without
the need for Node.js, WebPack or large, complex build chains during development or deployment.

Just develop and go, edit and go!

# Try It Out!

Run this [live example](https://robtweed.github.io/golgi/examples/sbadmin/), 
demonstrating how *Golgi* turns the [SB Admin ](https://startbootstrap.com/template/sb-admin) 
theme into an actual framework that you can quickly and
easily customise to meet your needs.

You can also try out [this live example](https://robtweed.github.io/golgi/examples/conduit/),
demonstrating the [RealWorld Conduit](https://github.com/gothinkster/realworld) 
front-end, implemented as a single-page application
using *Golgi*.

**NOTE:** You must use a modern browser that supports WebComponents to run these examples!

See the [*./examples*](./examples) folder for the actual *Golgi* source code
files that run the live examples.

# About Golgi

*Golgi* can only be used where you know that the very latest browsers
are in use, but if they are, then it provides one of the fastest and leanest frameworks
for UI development, since it makes use of the built-in capabilities of the browser,
avoiding the need to download large bundled JavaScript framework files.  *Golgi* itself a mere 38Kb 
in size in its uncompressed source version, and just 15Kb if you use the minimised version,
and is literally all that is needed to make everything work!

*Golgi* can be used with many other standard UI frameworks such as Bootstrap 5, Chart.js etc. Of
course, if you make use of these, their JavaScript and CSS resource files must be downloaded
into your application.  However, *Golgi* allows such resources to be downloaded on demand and
only when needed, resulting in very short application load and start times.  You'll see this
happening in the live example.

Unlike many of the UI frameworks that are currently in vogue, *Golgi* does not require or make use
of bundling (eg using WebPack etc).  Your JavaScript files and WebComponents that define a *Golgi*
application are dynamically loaded, on demand, as ES6 Modules.  Avoiding a separate compilation/bundling
step speeds up application development considerably, and doesn't require the creation and configuration
of a complex build chain.  All you need to get up and running is the tiny *Golgi* JavaScript file, and everything else is done by the Web Technology built into modern browsers.

# Why Is It Named *Golgi*?

The Golgi Apparatus (or Golgi Body) exists in every living cell, 
and its purpose is to package proteins into membrane-bound vesicles inside the cell, before the vesicles are sent to their destination.  Proteins are constructed from simpler building blocks called Amino Acids.

The analogy is that WebComponents provide the basic building-blocks for what we call Assemblies, 
and the *Golgi* framework allows you to fetch, configure and send these Assemblies to their 
correct destination within the UI layout.

# *Golgi* In A Nutshell

*Golgi* is very much an atomic design methodology:

- The basic building blocks are *Golgi Components*.  These are WebComponents that you 
package as ES6 Modules.  They can be as simple or as
complex as you like, but typically they are simple and small.  Many may represent just a 
single HTML tag.  By being defined as WebComponents, you can define methods and properties 
that are relevant to the purpose of the tag or set of tags within the Component.

- *Golgi Assemblies* are your "proteins", built from *Golgi Components*, and 
visualised by the develper as nested XML/XHTML tags, each of which represents a *Golgi Component*.  
*Golgi Assemblies* can optionally configure each instance of its constituent *Golgi 
Components*, adding state values and optional methods that are invoked when each constituent 
*Golgi Component* is rendered.  *Golgi Assemblies* are also packaged as ES6 Modules, allowing
*Golgi* to dynamically import and load them on demand.  When a *Golgi Assembly* is loaded, its
constituent *Golgi Component* modules are dynamically imported, loaded and rendered.

- Within *Golgi Assemblies*, you can optionally define mappings for data binding, automatically 
invoking *Golgi Component setState()* methods when specified paths within *Golgi's state* object
are set or changed.

- You can optionally specify Mutation Observers within *Golgi Components*, allowing dynamic
behaviour to be defined in response to specified changes in the rendered Component.

In *Golgi Components*, you can decide whether or not to make use of the ShadowDOM that WebComponents
provide.  For most of the time you'll find that you won't actually use ShadowDOM, for reasons that
will become clear later.  This may surprise a lot of people, since the general impression is
that ShadowDOM is an essential part of WebComponents: it's actually not.  ShadowDOM is entirely optional,
and understanding that makes all sorts of things possible with WebComponents, as *Golgi* demonstrates.

From these simple building blocks, anything is then possible!

# Installation

Just copy the [*golgi.js*](./src/golgi.js) or [*golgi.min.js*](./src/golgi.min.js) file to a
directory accessible by your web server and you're ready to go.

Alternatively, to quickly try it out without installing anything, just *import* the 
*golgi.js* or *golgi.min.js* file directly from this repository using the URL:

- https://cdn.jsdelivr.net/gh/robtweed/golgi/src/golgi.min.js

  **NOTE:** If you do this, you must specify absolute paths in your component and
assembly path configurations, since the *import* relative paths used within the *Golgi* 
module will be with respect to its original path, in this case 
*https://cdn.jsdelivr.net/gh/robtweed/golgi/src/*.  See the tutorial below for details.

# Tutorial

[Follow this tutorial](./TUTORIAL.md) to quickly learn how to use *Golgi*.


# Further Documentation to follow
....


## License

 Copyright (c) 2022 M/Gateway Developments Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
