let golgi_assemblies = [];
golgi_assemblies.push({name:'filterable-product-table',code:function load(e){return{gjson:[{componentName:"productui-searchbar",state:{},assemblyName:"filterable-product-table"},{componentName:"productui-table",state:{"golgi:hook":"initialise"},hook:function(){e.PRODUCTS=[{category:"Sporting Goods",price:"$49.99",stocked:!0,name:"Football"},{category:"Sporting Goods",price:"$9.99",stocked:!0,name:"Baseball"},{category:"Sporting Goods",price:"$29.99",stocked:!1,name:"Basketball"},{category:"Electronics",price:"$99.99",stocked:!0,name:"iPod Touch"},{category:"Electronics",price:"$399.99",stocked:!1,name:"iPhone 5"},{category:"Electronics",price:"$199.99",stocked:!0,name:"Nexus 7"}],this.populate()},assemblyName:"filterable-product-table"}]}}});
export {golgi_assemblies}