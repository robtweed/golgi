let golgi_components = [];
golgi_components.push({n:'productui-category-row',f:function load(t){let e="productui-category-row",o=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),o++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML=`<style>.td {
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
}</style><div class="td colspan">golgi:bind=category</div>`,this.name=e+"-"+o}})}});
golgi_components.push({n:'productui-row',f:function load(t){let s="productui-row",i=-1;customElements.define(s,class extends HTMLElement{constructor(){super(),i++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML=`<style>.td {
  display: table-cell;
}
:host {
  display: table-row;
}</style><div class="td" status="golgi:bind=status; golgi:observer=setVisibility" style="golgi:bind=style">golgi:bind=name</div><div class="td">golgi:bind=price</div>`,this.name=s+"-"+i}onBeforeState(){this.observerStart()}setVisibility(t){"show"===t&&this.show(),"hide"===t&&this.hide()}show(){this.style="display: '';"}hide(){this.style="display: none;"}})}});
golgi_components.push({n:'productui-searchbar',f:function load(t){let e="productui-searchbar",o=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),o++;this.html='<input type="text" placeholder="Search..." golgi:on_keyup="filter"><p><input type="checkbox" golgi:on_click="checked"> &nbsp;Only show products in stock</p>',this.name=e+"-"+o}onBeforeState(){this.only_instock=!1,this.context.filter=""}filter(t){this.context.filter=t.target.value.toLowerCase(),this.context.table.reformat(this.only_instock)}checked(){this.only_instock=!this.only_instock,this.context.table.reformat(this.only_instock)}})}});
golgi_components.push({n:'productui-table',f:function load(t){let e="productui-table",o=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),o++;this.html='<table><thead><tr><th>Name</th><th>Price</th></tr></thead><tbody golgi:prop="tbody"></tbody></table>',this.name=e+"-"+o}onBeforeState(){this.context.table=this}async populate(){var t,e,o={};for([t,e]of this.context.PRODUCTS.entries()){var r="product"+t;o[e.category]||(o[e.category]=!0,(await this.renderComponent("productui-category-row",this.tbody,this.context)).addStateMap(r)),(await this.renderComponent("productui-row",this.tbody,this.context)).addStateMap(r),e.stocked?e.style="color: black;":e.style="color: red;",this.golgi_state[r]=e}}reformat(e){function t(t){return!e||t?"show":"hide"}for(var[o,r]of this.context.PRODUCTS.entries())""===this.context.filter||r.name.toLowerCase().includes(this.context.filter)?r.status=t(r.stocked):r.status="hide",this.golgi_state["product"+o]=r}})}});
export {golgi_components}