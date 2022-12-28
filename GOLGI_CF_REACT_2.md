# Developing With Golgi: A Comparison With React.js - Chapter 2

In Chapter 1 we used Golgi to develop a basic display-only version of the Example Application from the 
[**Thinking in React**](https://reactjs.org/docs/thinking-in-react.html) tutorial.

In this Chapter, we're going to modify the Golgi application logic to implement the Example Application's interactive/dynamic behaviour.

# Adding Dynamic Behaviour

In Chapter 1 we only implemented the basic behaviour of initially rendering the *PRODUCTS* table.

We now need to add two pieces of dynamic behaviour:

- showing/hiding items that are out of stock, in response to the user-controlled checkbox at the top of the User Interface;
- filtering products based on the user-entered search string


## Enabling the Checkbox to Show/Hide Out-of-Stock Products

As you'd expect, there are all sorts of ways that we could do this, but in this tutorial we'll add a handler to the checkbox that will iterate through the PRODUCTS array and, having identified the corresponding *productui-row* Component in the table, change its styling so that it is either displayed or hidden.

In order to make this behaviour possible, we're going to have to make sure that a number of resources become accessible between several Golgi Components and the top-level *filterable-product-table* Assembly - you'll see why as we work through the additional logic we need in the application.

Golgi provides two ways that you can make resources accessible between Components and Assemblies: the *Context* object and the *rootComponent*.  You've already seen how the Context Object is used to define the paths for your Components and Assemblies.  Golgi also augments every Component with a *rootComponent* property that provides a pointer to the top-level Component in your application.

For this example, I'm going to use the *Context* object.

### filterable-product-table Assembly

We need to make the following changes:

- we can make the *Context* object available within an Assembly by adding it as an argument to the Assembly's *load()* method, ie:

        export function load(ctx) {

- next, add the PRODUCTS array to the *Context* object instead of defining it as a local variable, so it's then available to other Components:

        ctx.PRODUCTS = [
          {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
          {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
          {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
          {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
          {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
          {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
        ];

- call the *productui-table*'s *populate()* method without an argument:

        this.populate();

So the Assembly Module should now look like this:

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


### productui-searchbar Component

We need to make the following changes:

- add an onClick event handler to the checkbox.  Golgi provides a slick way to define this using the *golgi:on_{{eventName}}* attribute.  In our case:

        <input type="checkbox" golgi:on_click="checked" />

  This means that whenever the checkbox is clicked, the Component's method named *checked()* is invoked

- so now add that *checked()* method:

        checked() {
          this.only_instock = !this.only_instock;
          this.context.table.reformat(this.only_instock);
        }

  This is going to toggle a Component property named *only_instock* between *true* and *false*.  It's then going to invoke a *productui-table* method named *reformat()* which we'll also make accessible via the *Context* Object (see how later).  We pass the *only_instock* property into this method as an argument.  

  Note that every Golgi Component automatically has access to the *Context* Object via *this.context*.

- initialise the *only_instock* property to false:

        onBeforeState() {
          this.only_instock = false;
        }

  We'll use Golgi's *onBeforeState()* lifecycle method for this, so it's instantiated when the *productui-searchbar* Component has finished rendering.

In summary, the *productui-searchbar* Component should now look like this:

            export function load() {
            
              let componentName = 'productui-searchbar';
            
              customElements.define(componentName, class productui_searchbar extends HTMLElement {
                constructor() {
                  super();
                  const html = `
        <input type="text" placeholder="Search..." />
        <p>
          <input type="checkbox" golgi:on_click="checked" />
          &nbsp;Only show products in stock
        </p>
                  `;
            
                  this.html = `${html}`;
                }

                onBeforeState() {
                  this.only_instock = false;
                }

                checked() {
                  this.only_instock = !this.only_instock;
                  this.context.table.reformat(this.only_instock);
                }
            
              });
            };



### productui-table Component

We need to make a few changes as follows:

- initialise a couple of new properties in the Component's *onBeforeState()* lifecycle method:

        onBeforeState() {
          this.context.table = this;
          this.rows = [];
        }

  Note how we're setting a *Context* Object property named *table* that points to this Component.

  You'll see how and why we'll use the *this.rows* array next.

- - modify the *populate()* method to iterate through the PRODUCTS array which is now in the *Context* object:

        for (const [index, product] of this.context.PRODUCTS.entries()) {

- also modify the *populate()* method, pushing each *productui-row* Component instance into the *this.rows* array at each iteration:

        let row = await this.renderComponent('productui-row', this.tbody, this.context);
        row.setState(product);
        this.rows.push(row);

- add a *reformat()* method that will be invoked whenever the *productui-searchbar* checkbox is clicked:

         reformat(only_instock) {
          for (const [index, product] of this.context.PRODUCTS.entries()) {
            let row = this.rows[index];
            row.visibility(only_instock, product.stocked);
          }
        }

This will iterate through the PRODUCTS array, get a pointer to the corresponding *productui-row* Component for each *product* object, and then invoke the *productui-row* Component's *visibiliy()* method, passing the *stocked* property as its argument.

In summary, the *productui-table* Component should now look like this:

        export function load() {

          let componentName = 'productui-table';
          
          customElements.define(componentName, class productui_table extends HTMLElement {
            constructor() {
              super();
              const html = `
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody golgi:prop="tbody"></tbody>
        </table>
              `;
              this.html = `${html}`;
            }

            onBeforeState() {
              this.rows = [];
              this.context.table = this;
            }

            async populate() {
              let categoryFound = {};

              for (const [index, product] of this.context.PRODUCTS.entries()) {
                if (!categoryFound[product.category]) {
                  categoryFound[product.category] = true;
                  let crow = await this.renderComponent('productui-category-row', this.tbody, this.context);
                  crow.setState(product);
                }
                let row = await this.renderComponent('productui-row', this.tbody, this.context);
                row.setState(product);
                this.rows.push(row);
              }
            }

            reformat(only_instock) {
              for (const [index, product] of this.context.PRODUCTS.entries()) {
                let row = this.rows[index];
                row.visibility(only_instock, product.stocked);
              }
            }

          });
        };


### productui-row Component

We need to now make a couple of changes to this Component

First, we'll add a *show()* and *hide()* method:

        show() {
          this.style = "display: '';";
        }

        hide() {
          this.style = "display: none;";
        }

Note how we can apply the style to the Component's top-level element (ie *this*).

Secondly, we'll add the method named *visibility()*:

        visibility(only_instock, stocked) {
          if (only_instock) {
            // only display if in stock
            if (stocked) {
              this.show();
            }
            else {
              this.hide();
            }
          }
          else {
            this.show();
          }
        }

We're basically displaying or hiding each instance of the *productui-row* Component, depending on:

- the checkbox's *only_instock* toggle value
- the product's *stocked* property value



In summary, the *productui-row* Component should now look like this:

        export function load() {

          let componentName = 'productui-row';
          
          customElements.define(componentName, class productui_row extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: 'open' });
              const html = `
        <style>
        .td {
          display: table-cell;
        }
        :host {
          display: table-row;
        }
        </style>
        <div class="td" golgi:prop="name"></div>
        <div class="td" golgi:prop="price"></div>
              `;
              this.shadowRoot.innerHTML = `${html}`;
            }

            setState(state) {
              if (state.name) {
                this.name.textContent = state.name;
              }
              if (state.price) {
                this.price.textContent = state.price;
              }
              if (state.stocked) {
                this.name.style = 'color: black;';
              }
              else {
                this.name.style = 'color: red;';
              }
            }

            show() {
              this.style = "display: '';";
            }

            hide() {
              this.style = "display: none;";
            }

            visibility(only_instock, stocked) {
              if (only_instock) {
                // only display if in stock
                if (stocked) {
                  this.show();
                }
                else {
                  this.hide();
                }
              }
              else {
                this.show();
              }
            }

          });
        };


### Try it Out

You should now be ready to try out this new version.  Remember, there's no bundle/compile step with Golgi - your newly-modified Component and Assembly modules are immediately ready to run.

So, reload the *index.html* page in your browser.  Note: you may find you need to clear the browser's cache first to ensure that the latest edited versions of all the modules are loaded.

Now try checking and unchecking the Checkbox - the rows whose product names are highlighted in red should now alternately disappear and reappear.

Let's recap how this works:

- whenever the checkbox is clicked, its Component's *only_instock* property is toggled between *true* and *false*, and the *productui-table* Component's *reformat()* method is invoked using that toggle value.

- the *productui-table* Component's *reformat()* method iterates through the PRODUCTS array (now held in the *Context* Object), identifies the corresponding *productui-row* Component and invokes that *productui-row* Component's *visibility()* method

- the *productui-row* Component's *visibility()* method displays or hides the entire table row Component, depending on the product's *stocked* property and the checkbox's *only_instock* value.


## Enabling the Search Bar to filter the products that are displayed in the UI

To enable product filtering, we just need to make a few additional changes as follows:

### productui-searchbar Component

Add a *keyup* event handler to the searchbar input tag:

        <input type="text" placeholder="Search..." golgi:on_keyup="filter" />

This will trigger a method named *filter()* after every keystroke within the input tag, so next we need to add that method:

        filter(e) {
          this.context.filter = e.target.value.toLowerCase();
          this.context.table.reformat(this.only_instock);
        }

As you can see, we're going to create another *Context* Object property which will be a lower-cased copy of whatever is now in the searchbar text field.  We then rerun the *productui-table* Component's *reformat()* method.

There's one more thing we need to do: initialise this *Context* Object *filter* property when the *productui-searchbar* Component is rendered.  So add this to the *onBeforeState()* lifecycle method:

        onBeforeState() {
          this.only_instock = false;
          this.context.filter = '';
        }

In summary, the *productui-searchbar* Component should now look like this:

            export function load() {
            
              let componentName = 'productui-searchbar';
            
              customElements.define(componentName, class productui_searchbar extends HTMLElement {
                constructor() {
                  super();
                  const html = `
        <input type="text" placeholder="Search..." golgi:on_keyup="filter" />
        <p>
          <input type="checkbox" golgi:on_click="checked" />
          &nbsp;Only show products in stock
        </p>
                  `;
            
                  this.html = `${html}`;
                }

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
            
              });
            };


### productui-table Component

We just need to amend this Component's *reformat()* method as follows:

        reformat(only_instock) {
          for (const [index, product] of this.context.PRODUCTS.entries()) {
            let row = this.rows[index];
            if (this.context.filter !== '') {
              if (product.name.toLowerCase().includes(this.context.filter)) {
                row.visibility(only_instock, product.stocked);
              }
              else {
                row.hide();
              }
            }
            else {
              row.visibility(only_instock, product.stocked);
            }
          }
        }

In other words, we've added logic that checks for a non-empty filter value, and if found, it hides the product if its name doesn't include the filter text.  If it does, then it will apply the original *visibility()* method that will hide the product if it isn't in stock.

In summary, the *productui-table* Component should now look like this:

        export function load() {

          let componentName = 'productui-table';
          
          customElements.define(componentName, class productui_table extends HTMLElement {
            constructor() {
              super();
              const html = `
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody golgi:prop="tbody"></tbody>
        </table>
              `;
              this.html = `${html}`;
            }

            onBeforeState() {
              this.rows = [];
              this.context.table = this;
            }

            async populate() {
              let categoryFound = {};

              for (const [index, product] of this.context.PRODUCTS.entries()) {
                if (!categoryFound[product.category]) {
                  categoryFound[product.category] = true;
                  let crow = await this.renderComponent('productui-category-row', this.tbody, this.context);
                  crow.setState(product);
                }
                let row = await this.renderComponent('productui-row', this.tbody, this.context);
                row.setState(product);
                this.rows.push(row);
              }
            }

            reformat(only_instock) {
              for (const [index, product] of this.context.PRODUCTS.entries()) {
                let row = this.rows[index];
                if (this.context.filter !== '') {
                  if (product.name.toLowerCase().includes(this.context.filter)) {
                    row.visibility(only_instock, product.stocked);
                  }
                  else {
                    row.hide();
                  }
                }
                else {
                  row.visibility(only_instock, product.stocked);
                }
              }
            }

          });
        };


### Try it Out

That should be everything we need to implement the interactuve filtering behaviour.

You should now be ready to try out this new version.  Remember, there's no bundle/compile step with Golgi - your newly-modified Component and Assembly modules are immediately ready to run.

So, reload the *index.html* page in your browser.  Note: you may find you need to clear the browser's cache first to ensure that the latest edited versions of all the modules are loaded.

Now see what happens when you type into the searchbar text field!


# Next Steps

That completes a basic, simple but fully operational version of the Example Application.

You can compare this against the way in which the original React version would have been implemented.

However, Golgi has some additional, more advanced features that we can use to improve and optimise the implementation logic.  To find out more, read [Chapter 3](./GOLGI_CF_REACT_3.md).


