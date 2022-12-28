# Developing With Golgi: A Comparison With React.js - Chapter 5

In the previous chapters, we've used Golgi to develop a fully-working version of the Example Application from the 
[**Thinking in React**](https://reactjs.org/docs/thinking-in-react.html) tutorial, using all of Golgi's advanced functionality.

In this Chapter we'll examine how to optimise the load-time performance of the application.

## Why Should This Be Necessary?

As you've seen throughout this tutorial, Golgi is deliberately designed to not require any bundling/compilation steps.  Instead it will automatically and dynamically import the resources it needs.  This is made possible by building all resources used in a Golgi Application as ES6 Modules.

If you examine the information in the Network tab of your browser's Developer Tools, you'll see how and when these resources are loaded.

The Example Application used for this tutorial is actually very small, so the load time and time taken until it's ready for use by a user, even over a slow network, is pretty quick.  That won't be so true if you've used Golgi to develop a large and complex application with a large number of Assemblies and Components.

Golgi provides an optional set of tools that allow you to do some initial server-side optiimisations.  Essentially these create:

- a minimised single JavaScript file containing all your application's Assembly modules
- a minimised single JavaScript file containing all Component modules within a namespace within your Application

Golgi can be instructed to import these into your application, and once ready, you can then load the first Golgi Assembly.

This set of optimisations avoids the need for Golgi to import individually each Assembly and Component module as and when required, thereby significantly cutting down the network traffic for the application.

You can further optimise things yourself by pre-loading as many of the resources needed by your application as possible into the application's *index.html* page using *script* tags.  Furthermore it's also a good idea to enable file compression in your Web Server.

Golgi's Server-Side Tools are written in JavaScript for use with Node.js.  They can be run natively in Node.js, if you've installed it on your server.  Alternatively, if you've installed Docker, you can use Golgi's Server-Side tools using a special Docker Container which is available from Docker Hub: *rtweed/node-runner*.

In this tutorial I'm going to use the Docker version.  If you want to use the Native Node.js version of the tools, 
[read this tutorial](./SERVER-SIDE-TOOLS.md).

So let's go through the steps needed to fully optimise our Example Application.


## Installing and Configuring Golgi's Server-Side Tools

The first thing we need to do is to create a work directory for the optimisation process.  This does not need to be on the Web Server machine, but if you do use the Web Server machine, create a directory outside its mapped directories - we don't want this directory to be accessible via the Web Server.  

For the purposes of this Tutorial, I'll assume we'll be using a directory named */user/ubuntu/golgi-sst*

### Create the Work Directory

        cd ~
        mkdir golgi-sst
        cd golgi-sst

### Install the Tools

From the Golgi repository on Github, copy the contents of the [/server-side-tools](/server-side/tools) to your new directory.

### Create Directories for your Assembly and Component Source Files

      cd ~/golgi-sst
      mkdir assemblies_src
      mkdir components_src

## Copy your Assembly File into the Source Directory

Create a copy of the Example Application's Assembly File - *filterable-product-table* and rename it with a file extension of *.mjs*:

### ~/golgi-sst/assemblies_src/filterable-product-table.mjs

        export function load(ctx) {

          let gx=`
        <productui-searchbar />
        <productui-table golgi:hook="initialise" />
          `;

          let hooks = {
            'productui-table': {
              initialise: function() {
                ctx.PRODUCTS = [
                  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
                  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
                  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
                  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
                  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
                  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
                ];
                this.populate();
              }
            }
          };

          return {gx, hooks};
        };


## Create Source Copies of the Component Module Files

This step is a little bit more complex.  In order for the Component Modules to be minimised and optimised into a single JavaScript file, you need to reformat their contents using the following structure:

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

If the Component uses ShadowDOM, you also need to add a property to the *def* object:

        useShadowDOM: true

Essentially this means doing three things:

- locating and copying the Component Name
- locating and copying the HTML used in the Component
- locating and copying all the Component's methods.

Each file must use the original Component name as its filename, but MUST have a file extension of *.mjs*.

So, for our Example Application, here's what the Component Source files will look like:

### ~/golgi-sst/components_src/productui-searchbar.mjs

        let def = {
          name: 'productui-searchbar',
          html: `
        <input type="text" placeholder="Search..." golgi:on_keyup="filter" />
        <p>
          <input type="checkbox" golgi:on_click="checked" />
          &nbsp;Only show products in stock
        </p>
          `,
          methods: `
                onBeforeState() {
                  this.only_instock = false;
                  this.context.filter = '';
                }

                filter(e) {
                  this.context.filter = e.target.value.toLowerCase();
                  this.context.table.reformat(this.only_instock);
                }

                checked() {
                  this.only_instock = !this.only_instock;
                  this.context.table.reformat(this.only_instock);
                }
          `
        };
        export {def};


### ~/golgi-sst/components_src/productui-table.mjs

        let def = {
          name: 'productui-table',
          html: `
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody golgi:prop="tbody"></tbody>
        </table>
          `,
          methods: `
            onBeforeState() {
              this.context.table = this;
            }

            async populate() {
              let categoryFound = {};

              for (const [index, product] of this.context.PRODUCTS.entries()) {
                let state_name = 'product' + index;
                if (!categoryFound[product.category]) {
                  categoryFound[product.category] = true;
                  let crow = await this.renderComponent('productui-category-row', this.tbody, this.context);
                  crow.addStateMap(state_name);
                }
                let row = await this.renderComponent('productui-row', this.tbody, this.context);
                row.addStateMap(state_name);
                if (product.stocked) {
                  product.style = 'color: black;'; 
                }
                else {
                  product.style = 'color: red;'; 
                }
                this.golgi_state[state_name] = product;
              }
            }

            reformat(only_instock) {

              function visibility(stocked) {
                if (only_instock) {
                  // only display if in stock
                  if (stocked) {
                    return 'show';
                  }
                  else {
                    return 'hide';
                  }
                }
                else {
                  return 'show';
                }
              }

              for (const [index, product] of this.context.PRODUCTS.entries()) {
                if (this.context.filter !== '') {
                  if (product.name.toLowerCase().includes(this.context.filter)) {
                    product.status = visibility(product.stocked);
                  }
                  else {
                    product.status = 'hide';
                  }
                }
                else {
                  product.status = visibility(product.stocked);
                }
                this.golgi_state['product' + index] = product;
              }
            }
          `
        };
        export {def};


### ~/golgi-sst/components_src/productui-category-row.mjs

        let def = {
          name: 'productui-category-row',
          useShadowDOM: true,
          html: `
        <style>
        .td {
          display: table-cell;
          font-weight: bold;
        }
        .colspan {
          max-width: 1px;
          overflow: visible;
          white-space: nowrap;
        }
        :host {
          display: table-row;
        }
        </style>
        <div class="td colspan">golgi:bind=category</div>
          `
        };
        export {def};


### ~/golgi-sst/components_src/productui-row.mjs

        let def = {
          name: 'productui-row',
          useShadowDOM: true,
          html: `
        <style>
        .td {
          display: table-cell;
        }
        :host {
          display: table-row;
        }
        </style>
        <div class="td" status="golgi:bind=status" style="golgi:bind=style">golgi:bind=name</div>
        <div class="td">golgi:bind=price</div>
          `,
          methods: `
            onBeforeState() {
             this.observerStart();
            }

            observerCallback(mutation) {
              if (mutation.attributeName === 'status') {
                let status = mutation.target.getAttribute('status');
                if (status !== 'undefined') this[status]();
              }
            }

            show() {
              this.style = "display: '';";
            }

            hide() {
              this.style = "display: none;";
            }
          `
        };
        export {def};


## Optimise the Assembly File

You're now ready to run the Server-Side tool that optimises Assembly Module Files.

I'm going to assume that you've already installed Docker and Docker Compose.  

You now need to pull the *node-runner* Container:

        docker pull rtweed/node-runner

Once that's installed, you can now do the following:

        cd ~/golgi-sst
        docker-compose run optimise_assemblies

After it has initialised itself and installed the necessary Node.js modules needed for the Golgi Server-Side Tools, it will ask you for the directory path containing your source version of the Assembly file(s).  Simply accept the default path that it's suggesting (*/node/assemblies_src*).

You'll then be prompted for the directory name into which it will create the optimised version.  Once again accept the default.  If this is the first time you've run the *node-runner* application, it will create the new directory and ask you again to confirm it's the one you want to use.  Hit the *Enter* key and it will then generate the new optimised version.  You'll actually find two files:

        ~/golgi-sst/assemblies/filterable-product-table.js
        ~/golgi-sst/assemblies/golgi-assemblies.js

It's the latter file we actually want - it bundles all our assembly files into one single minimised JavaScript file.

It should look like this:

        let golgi_assemblies = [];
        golgi_assemblies.push({name:'filterable-product-table',code:function load(e){return{gjson:
        [{componentName:"productui-searchbar",state:{},assemblyName:"filterable-product-table"},
        {componentName:"productui-table",state:{"golgi:hook":"initialise"},hook:function(){e.PRODUCTS=
        [{category:"Sporting Goods",price:"$49.99",stocked:!0,name:"Football"},
        {category:"Sporting Goods",price:"$9.99",stocked:!0,name:"Baseball"},
        {category:"Sporting Goods",price:"$29.99",stocked:!1,name:"Basketball"},
        {category:"Electronics",price:"$99.99",stocked:!0,name:"iPod Touch"}, 
        {category:"Electronics",price:"$399.99",stocked:!1,name:"iPhone 5"},{category:"Electronics",
        price:"$199.99",stocked:!0,name:"Nexus 7"}],this.populate()},assemblyName:"filterable-product-table"}]}}});
        export {golgi_assemblies}


## Optimise the Component Files

Once again we'll use the *node-runner* Docker Container, but this time we'll use it like this:


        cd ~/golgi-sst
        docker-compose run build_components


It will ask you for the directory path containing your source versions of the Component files.  Simply accept the default path that it's suggesting (*/node/components_src*).

You'll then be prompted for the directory name into which it will create the optimised version.  Once again accept the default.  If this is the first time you've run *build_components*, it will create the new directory and ask you again to confirm it's the one you want to use.  Hit the *Enter* key and it will then generate the new optimised versions.  You'll actually find a number of files:

- minimised versions of each individual Component
- a bundled version containing minimised versions of all the Components: *golgi-components.js*

It's the latter file we actually want in this instance.  It should look like this:

        let golgi_components = [];
        golgi_components.push(function load(){let e="productui-category-row",t=-1;customElements.define(e,class extends
        HTMLElement{constructor(){super(),t++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML=`<style>.td {
          display: table-cell;
          font-weight: bold;
        }
        .colspan {
          max-width: 1px;
          overflow: visible;
          white-space: nowrap;
        }
        :host {
          display: table-row;
        }</style><div class="td colspan">golgi:bind=category</div>`,this.name=e+"-"+t}undefined})});
        golgi_components.push(function load(){let t="productui-row",e=-1;customElements.define(t,class extends HTMLElement
        {constructor(){super(),e++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML=`<style>.td {
          display: table-cell;
        }
        :host {
          display: table-row;
        }</style><div class="td" status="golgi:bind=status" style="golgi:bind=style">golgi:bind=name</div>
        <div class="td">golgi:bind=price</div>`,this.name=t+"-"+e}onBeforeState(){this.observerStart()}observerCallback(t)
        {"status"===t.attributeName&&"undefined"!==(t=t.target.getAttribute("status"))&&this[t]()}show()
        {this.style="display: '';"}hide(){this.style="display: none;"}})});
        golgi_components.push(function load(){let t="productui-searchbar",e=-1;customElements.define(t,class extends 
        HTMLElement{constructor(){super(),e++;this.html='<input type="text" placeholder="Search..." golgi:on_keyup="filter">
        <p><input type="checkbox" golgi:on_click="checked"> &nbsp;Only show products in stock</p>',this.name=t+"-"+e}
        onBeforeState(){this.only_instock=!1,this.context.filter=""}filter(t){
        this.context.filter=t.target.value.toLowerCase(),this.context.table.reformat(this.only_instock)}checked()
        {this.only_instock=!this.only_instock,this.context.table.reformat(this.only_instock)}})});
        golgi_components.push(function load(){let t="productui-table",e=-1;customElements.define(t,class extends HTMLElement
        {constructor(){super(),e++;this.html='<table><thead><tr><th>Name</th><th>Price</th></tr></thead><tbody
        golgi:prop="tbody"></tbody></table>',this.name=t+"-"+e}onBeforeState(){this.context.table=this}async populate(){
        var t,e,o={};for([t,e]of this.context.PRODUCTS.entries()){var r="product"+t;o[e.category]||(o[e.category]=!0,
        (await this.renderComponent("productui-category-row",this.tbody,this.context)).addStateMap(r)),(await
        this.renderComponent("productui-row",this.tbody,this.context)).addStateMap(r),e.stocked?e.style="color:
        black;":e.style="color: red;",this.golgi_state[r]=e}}reformat(e){function t(t){return!e||t?"show":"hide"}
        for(var[o,r]of this.context.PRODUCTS.entries())""===this.context.filter||r.name.toLowerCase().includes
        (this.context.filter)?r.status=t(r.stocked):r.status="hide",this.golgi_state["product"+o]=r}})});
        export {golgi_components}


## Copy the Bundled Files to your Web Server Directories

Now you need to copy the two bundled files to the appropriate directories on your web server machine:


- Copy *~/golgi-sst/assemblies/golgi-assemblies.js* to *www/example/js/assemblies/golgi-assemblies
- Copy *~/golgi-sst/components/golgi-components.js* to *www/example/js/components/productui/golgi-assemblies

Note: modify the paths as appropriate for your setup.


## Edit the *app.js* file

Next, we need to edit the Example Application's *app.js* file to make use of these bundled versions.  You'll find this at *www/example/js/app.js*.

Change its contents to the following:

        (async () => {

          const {golgi} = await import('./golgi.min.js');

          let context = {
            componentPaths: {
              productui: './components/productui/'
            },
            assemblyPath: './assemblies/'
          };

          golgi.fetch_optimised_components('productui', context);
          golgi.fetch_optimised_assemblies(context);

          golgi.on('assembliesLoaded', async function() {
            await golgi.renderAssembly('filterable-product-table', 'body', context);
          });

        })();


You'll see that:

- we're going to use the minimised version of Golgi itself (*golgi.min.js*) to minimise its load time.  This is available within the Golgi Repository in the */src* folder.

- we're now fetching and loading the bundled/minimised versions of the Assembly and Components using the Golgi methods:

  - *fetch_optimised_assemblies()*
  - *fetch_optimised_components()*

Golgi needs to wait until the assembly module is fully loaded available for use, which is why we're using:

          golgi.on('assembliesLoaded', async function() {
            await golgi.renderAssembly('filterable-product-table', 'body', context);
          });

Golgi will emit an *assembliesLoaded* event when the optimised assemblies bundle file has fully loaded, which we then handle using Golgi's *on()* event handler method.


## Try it Out

Having made these changes, you can now try it out.  Simply reload the *index.html* page into your browser, after first clearing its cache.

If you inspect the browser's Developer Tools Network tab, you should see it now loading the bundled files rather than the individual Assembly and Component files.


## Further Optimisations

We can make some further modifications to improve the load performance by editing the *index.html* file as follows:

        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Optimised Version</title>
          </head>
          <body>
            <script type="module" src="/jso/golgi.min.js"></script>
            <script type="module" src="jso/components/productui/golgi-components.js"></script>
            <script type="module" src="jso/assemblies/golgi-assemblies.js"></script>
            <script type="module" src="/jso/app.js"></script>
          </body>
        </html>


These additional *script* tags will ensure that all the resources are loaded in parallel by the browser before anything begins, rather than sequentially under the control of the *app.js* file.  By the time *app.js* actually executes, all the other dependent module files should be pre-loaded into the browser.

There's one final optimisation we can also make: we can use something like 
[Uglify](https://skalman.github.io/UglifyJS-online/) to minimise the app.js file, and then load it into the *index.html* using:

            <script type="module" src="/jso/app.min.js"></script>


For even better results, configure your Web Server to compress the resources sent to the browser.

You should now find that your Golgi application loads and renders extremely quickly, even over a very slow network.

Of course one key reason for this, which differentiates Golgi from React, is that it's using natively-supported WebComponents, so the amount of third-party JavaScript needed to make a Golgi application is tiny - just the *golgi.js*
module file which is only 18k in size.  WebComponents themselves are processed by browsers incredibly quickly, so, provided their initial loading can be optimised, you should find that your Golgi applications run extremely quickly without any subsequent rendering delays.



