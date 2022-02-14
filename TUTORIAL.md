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


You should see the text:

      This is Golgi!




