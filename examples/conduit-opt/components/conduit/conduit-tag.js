function load(){let t="conduit-tag",e=-1;customElements.define(t,class extends HTMLElement{constructor(){super(),e++;this.html='<a class="tag-pill tag-default" href="#">golgi:bind</a>',this.name=t+"-"+e}setState(t){t.name&&(this.name=t.name)}})}export{load};