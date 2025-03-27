# Developing With Golgi: A Comparison With React.js - Chapter 3

In Chapters 1  and 2 we used Golgi to develop a fully-working version of the Example Application from the 
[**Thinking in React**](https://reactjs.org/docs/thinking-in-react.html) tutorial.

You may have noticed that this initial version of the application required us to keep track of certain Components, and to explicitly apply state values to them.

Golgi includes an advanced state-management/data-binding feature that is based on a Proxy Object which Golgi makes accessible to all Assemblies and Components within an application:

        this.golgi_state

You can add properties to this Proxy Object and map them to one or more Golgi Components.  Usually you'll make these properties objects with specified values.  Within the mapped Components, you can bind properties of the mapped object to:

- tag attributes
- tag textContent

Having done this, any changes you make to a mapped *golgi_state* sub-object will be reflected immediately and automatically within the Component(s) to which it's mapped.  In other words, you can let the *golgi_state* mapping find the associated Components automatically for you, without having to keep track of them yourself.

Let's see how we can use this advanced feature to optimise and simplify our application's logic.

## productui-category-row Component

Change the *div* tag to this:

        <div class="td colspan">golgi:bind=category</div>

By specifiying the special *golgi:bind* directive as the *div* tag's textContent value, we can bind a state-mapped property to the tag's textcontent value.

In this case we're mapping a property named *category* to the *div* tag's textContent.

Next, we can now remove the *setState()* method, because we no longer need to explicitly set the state for instances of this Component 

In summary, the *product-category-row* Component should look like this:

        export function load() {
            
          let componentName = 'productui-category-row';
            
          customElements.define(componentName, class productui_category_row extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: 'open' });
              const html = `
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
              `;
              this.shadowRoot.innerHTML = `${html}`;
            }
           
          });
        };


## productui-row Component

Change the two *div* tags to the following:

  <div class="td" style="golgi:bind=style">golgi:bind=name</div>
  <div class="td">golgi:bind=price</div>

Notes:

- we're binding a mapped object's *name* property to the first *div*'s textContent value
- we're binding a mapped object's *price* property to the second *div*'s textContent value
- we're binding a mapped object's *style* property to the first *div*'s *style* attribute value.

Next, remove the *setState()* method.

In summary, the *product-row* Component should look like this:

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
        <div class="td" style="golgi:bind=style">golgi:bind=name</div>
        <div class="td">golgi:bind=price</div>
              `;
              this.shadowRoot.innerHTML = `${html}`;
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



## productui-table Component

We now need to modify the logic of this Component's *populate()* method to use Golgi's State Map to populate and style the table's cells

Within the Component's *populate()* method, define and record the state name at each iteration through the PRODUCTS array:

        for (const [index, product] of this.context.PRODUCTS.entries()) {
          let state_name = 'product' + index;

Then, for each rendered *productui-category-row* Component, map this state name to the Component using Golgi's *addStateMap()* method:

        let crow = await this.renderComponent('productui-category-row', this.tbody, this.context);
        crow.addStateMap(state_name);  // <======= 

Do the same for each rendered *productui-row* Component, mapping this same state name to it:

        let row = await this.renderComponent('productui-row', this.tbody, this.context);
        this.rows.push(row);
        row.addStateMap(state_name);   // <=======

Next, we're going to augment the *product* object at each iteration with a new property named *style*, whose value depends on the product.stocked value:

        if (product.stocked) {
          product.style = 'color: black;'; 
        }
        else {
          product.style = 'color: red;'; 
        }

If you remember from earlier, this *style* property was bound to the *productui-row* Component's name *div* tag:

        <div class="td" style="golgi:bind=style">golgi:bind=name</div>


The last remaining step is to populate the mapped property with the product object at each iteration:

        this.golgi_state[state_name] = product;

As a result, the *golgi_state* Proxy Object's *set* trap will automatically update the data-bound fields in all mapped Components.


In summary, the *product-table* Component should look like this:

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
                let state_name = 'product' + index;
                if (!categoryFound[product.category]) {
                  categoryFound[product.category] = true;
                  let crow = await this.renderComponent('productui-category-row', this.tbody, this.context);
                  crow.addStateMap(state_name);
                }
                let row = await this.renderComponent('productui-row', this.tbody, this.context);
                this.rows.push(row);
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


## Try it Out

That should be everything we need to reimplement the application using Golgi's state mapping.

You should now be ready to try out this new version.  Remember, there's no bundle/compile step with Golgi - your newly-modified Component and Assembly modules are immediately ready to run.

So, reload the *index.html* page in your browser.  Note: you may find you need to clear the browser's cache first to ensure that the latest edited versions of all the modules are loaded.

Everything should work exactly as before.


# Next Steps

The interactive behaviour of the application is still using the original logic.

In the next [Chapter](./GOLGI_CF_REACT_4.md), you'll see how we can use Golgi's built-in MutationObserver functionality to further optimise and simplify this interactive behaviour.


