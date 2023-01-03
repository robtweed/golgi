# Developing With Golgi: A Comparison With React.js - Chapter 4

In Chapters 1 and 2 we've used Golgi to develop a fully-working version of the Example Application from the 
[**Thinking in React**](https://reactjs.org/docs/thinking-in-react.html) tutorial, and in Chapter 3 we demonstrated how Golgi's *golgi_state* Proxy Object can be used to simplify data binding within Components.

The interactive behaviour of our Example Application still requires us to be able to locate the *productui-row* Components that dynamically populate the table, in order to hide or re-show them.

In this Chapter, we'll further optimise the Example Application, and demonstrate how Golgi's integrated MutationObserver functionality can work in conjunction with the *golgi_state* Proxy Object-based data-binding to implement the interactive behaviour in a completely automated way.

## About MutationObserver

Alll modern browsers now implement a feature known as MutationObserver, which provides a way to detect and handle changes to the DOM.

Golgi integrates the MutationObserver functionality in a way that makes it straightforward to make use of it in any Component.

## How We Can Make Use of MutationObserver

In our Example Application, we have two user-invoked interactions that we need to handle:

- if the checkbox is checked, hide the rows for products that are out of stock, and, when unchecked, reveal those hidden rows again

- if text is entered into the searchbar field, display only those rows for product names containing the search string

In the previous chapter we implemented basic logic to do this by explicitly showing and hiding each Component when iterating the PRODUCT array.

MutationObserver gives us another, very slick way to do the same thing:

- while iterating the PRODUCT array, we could determine whether the associated row should be displayed or not, and create a new property in the product object - *status* - that has a value of either *show* or *hide*

- add a custom attribute - *status* - to the first *div* tag in the *productui-row* Component, and bind its value to the *product.status* property

- add a MutationObserver callback method to the *productui-row* Component that detects changes to the *div* tag's *status* attribute, and invokes the Component's *hide()* or *show()* method as appropriate.

Let's now see how this can be done.

## productui-row* Component

Most of the changes need to be made within this Component.

First, add a custom attribute - *status* to the first *div* tag and bind its value to a property named *status*:

        <div class="td" status="golgi:bind=status; golgi:observer=setVisibility" style="golgi:bind=style">golgi:bind=name</div>

Quite a lot of data binding going on in this tag now!

You'll also notice that the *status* attribute not only specifies a *golgi:bind* (binding its value to the Golgi state-mapped *status* property), it also specifies another Golgi directive - *golgi:observer*.  Note how such multiple Golgi directives are separated by a semi-colon.

This *golgi:observer* directive is saying:

- whenever the *status* attribute's value changes, trigger a method within the Component that is named *setVisibility()*.


So, the next thing we'll do is to add that *setVisibility()* method to the Component:

        applyStatus(value) {
          if (value === 'show') this.show();
          if (value === 'hide') this.hide();
        }

A *golgi:observer* method can take two arguments:

- the first, as shown above, is the new value of the attribute
- the second, optional, argument (not used in this case) is the previous/old value of the attribute.

So you can see that we're showing or hiding the entire *productui-row* Component, depending on the value of the *status* attribute which, in turn, is provided by Golgi's state-mapped object's *status* property.


Finally, we'll remove the previous *visibility()* method from the Component

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
        <div class="td" status="golgi:bind=status; golgi:observer=setVisibility" style="golgi:bind=style">golgi:bind=name</div>
        <div class="td">golgi:bind=price</div>
              `;
              this.shadowRoot.innerHTML = `${html}`;
            }

            setVisibility(value) {
              if (value === 'show') this.show();
              if (value === 'hide') this.hide();
            }

            show() {
              this.style = "display: '';";
            }

            hide() {
              this.style = "display: none;";
            }

          });
        };


## productui-table Component

We now need to modify the logic of the *reformat()* method within this Component.

        reformat(only_instock) {

          function visibility(stocked) {
            if (only_instock) {
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


Note that we've essentially moved the *visibility()* method that was originally in the *productui-row* Component and added it as a function within the *reformat()* method.  Note, however, that it now returns a text string value of either *show* or *hide* depending on the status of the searchbar and checkbox and whether or not the product is in stock.

On each iteration of the *reformat()* method through the PRODUCT array, it now adds a *status* property to the *product* object, which will have a value of either *show* or *hide*.  It then sets the value of the row's associated *golgi_state* Object to this product object.

As a result, the *golgi_state[product{rowNo}]* properties will update the corresponding mapped Component's bound properties, which, it turn, will trigger its MutationObserver callback method.

You'll see that we no longer need the *this.rows* array to keep track of each *productui-row* Component, so we can change the *onBeforeState()* lifecycle method to simply:

        onBeforeState() {
          this.context.table = this;
        }

and remove the maintenance of *this.rows* from the *populate()* method:

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

In summary, this latest version of the *productui-table* Component should now look like this:

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

          });
        };



## Try it Out

That should be everything we need to reimplement the application's interactive functionality using MutationObserver.

You should now be ready to try out this new version.  Remember, there's no bundle/compile step with Golgi - your newly-modified Component and Assembly modules are immediately ready to run.

So, reload the *index.html* page in your browser.  Note: you may find you need to clear the browser's cache first to ensure that the latest edited versions of all the modules are loaded.

Everything should work exactly as before.

The difference in this version is that our *reformat()* method does not need to locate and keep track of the dynamically-rendered *productui-row* Components.  The mapping to the associated row is now simply determined by the property name we use in the *golgi_state* Proxy Object for each row, which is intuitively constructed from the text string 'product' appended with the array index value at each iteration of the array.  Golgi's state mapping then does the rest for us!


# Next Steps

We now have a fully working version of the Example Application, written using all the advanced features of Golgi.

In the next [Chapter](./GOLGI_CF_REACT_5.md), you'll see how we can use Golgi's optional server-side tools to optimise the loading performance of our application so that it starts up almost instantly.



