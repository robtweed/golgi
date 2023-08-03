let golgi_components = [];
golgi_components.push({n:'sbadmin-root',f:function load(t){let e="sbadmin-root",o=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),o++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>span{font-family:Metropolis,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.topnav{z-index:1039;position:fixed;top:0;right:0;left:0;padding-left:0;height:3.625rem;z-index:1039;font-size:.9rem}.shadow{box-shadow:0 .15rem 1.75rem 0 rgba(33,40,50,.15)!important}.navbar{position:relative;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;padding-top:.5rem;padding-bottom:.5rem}.navbar-expand{flex-wrap:nowrap;justify-content:flex-start}.bg-topnav{--bs-bg-opacity:1;background-color:#bdddf6}#layoutSidenav{display:flex}.topnav #layoutSidenav #layoutSidenav_nav{width:15rem;height:100vh;z-index:1038}.topnav #layoutSidenav #layoutSidenav_nav{position:fixed;top:0;right:0;left:0;z-index:1030}#layoutSidenav #layoutSidenav_nav{flex-basis:15rem;flex-shrink:0;transition:transform .15s ease-in-out;z-index:1038;transform:translateX(-15rem)}.topnav #layoutSidenav #layoutSidenav_nav .sidenav{padding-top:3.625rem}.sidenav-light{background-color:#fff;color:#212832}.sidenav{display:flex;flex-direction:column;height:100%;flex-wrap:nowrap;font-size:.9rem}.shadow-right{box-shadow:.15rem 0 1.75rem 0 rgba(33,40,50,.15)!important}.navbar-nav-scroll{max-height:100%;overflow-y:auto}.sidenav-toggled #layoutSidenav #layoutSidenav_nav{transform:translateX(0)}.sidenav-toggled #layoutSidenav #layoutSidenav_content:before{content:"";display:block;position:absolute;top:0;left:0;width:100%;height:100%;background:#000;z-index:1037;opacity:.5;transition:opacity .3s ease-in-out}#layoutSidenav #layoutSidenav_content{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-width:0;flex-grow:1;min-height:calc(100vh - 3.625rem);margin-left:-15rem}.px-4{padding-right:1.5rem!important;padding-left:1.5rem!important}.py-4{padding-top:1.5rem!important;padding-bottom:1.5rem!important}.container-fluid{width:100%;padding-right:var(--bs-gutter-x,.75rem);padding-left:var(--bs-gutter-x,.75rem);margin-right:auto;margin-left:auto}.bg-light{--bs-bg-opacity:1;background-color:rgba(248,249,250),var(--bs-bg-opacity) )}.mt-auto{margin-top:auto!important}.align-items-center{align-items:center!important}.justify-content-between{justify-content:space-between}.justify-content-center{justify-content:center}.d-flex{display:flex!important}.small,small{font-size:.875em}@media (min-width:992px){#layoutSidenav #layoutSidenav_nav{transform:translateX(0)}#layoutSidenav #layoutSidenav_content{margin-left:0;transition:margin .15s ease-in-out}.sidenav-toggled #layoutSidenav #layoutSidenav_nav{transform:translateX(-15rem)}.sidenav-toggled #layoutSidenav #layoutSidenav_content{margin-left:-15rem}.sidenav-toggled #layoutSidenav #layoutSidenav_content:before{display:none}}*,::after,::before{box-sizing:border-box}</style><span><nav class="topnav navbar navbar-expand shadow navbar-mgw bg-topnav" golgi:prop="topbarTarget"></nav><div id="layoutSidenav"><div id="layoutSidenav_nav"><nav class="sidenav shadow-right sidenav-light navbar-nav-scroll" id="sidenavAccordion" golgi:prop="sidebarTarget"></nav></div><div id="layoutSidenav_content" golgi:prop="contentTag"><main><div class="container-fluid px-4" golgi:prop="contentTarget"></div></main><footer class="py-4 bg-light mt-auto" golgi:prop="footerTag"><div class="container-fluid px-4"><div class="d-flex align-items-center justify-content-between small" golgi:prop="footerTarget"></div></div></footer></div></div></span>',this.name=e+"-"+o}getMenuItemActive(){return this.ActiveMenuComponent}setMenuItemActive(t){this.ActiveMenuComponent=t}addToPage2MenuMap(t,e){this.page2MenuMap.set(t,e)}setPageActive(t,e){var o,a=this.page2MenuMap.get(t);a&&((o=this.getMenuItemActive())&&o.setInactive(),a.setActive(),this.setMenuItemActive(a));let n;for(n of this.contentPages.values())n.hide();(n=this.contentPages.get(t))&&(n.show(),n.onSelected)&&n.onSelected.call(n,e)}async switchToPage(t,e){this.contentPages.has(t)||(this.context.assemblyName=t,await this.renderAssembly(t,this.contentTarget,this.context)),this.setPageActive(t,e)}setState(t){t.header_bg_color&&(this.topbarTarget.style.backgroundColor=t.header_bg_color),t.header_bg_colour&&(this.topbarTarget.style.backgroundColor=t.header_bg_colour),t.sidebar_bg_color&&(this.sidebarTarget.style.backgroundColor=t.sidebar_bg_color),t.sidebar_bg_colour&&(this.sidebarTarget.style.backgroundColor=t.sidebar_bg_colour),t.footer_bg_color&&(this.footerTag.style.backgroundColor=t.footer_bg_color),t.footer_bg_colour&&(this.footerTag.style.backgroundColor=t.footer_bg_colour),t.content_bg_color&&(this.contentTag.style.backgroundColor=t.content_bg_color),t.content_bg_colour&&(this.contentTag.style.backgroundColor=t.content_bg_colour),t.header_text_color&&(this.topbarTarget.style.color=t.header_text_color),t.header_text_colour&&(this.topbarTarget.style.color=t.header_text_colour),t.sidebar_text_color&&(this.sidebarTarget.style.color=t.sidebar_text_color),t.sidebar_text_colour&&(this.sidebarTarget.style.color=t.sidebar_text_colour),t.footer_text_color&&(this.footerTag.style.color=t.footer_text_color),t.footer_text_colour&&(this.footerTag.style.color=t.footer_text_colour),t.content_text_color&&(this.contentTag.style.color=t.content_text_color),t.content_text_colour&&(this.contentTag.style.color=t.content_text_colour)}async onBeforeState(){this.contentPages=new Map,this.page2MenuMap=new Map,this.childrenTarget=this.contentTarget,this.context.toSVG=function(e){if("undefined"!=typeof feather){var o=e.getAttribute("data-feather");if(o){let t=feather.icons[o];o=(t=t||feather.icons["help-circle"]).toSvg(),o=(new DOMParser).parseFromString(o,"image/svg+xml").querySelector("svg");e.parentNode.replaceChild(o,e)}}}}})}});
golgi_components.push({n:'sbadmin-sidebar-toggle',f:function load(e){let t="sbadmin-sidebar-toggle",r=-1;customElements.define(t,class extends HTMLElement{constructor(){super(),r++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.ms-lg-2{margin-left:.5rem!important}.me-2{margin-right:.5rem!important}*,::after,::before{box-sizing:border-box}[type=button]:not(:disabled),[type=reset]:not(:disabled),[type=submit]:not(:disabled),button:not(:disabled){cursor:pointer}button{-webkit-appearance:button;text-transform:none}.btn-transparent-dark{background-color:transparent;border-color:transparent;color:rgba(3,4,5,.5)}.btn-icon{padding:0;justify-content:center;overflow:hidden;border-radius:100%;flex-shrink:0;height:calc((.875rem * 1) + (.875rem * 2) + (2px))!important;width:calc((.875rem * 1) + (.875rem * 2) + (2px))!important}.btn{display:inline-flex;margin:0;align-items:center;justify-content:center;font-weight:400;line-height:1;color:#69707a;text-align:center;vertical-align:middle;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:transparent;border:1px solid transparent;padding:0;font-size:.875rem;border-radius:.35rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}.order-1{order:1!important}.btn-icon .feather{margin-top:0!important}.btn .feather{margin-top:-1px;height:.875rem;width:.875rem}.feather{height:1rem;width:1rem;vertical-align:top}@media (min-width:992px){.ms-lg-2{margin-left:.5rem!important}}@media (min-width:992px){.me-lg-0{margin-right:0!important}}@media (min-width:992px){.order-lg-0{order:0!important}}</style><button class="btn btn-icon btn-transparent-dark order-1 order-lg-0 me-2 ms-lg-2 me-lg-0" href="#!" golgi:on_click="toggle"><i data-feather="menu" golgi:prop="icon"></i></button>',this.name=t+"-"+r}setState(e){e.name&&(this.name=e.name),e.color&&(this.rootElement.style.color=e.color)}toggle(e){e.preventDefault(),this.getParentComponent("sbadmin-root").rootElement.classList.toggle("sidenav-toggled")}onAfterHooks(){this.context.toSVG(this.icon)}})}});
golgi_components.push({n:'sbadmin-brand',f:function load(t){let e="sbadmin-brand",n=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),n++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.navbar-brand{width:15rem;margin:0;font-size:1rem;font-weight:700;color:rgba(189,221,246,.9);padding-top:.3125rem;padding-bottom:.3125rem;margin-right:1rem;font-size:1.25rem;white-space:nowrap}.ps-3{padding-left:1rem!important}.txt-black{color:#000;font-weight:700}a{color:#0061f2;text-decoration:none}*,::after,::before{box-sizing:border-box}</style><a class="navbar-brand ps-3" href="#"><span class="txt-black" golgi:prop="childrenTarget"></span></a>',this.name=e+"-"+n}setState(t){var e;t.name&&(this.name=t.name),t.text&&(this.childrenTarget.textContent=t.text),t.textContent&&(this.childrenTarget.textContent=t.textContent),t.href&&(this.rootElement.href=t.href),t.img&&((e=document.createElement("img")).src=t.img,e.setAttribute("height",56),this.rootElement.appendChild(e)),t.color&&(this.childrenTarget.style.color=t.color)}})}});
golgi_components.push({n:'sbadmin-footer-text',f:function load(t){let e="sbadmin-footer-text",o=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),o++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.txt-small{font-size:10px}</style><div class="txt-small" golgi:prop="textTag"></div>',this.name=e+"-"+o}setState(t){var e;t.name&&(this.name=t.name),t.text&&(this.rootElement.textContent=t.text),t.textContent&&(this.rootElement.textContent=t.textContent),!0===t.center&&((e=this.rootComponent.footerTarget).classList.remove("justify-content-between"),e.classList.add("justify-content-center")),t.color&&(this.rootElement.style.color=t.color)}})}});
golgi_components.push({n:'sbadmin-sidebar-menu',f:function load(e){let n="sbadmin-sidebar-menu",t=-1;customElements.define(n,class extends HTMLElement{constructor(){super(),t++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.sidenav-menu{flex-grow:1}.sidenav-menu .nav{flex-direction:column;flex-wrap:nowrap}*,::after,::before{box-sizing:border-box}</style><div class="sidenav-menu"><div class="nav accordion" golgi:prop="childrenTarget"></div>',this.name=n+"-"+t}setState(e){e.name&&(this.name=e.name)}onBeforeState(){this.childrenTarget.id="sideNav_"+this.name,this.style="flex-grow: 1;"}})}});
golgi_components.push({n:'sbadmin-sidebar-heading',f:function load(e){let t="sbadmin-sidebar-heading",n=-1;customElements.define(t,class extends HTMLElement{constructor(){super(),n++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.sidenav-menu-heading{padding:1.75rem 1rem .75rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#a7aeb8;list-style:none}*,::after,::before{box-sizing:border-box}</style><div class="sidenav-menu-heading"></div>',this.name=t+"-"+n}setState(e){e.name&&(this.name=e.name),e.text&&(this.rootElement.textContent=e.text)}})}});
golgi_components.push({n:'sbadmin-sidebar-menu-item',f:function load(e){let t="sbadmin-sidebar-menu-item",i=-1;customElements.define(t,class extends HTMLElement{constructor(){super(),i++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.nav-link.active{font-weight:600;color:#0061f2}.nav-link{color:#212832;display:flex;align-items:center;line-height:normal;padding-top:.75rem;padding-bottom:.75rem;position:relative;padding:.5rem 1rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out}a{text-decoration:none;font-size:.9rem}.nav-link.active .nav-link-icon{color:#0061f2}.nav-link .nav-link-icon{color:#a7aeb8;margin-right:.5rem;font-size:.9rem;padding-right:.5rem;display:inline-flex}*,::after,::before{box-sizing:border-box}</style><a class="nav-link" golgi:prop="aTag" href="#" golgi:on_click="switchPage"><div golgi:prop="iconDiv" class="nav-link-icon"><i golgi:prop="iconElement"></i></div><span golgi:prop="textTarget"></span></a>',this.name=t+"-"+i}onBeforeState(){this.hasIcon=!0}setState(e){e.name&&(this.name=e.name),e.contentPage&&(this.contentPage=e.contentPage,this.rootComponent.addToPage2MenuMap(e.contentPage,this)),e.text&&(this.textTarget.textContent=e.text),e.iconName&&(this.iconElement.setAttribute("data-feather",e.iconName),this.iconName=e.iconName),e.iconName||(this.aTag.removeChild(this.iconDiv),this.hasIcon=!1),e.href&&(this.aTag.href=e.href),!0===e.active&&this.switchPage()}setActive(){this.aTag.classList.add("active")}setInactive(){this.aTag.classList.remove("active")}switchPage(){var e=this.rootComponent,t=e.getMenuItemActive();t&&t.setInactive(),this.setActive(),e.setMenuItemActive(this),e.switchToPage(this.contentPage),e.menuHidden&&e.rootElement.classList.toggle("sidenav-toggled")}onAfterHooks(){"undefined"!=typeof feather&&this.hasIcon&&this.context.toSVG(this.iconElement)}})}});
golgi_components.push({n:'sbadmin-content-page',f:function load(e){let t="sbadmin-content-page",o=-1;customElements.define(t,class extends HTMLElement{constructor(){super(),o++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.collapse:not(.show){display:none}*,::after,::before{box-sizing:border-box}</style><div class="collapse multi-collapse"></div>',this.name=t+"-"+o}setState(e){e.name&&(this.name=e.name)}show(){this.rootElement.classList.add("show")}hide(){this.rootElement.classList.remove("show")}onBeforeHooks(){this.name=this.context.assemblyName,this.rootComponent.contentPages.set(this.name,this),this.onSelected=function(e){(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)<992&&this.rootComponent.rootElement.classList.remove("sidenav-toggled"),this.emit("selected",this)}}})}});
golgi_components.push({n:'sbadmin-content-heading',f:function load(t){let e="sbadmin-content-heading",n=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),n++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.mt-4{margin-top:1.5rem!important}.text-center{text-align:center}.text-left{text-align:left}.text-right{text-align:right}</style><h1 class="mt-4"></h1>',this.name=e+"-"+n}setState(t){t.name&&(this.name=t.name),t.text&&(this.rootElement.textContent=t.text),t.position&&this.rootElement.classList.add("text-"+t.position)}})}});
golgi_components.push({n:'sbadmin-row',f:function load(t){let e="sbadmin-row",r=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),r++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.row{--bs-gutter-x:1.5rem;--bs-gutter-y:0;display:flex;flex-wrap:wrap;margin-top:calc(-1 * var(--bs-gutter-y));margin-right:calc(-.5 * var(--bs-gutter-x));margin-left:calc(-.5 * var(--bs-gutter-x))}.row-cols-auto>*{flex:0 0 auto;width:auto}.row-cols-1>*{flex:0 0 auto;width:100%}.row-cols-2>*{flex:0 0 auto;width:50%}.row-cols-3>*{flex:0 0 auto;width:33.3333333333%}.row-cols-4>*{flex:0 0 auto;width:25%}.row-cols-5>*{flex:0 0 auto;width:20%}.row-cols-6>*{flex:0 0 auto;width:16.6666666667%}.justify-content-start{justify-content:flex-start!important}.justify-content-end{justify-content:flex-end!important}.justify-content-center{justify-content:center!important}.justify-content-between{justify-content:space-between!important}.justify-content-around{justify-content:space-around!important}.justify-content-evenly{justify-content:space-evenly!important}.g-0,.gy-0{--bs-gutter-y:0}.g-1,.gx-1{--bs-gutter-x:0.25rem}.g-1,.gy-1{--bs-gutter-y:0.25rem}.g-2,.gx-2{--bs-gutter-x:0.5rem}.g-2,.gy-2{--bs-gutter-y:0.5rem}.g-3,.gx-3{--bs-gutter-x:1rem}.g-3,.gy-3{--bs-gutter-y:1rem}.g-4,.gx-4{--bs-gutter-x:1.5rem}.g-4,.gy-4{--bs-gutter-y:1.5rem}.g-5,.gx-5{--bs-gutter-x:2.5rem}.g-5,.gy-5{--bs-gutter-y:2.5rem}.g-10,.gx-10{--bs-gutter-x:6rem}.g-10,.gy-10{--bs-gutter-y:6rem}.g-15,.gx-15{--bs-gutter-x:9rem}.g-15,.gy-15{--bs-gutter-y:9rem}.text-start{text-align:left!important}.text-end{text-align:right!important}.text-center{text-align:center!important}</style><span class="row">',this.name=e+"-"+r}setState(t){if(t.name&&(this.name=t.name),t.cls){t=t.cls.split(" ");let e=this;t.forEach(function(t){e.rootElement.classList.add(t)})}}set cls(t){this.setState({cls:t})}})}});
golgi_components.push({n:'sbadmin-card',f:function load(t){let r="sbadmin-card",o=-1;customElements.define(r,class extends HTMLElement{constructor(){super(),o++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>div{--bs-blue:#0d6efd;--bs-indigo:#6610f2;--bs-purple:#6f42c1;--bs-pink:#d63384;--bs-red:#dc3545;--bs-orange:#fd7e14;--bs-yellow:#ffc107;--bs-green:#198754;--bs-teal:#20c997;--bs-cyan:#0dcaf0;--bs-white:#fff;--bs-gray:#6c757d;--bs-gray-dark:#343a40;--bs-gray-100:#f8f9fa;--bs-gray-200:#e9ecef;--bs-gray-300:#dee2e6;--bs-gray-400:#ced4da;--bs-gray-500:#adb5bd;--bs-gray-600:#6c757d;--bs-gray-700:#495057;--bs-gray-800:#343a40;--bs-gray-900:#212529;--bs-primary:#0d6efd;--bs-secondary:#6c757d;--bs-success:#198754;--bs-info:#0dcaf0;--bs-warning:#ffc107;--bs-danger:#dc3545;--bs-light:#f8f9fa;--bs-dark:#212529;--bs-primary-rgb:13,110,253;--bs-secondary-rgb:108,117,125;--bs-success-rgb:25,135,84;--bs-info-rgb:13,202,240;--bs-warning-rgb:255,193,7;--bs-danger-rgb:220,53,69;--bs-light-rgb:248,249,250;--bs-dark-rgb:33,37,41;--bs-white-rgb:255,255,255;--bs-black-rgb:0,0,0;--bs-body-color-rgb:33,37,41;--bs-body-bg-rgb:255,255,255;--bs-font-sans-serif:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--bs-font-monospace:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--bs-gradient:linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));--bs-body-font-family:var(--bs-font-sans-serif);--bs-body-font-size:1rem;--bs-body-font-weight:400;--bs-body-line-height:1.5;--bs-body-color:#212529;--bs-body-bg:#fff}.card{box-shadow:0 .15rem 1.75rem 0 rgb(33 40 50 / 15%);position:relative;display:flex;flex-direction:column;min-width:0;word-wrap:break-word;background-color:#fff;background-clip:border-box;border:1px solid rgba(33,40,50,.125);border-radius:.35rem}.card-center{margin:auto}.bg-primary{--bs-bg-opacity:1;background-color:rgba(var(--bs-primary-rgb),var(--bs-bg-opacity))!important}.bg-secondary{--bs-bg-opacity:1;background-color:rgba(var(--bs-secondary-rgb),var(--bs-bg-opacity))!important}.bg-success{--bs-bg-opacity:1;background-color:rgba(var(--bs-success-rgb),var(--bs-bg-opacity))!important}.bg-info{--bs-bg-opacity:1;background-color:rgba(var(--bs-info-rgb),var(--bs-bg-opacity))!important}.bg-warning{--bs-bg-opacity:1;background-color:rgba(var(--bs-warning-rgb),var(--bs-bg-opacity))!important}.bg-danger{--bs-bg-opacity:1;background-color:rgba(var(--bs-danger-rgb),var(--bs-bg-opacity))!important}.bg-light{--bs-bg-opacity:1;background-color:rgba(var(--bs-light-rgb),var(--bs-bg-opacity))!important}.bg-dark{--bs-bg-opacity:1;background-color:rgba(var(--bs-dark-rgb),var(--bs-bg-opacity))!important}.bg-black{--bs-bg-opacity:1;background-color:rgba(var(--bs-black-rgb),var(--bs-bg-opacity))!important}.bg-white{--bs-bg-opacity:1;background-color:rgba(var(--bs-white-rgb),var(--bs-bg-opacity))!important}.bg-body{--bs-bg-opacity:1;background-color:rgba(var(--bs-body-bg-rgb),var(--bs-bg-opacity))!important}.bg-transparent{--bs-bg-opacity:1;background-color:transparent!important}.text-secondary{--bs-text-opacity:1;color:rgba(var(--bs-secondary-rgb),var(--bs-text-opacity))!important}.text-success{--bs-text-opacity:1;color:rgba(var(--bs-success-rgb),var(--bs-text-opacity))!important}.text-info{--bs-text-opacity:1;color:rgba(var(--bs-info-rgb),var(--bs-text-opacity))!important}.text-warning{--bs-text-opacity:1;color:rgba(var(--bs-warning-rgb),var(--bs-text-opacity))!important}.text-danger{--bs-text-opacity:1;color:rgba(var(--bs-danger-rgb),var(--bs-text-opacity))!important}.text-light{--bs-text-opacity:1;color:rgba(var(--bs-light-rgb),var(--bs-text-opacity))!important}.text-dark{--bs-text-opacity:1;color:rgba(var(--bs-dark-rgb),var(--bs-text-opacity))!important}.text-black{--bs-text-opacity:1;color:rgba(var(--bs-black-rgb),var(--bs-text-opacity))!important}.text-white{--bs-text-opacity:1;color:rgba(var(--bs-white-rgb),var(--bs-text-opacity))!important}.border-primary{border-color:#0d6efd!important}.border-secondary{border-color:#6c757d!important}.border-success{border-color:#198754!important}.border-info{border-color:#0dcaf0!important}.border-warning{border-color:#ffc107!important}.border-danger{border-color:#dc3545!important}.border-light{border-color:#f8f9fa!important}.border-dark{border-color:#212529!important}.border-white{border-color:#fff!important}.h-25{height:25%!important}.h-50{height:50%!important}.h-75{height:75%!important}.h-100{height:100%!important}.h-auto{height:auto!important}.w-25{width:25%!important}.w-50{width:50%!important}.w-75{width:75%!important}.w-100{width:100%!important}.w-auto{width:auto!important}.text-start{text-align:left!important}.text-end{text-align:right!important}.text-center{text-align:center!important}*,::after,::before{box-sizing:border-box}</style><div class="card"></div>',this.name=r+"-"+o}setState(o){if(o.name&&(this.name=o.name),o.textColor&&this.allowedColors.includes(o.textColor)&&(t="text-"+o.textColor,this.rootElement.classList.add(t),this.textClass&&this.rootElement.classList.remove(this.textClass),this.textClass=t),o.bgColor&&this.allowedColors.includes(o.bgColor)&&(t="bg-"+o.bgColor,this.rootElement.classList.add(t),this.colorClass&&this.rootElement.classList.remove(this.colorClass),this.colorClass=t),o.borderColor&&this.allowedColors.includes(o.borderColor)&&(t="border-"+o.borderColor,this.rootElement.classList.add(t),this.borderClass&&this.rootElement.classList.remove(this.borderClass),this.borderClass=t),o.equalHeight&&this.rootElement.classList.add("h-100"),o.width)if(Number.isInteger(+o.width))this.rootElement.classList.add("w-"+o.width);else{let t="";this.rootElement.getAttribute("style")&&(t=this.rootElement.getAttribute("style")),this.rootElement.setAttribute("style",t+"width: "+o.width+";")}if(o.textAlign&&("center"===o.textAlign&&this.rootElement.classList.add("text-center"),"right"===o.textAlign)&&this.rootElement.classList.add("text-end"),"center"===o.position){let t="";this.getAttribute("style")&&(t=this.getAttribute("style")),this.setAttribute("style",t+"margin-left: auto; margin-right: auto;"),this.rootElement.classList.add("card-center")}if(o.cls){var t=o.cls.split(" ");let r=this;t.forEach(function(t){r.rootElement.classList.add(t)})}if(o.margin){let t="";this.getAttribute("style")&&(t=this.getAttribute("style")),this.setAttribute("style",t+"margin: "+o.margin+";")}if(o.topMargin){let t="";this.getAttribute("style")&&(t=this.getAttribute("style")),this.setAttribute("style",t+"margin-top: "+o.topMargin+";")}if(o.bottomMargin){let t="";this.getAttribute("style")&&(t=this.getAttribute("style")),this.setAttribute("style",t+"margin-bottom: "+o.bottomMargin+";")}}onBeforeState(){this.allowedColors=["primary","secondary","warning","success","danger","info","light","dark","body","white","transparent"]}})}});
golgi_components.push({n:'sbadmin-card-header',f:function load(t){let e="sbadmin-card-header",r=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),r++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.card-header{font-weight:500;padding:1rem 1.35rem;margin-bottom:0;background-color:rgba(33,40,50,.03);border-bottom:1px solid rgba(33,40,50,.125)}.card-header:first-child{border-radius:.35rem .35rem 0 0}h5{font-size:1.1rem;margin-top:0;margin-bottom:.5rem;font-weight:500;line-height:1.2}.text-secondary{--bs-text-opacity:1;color:rgba(var(--bs-secondary-rgb),var(--bs-text-opacity))!important}.text-success{--bs-text-opacity:1;color:rgba(var(--bs-success-rgb),var(--bs-text-opacity))!important}.text-info{--bs-text-opacity:1;color:rgba(var(--bs-info-rgb),var(--bs-text-opacity))!important}.text-warning{--bs-text-opacity:1;color:rgba(var(--bs-warning-rgb),var(--bs-text-opacity))!important}.text-danger{--bs-text-opacity:1;color:rgba(var(--bs-danger-rgb),var(--bs-text-opacity))!important}.text-light{--bs-text-opacity:1;color:rgba(var(--bs-light-rgb),var(--bs-text-opacity))!important}.text-dark{--bs-text-opacity:1;color:rgba(var(--bs-dark-rgb),var(--bs-text-opacity))!important}.text-black{--bs-text-opacity:1;color:rgba(var(--bs-black-rgb),var(--bs-text-opacity))!important}.text-white{--bs-text-opacity:1;color:rgba(var(--bs-white-rgb),var(--bs-text-opacity))!important}*,::after,::before{box-sizing:border-box}</style><h5 class="card-header"></h5>',this.name=e+"-"+r}setState(t){t.name&&(this.name=t.name),t.text&&(this.rootElement.textContent=t.text),t.textContent&&(this.rootElement.textContent=t.textContent)}setText(t){this.rootElement.textContent=t}})}});
golgi_components.push({n:'sbadmin-card-body',f:function load(t){let s="sbadmin-card-body",a=-1;customElements.define(s,class extends HTMLElement{constructor(){super(),a++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>div{--bs-blue:#0d6efd;--bs-indigo:#6610f2;--bs-purple:#6f42c1;--bs-pink:#d63384;--bs-red:#dc3545;--bs-orange:#fd7e14;--bs-yellow:#ffc107;--bs-green:#198754;--bs-teal:#20c997;--bs-cyan:#0dcaf0;--bs-white:#fff;--bs-gray:#6c757d;--bs-gray-dark:#343a40;--bs-gray-100:#f8f9fa;--bs-gray-200:#e9ecef;--bs-gray-300:#dee2e6;--bs-gray-400:#ced4da;--bs-gray-500:#adb5bd;--bs-gray-600:#6c757d;--bs-gray-700:#495057;--bs-gray-800:#343a40;--bs-gray-900:#212529;--bs-primary:#0d6efd;--bs-secondary:#6c757d;--bs-success:#198754;--bs-info:#0dcaf0;--bs-warning:#ffc107;--bs-danger:#dc3545;--bs-light:#f8f9fa;--bs-dark:#212529;--bs-primary-rgb:13,110,253;--bs-secondary-rgb:108,117,125;--bs-success-rgb:25,135,84;--bs-info-rgb:13,202,240;--bs-warning-rgb:255,193,7;--bs-danger-rgb:220,53,69;--bs-light-rgb:248,249,250;--bs-dark-rgb:33,37,41;--bs-white-rgb:255,255,255;--bs-black-rgb:0,0,0;--bs-body-color-rgb:33,37,41;--bs-body-bg-rgb:255,255,255;--bs-font-sans-serif:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--bs-font-monospace:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--bs-gradient:linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));--bs-body-font-family:var(--bs-font-sans-serif);--bs-body-font-size:1rem;--bs-body-font-weight:400;--bs-body-line-height:1.5;--bs-body-color:#212529;--bs-body-bg:#fff}.card-body{flex:1 1 auto;padding:1rem 1rem}.text-secondary{--bs-text-opacity:1;color:rgba(var(--bs-secondary-rgb),var(--bs-text-opacity))!important}.text-success{--bs-text-opacity:1;color:rgba(var(--bs-success-rgb),var(--bs-text-opacity))!important}.text-info{--bs-text-opacity:1;color:rgba(var(--bs-info-rgb),var(--bs-text-opacity))!important}.text-warning{--bs-text-opacity:1;color:rgba(var(--bs-warning-rgb),var(--bs-text-opacity))!important}.text-danger{--bs-text-opacity:1;color:rgba(var(--bs-danger-rgb),var(--bs-text-opacity))!important}.text-light{--bs-text-opacity:1;color:rgba(var(--bs-light-rgb),var(--bs-text-opacity))!important}.text-dark{--bs-text-opacity:1;color:rgba(var(--bs-dark-rgb),var(--bs-text-opacity))!important}.text-black{--bs-text-opacity:1;color:rgba(var(--bs-black-rgb),var(--bs-text-opacity))!important}.text-white{--bs-text-opacity:1;color:rgba(var(--bs-white-rgb),var(--bs-text-opacity))!important}</style><div class="card-body"></div>',this.name=s+"-"+a}setState(t){t.name&&(this.name=t.name),t.text&&(this.rootElement.textContent=t.text),t.textColor&&this.allowedColors.includes(t.textColor)&&(t="text-"+t.textColor,this.classList.add(t),this.rootElement.classList.add(t),this.textClass&&this.classList.remove(this.textClass),this.textClass=t)}setText(t){this.rootElement.textContent=t}onBeforeState(){this.allowedColors=["primary","secondary","warning","success","danger","info","light","dark","body","white","transparent"]}})}});
golgi_components.push({n:'sbadmin-card-footer',f:function load(t){let e="sbadmin-card-footer",a=-1;customElements.define(e,class extends HTMLElement{constructor(){super(),a++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>:root{--bs-primary-rgb:13,110,253;--bs-secondary-rgb:108,117,125;--bs-success-rgb:25,135,84;--bs-info-rgb:13,202,240;--bs-warning-rgb:255,193,7;--bs-danger-rgb:220,53,69;--bs-light-rgb:248,249,250;--bs-dark-rgb:33,37,41;--bs-white-rgb:255,255,255;--bs-black-rgb:0,0,0;--bs-body-color-rgb:33,37,41;--bs-body-bg-rgb:255,255,255}.card-footer{padding:.5rem 1rem;background-color:rgba(0,0,0,.03);border-top:1px solid rgba(0,0,0,.125);font-size:.9rem}.card-footer:last-child{border-radius:0 0 calc(.25rem - 1px) calc(.25rem - 1px)}.text-primary{--bs-text-opacity:1;color:rgba(var(--bs-primary-rgb),var(--bs-text-opacity))!important}.text-secondary{--bs-text-opacity:1;color:rgba(var(--bs-secondary-rgb),var(--bs-text-opacity))!important}.text-success{--bs-text-opacity:1;color:rgba(var(--bs-success-rgb),var(--bs-text-opacity))!important}.text-info{--bs-text-opacity:1;color:rgba(var(--bs-info-rgb),var(--bs-text-opacity))!important}.text-warning{--bs-text-opacity:1;color:rgba(var(--bs-warning-rgb),var(--bs-text-opacity))!important}.text-danger{--bs-text-opacity:1;color:rgba(var(--bs-danger-rgb),var(--bs-text-opacity))!important}.text-light{--bs-text-opacity:1;color:rgba(var(--bs-light-rgb),var(--bs-text-opacity))!important}.text-dark{--bs-text-opacity:1;color:rgba(var(--bs-dark-rgb),var(--bs-text-opacity))!important}.text-black{--bs-text-opacity:1;color:rgba(var(--bs-black-rgb),var(--bs-text-opacity))!important}.text-white{--bs-text-opacity:1;color:rgba(var(--bs-white-rgb),var(--bs-text-opacity))!important}.text-body{--bs-text-opacity:1;color:rgba(var(--bs-body-color-rgb),var(--bs-text-opacity))!important}.text-muted{--bs-text-opacity:1;color:#6c757d!important}.text-black-50{--bs-text-opacity:1;color:rgba(0,0,0,.5)!important}.text-white-50{--bs-text-opacity:1;color:rgba(255,255,255,.5)!important}.text-reset{--bs-text-opacity:1;color:inherit!important}.text-opacity-25{--bs-text-opacity:0.25}.text-opacity-50{--bs-text-opacity:0.5}.text-opacity-75{--bs-text-opacity:0.75}.text-opacity-100{--bs-text-opacity:1}</style><div class="card-footer"></div>',this.name=e+"-"+a}setState(t){var e;t.name&&(this.name=t.name),t.text&&this.setText(t.text),t.textContent&&this.setText(t.textContent),t.muted&&this.rootElement.classList.add("text-muted"),t.smallText&&((e=document.createElement("small")).classList.add("text-muted"),e.textContent=t.smallText,this.rootElement.appendChild(e)),t.cls&&this.rootElement.classList.add(t.cls),t.small&&((e=document.createElement("small")).classList.add("text-muted"),e.textContent=this.rootElement.textContent,this.rootElement.textContent="",this.rootElement.appendChild(e),t.cls&&(e.classList.remove("text-muted"),e.classList.add(t.cls)),this.textElement=e)}setText(t){this.textElement?this.textElement.textContent=t:this.rootElement.textContent=t}})}});
golgi_components.push({n:'sbadmin-sidebar-footer',f:function load(e){let o="sbadmin-sidebar-footer",t=-1;customElements.define(o,class extends HTMLElement{constructor(){super(),t++,this.attachShadow({mode:"open"});this.shadowRoot.innerHTML='<style>.sb-sidenav-footer{padding:.75rem}</style><div class="sb-sidenav-footer">',this.name=o+"-"+t}setState(e){e.name&&(this.name=e.name),e.bgColor&&(this.rootElement.style="background-color: "+e.bgColor+";")}})}});
export {golgi_components}