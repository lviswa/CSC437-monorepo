(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var V,Ee;class ot extends Error{}ot.prototype.name="InvalidTokenError";function Bs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Ws(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Bs(t)}catch{return atob(t)}}function es(i,t){if(typeof i!="string")throw new ot("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new ot(`Invalid token specified: missing part #${e+1}`);let r;try{r=Ws(s)}catch(n){throw new ot(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new ot(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Ys="mu:context",Qt=`${Ys}:change`;class Js{constructor(t,e){this._proxy=Ks(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ie extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Js(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Qt,t),t}detach(t){this.removeEventListener(Qt,t)}}function Ks(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let d=new CustomEvent(Qt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:r,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function Zs(i,t){const e=ss(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function ss(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return ss(i,r.host)}class Gs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function rs(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Gs(e,i))}class ne{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Qs(i){return t=>({...t,...i})}const Xt="mu:auth:jwt",is=class ns extends ne{constructor(t,e){super((s,r)=>this.update(s,r),t,ns.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(tr(s)),Wt(r);case"auth/signout":return e(er()),Wt(this._redirectForLogin);case"auth/redirect":return Wt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};is.EVENT_TYPE="auth:message";let os=is;const as=rs(os.EVENT_TYPE);function Wt(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class Xs extends ie{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=Z.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new os(this.context,this.redirect).attach(this)}}class K{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Xt),t}}class Z extends K{constructor(t){super();const e=es(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Z(t);return localStorage.setItem(Xt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Xt);return t?Z.authenticate(t):new K}}function tr(i){return Qs({user:Z.authenticate(i),token:i})}function er(){return i=>{const t=i.user;return{user:t&&t.authenticated?K.deauthenticate(t):t,token:""}}}function sr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function rr(i){return i.authenticated?es(i.token||""):{}}const oe=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Z,Provider:Xs,User:K,dispatch:as,headers:sr,payload:rr},Symbol.toStringTag,{value:"Module"}));function te(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function xe(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}function ls(i,...t){const e=i.map((r,n)=>n?[t[n-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ir=new DOMParser;function L(i,...t){const e=t.map(l),s=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),r=ir.parseFromString(s,"text/html"),n=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Se(a);case"bigint":case"boolean":case"number":case"symbol":return Se(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Se(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Mt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:n};return s;function r(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let nr=(V=class extends HTMLElement{constructor(){super(),this._state={},Mt(this).template(V.template).styles(V.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),te(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},or(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},V.template=L`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,V.styles=ls`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,V);function or(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const ar=Object.freeze(Object.defineProperty({__proto__:null,Element:nr},Symbol.toStringTag,{value:"Module"})),cs=class hs extends ne{constructor(t){super((e,s)=>this.update(e,s),t,hs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(cr(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(hr(s,r));break}}}};cs.EVENT_TYPE="history:message";let ae=cs;class Pe extends ie{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=lr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),le(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ae(this.context).attach(this)}}function lr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function cr(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function hr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const le=rs(ae.EVENT_TYPE),us=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Pe,Provider:Pe,Service:ae,dispatch:le},Symbol.toStringTag,{value:"Module"}));class ht{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new ke(this._provider,t);this._effects.push(r),e(r)}else Zs(this._target,this._contextLabel).then(r=>{const n=new ke(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class ke{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ds=class ps extends HTMLElement{constructor(){super(),this._state={},this._user=new K,this._authObserver=new ht(this,"blazing:auth"),Mt(this).template(ps.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;ur(r,this._state,e,this.authorization).then(n=>st(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},st(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ce(this.src,this.authorization).then(e=>{this._state=e,st(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ce(this.src,this.authorization).then(r=>{this._state=r,st(r,this)});break;case"new":s&&(this._state={},st({},this));break}}};ds.observedAttributes=["src","new","action"];ds.template=L`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Ce(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function st(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function ur(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const fs=class ms extends ne{constructor(t,e){super(e,t,ms.EVENT_TYPE,!1)}};fs.EVENT_TYPE="mu:message";let gs=fs;class dr extends ie{constructor(t,e,s){super(e),this._user=new K,this._updateFn=t,this._authObserver=new ht(this,s)}connectedCallback(){const t=new gs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const pr=Object.freeze(Object.defineProperty({__proto__:null,Provider:dr,Service:gs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis,ce=wt.ShadowRoot&&(wt.ShadyCSS===void 0||wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),Oe=new WeakMap;let ys=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ce&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Oe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Oe.set(e,t))}return t}toString(){return this.cssText}};const fr=i=>new ys(typeof i=="string"?i:i+"",void 0,he),mr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new ys(e,i,he)},gr=(i,t)=>{if(ce)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=wt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Te=ce?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return fr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:yr,defineProperty:vr,getOwnPropertyDescriptor:br,getOwnPropertyNames:_r,getOwnPropertySymbols:$r,getPrototypeOf:wr}=Object,G=globalThis,Re=G.trustedTypes,Ar=Re?Re.emptyScript:"",Ue=G.reactiveElementPolyfillSupport,at=(i,t)=>i,Et={toAttribute(i,t){switch(t){case Boolean:i=i?Ar:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ue=(i,t)=>!yr(i,t),Ne={attribute:!0,type:String,converter:Et,reflect:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),G.litPropertyMetadata??(G.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ne){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&vr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=br(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ne}static _$Ei(){if(this.hasOwnProperty(at("elementProperties")))return;const t=wr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(at("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(at("properties"))){const e=this.properties,s=[..._r(e),...$r(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Te(r))}else t!==void 0&&e.push(Te(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Et).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Et;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ue)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[at("elementProperties")]=new Map,W[at("finalized")]=new Map,Ue==null||Ue({ReactiveElement:W}),(G.reactiveElementVersions??(G.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,St=xt.trustedTypes,Me=St?St.createPolicy("lit-html",{createHTML:i=>i}):void 0,vs="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,bs="?"+S,Er=`<${bs}>`,z=document,ut=()=>z.createComment(""),dt=i=>i===null||typeof i!="object"&&typeof i!="function",de=Array.isArray,xr=i=>de(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Yt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Le=/-->/g,je=/>/g,R=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),He=/'/g,ze=/"/g,_s=/^(?:script|style|textarea|title)$/i,Sr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),it=Sr(1),Q=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Ie=new WeakMap,N=z.createTreeWalker(z,129);function $s(i,t){if(!de(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Me!==void 0?Me.createHTML(t):t}const Pr=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=rt;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===rt?f[1]==="!--"?o=Le:f[1]!==void 0?o=je:f[2]!==void 0?(_s.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=r??rt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?R:f[3]==='"'?ze:He):o===ze||o===He?o=R:o===Le||o===je?o=rt:(o=R,r=void 0);const h=o===R&&i[l+1].startsWith("/>")?" ":"";n+=o===rt?a+Er:u>=0?(s.push(d),a.slice(0,u)+vs+a.slice(u)+S+h):a+S+(u===-2?l:h)}return[$s(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ee=class ws{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Pr(t,e);if(this.el=ws.createElement(d,s),N.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=N.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(vs)){const c=f[o++],h=r.getAttribute(u).split(S),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Cr:p[1]==="?"?Or:p[1]==="@"?Tr:Lt}),r.removeAttribute(u)}else u.startsWith(S)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(_s.test(r.tagName)){const u=r.textContent.split(S),c=u.length-1;if(c>0){r.textContent=St?St.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ut()),N.nextNode(),a.push({type:2,index:++n});r.append(u[c],ut())}}}else if(r.nodeType===8)if(r.data===bs)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(S,u+1))!==-1;)a.push({type:7,index:n}),u+=S.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}};function X(i,t,e=i,s){var r,n;if(t===Q)return t;let o=s!==void 0?(r=e.o)==null?void 0:r[s]:e.l;const l=dt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=X(i,o._$AS(i,t.values),o,s)),t}class kr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??z).importNode(e,!0);N.currentNode=r;let n=N.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new gt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Rr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=N.nextNode(),o++)}return N.currentNode=z,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class gt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),dt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):xr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ee.createElement($s(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new kr(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ie.get(t.strings);return e===void 0&&Ie.set(t.strings,e=new ee(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new gt(this.O(ut()),this.O(ut()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Lt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=X(this,t,e,0),o=!dt(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=X(this,l[s+a],e,a),d===Q&&(d=this._$AH[a]),o||(o=!dt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Cr extends Lt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Or extends Lt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Tr extends Lt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??b)===Q)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Rr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const De=xt.litHtmlPolyfillSupport;De==null||De(ee,gt),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.2.0");const Ur=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new gt(t.insertBefore(ut(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let J=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Ur(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Q}};J._$litElement$=!0,J.finalized=!0,(Ee=globalThis.litElementHydrateSupport)==null||Ee.call(globalThis,{LitElement:J});const Fe=globalThis.litElementPolyfillSupport;Fe==null||Fe({LitElement:J});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nr={attribute:!0,type:String,converter:Et,reflect:!1,hasChanged:ue},Mr=(i=Nr,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function As(i){return(t,e)=>typeof e=="object"?Mr(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Es(i){return As({...i,state:!0,attribute:!1})}function Lr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function jr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var xs={};(function(i){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,Dt){var A=y.length-1;switch(m){case 1:return new g.Root({},[y[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new g.Literal({value:y[A]});break;case 7:this.$=new g.Splat({name:y[A]});break;case 8:this.$=new g.Param({name:y[A]});break;case 9:this.$=new g.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,Dt="",A=0,$e=0,Ds=2,we=1,Fs=m.slice.call(arguments,1),v=Object.create(this.lexer),O={yy:{}};for(var Ft in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ft)&&(O.yy[Ft]=this.yy[Ft]);v.setInput(c,O.yy),O.yy.lexer=v,O.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var qt=v.yylloc;m.push(qt);var qs=v.options&&v.options.ranges;typeof O.yy.parseError=="function"?this.parseError=O.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Vs=function(){var q;return q=v.lex()||we,typeof q!="number"&&(q=h.symbols_[q]||q),q},w,T,E,Vt,F={},_t,x,Ae,$t;;){if(T=p[p.length-1],this.defaultActions[T]?E=this.defaultActions[T]:((w===null||typeof w>"u")&&(w=Vs()),E=y[T]&&y[T][w]),typeof E>"u"||!E.length||!E[0]){var Bt="";$t=[];for(_t in y[T])this.terminals_[_t]&&_t>Ds&&$t.push("'"+this.terminals_[_t]+"'");v.showPosition?Bt="Parse error on line "+(A+1)+`:
`+v.showPosition()+`
Expecting `+$t.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Bt="Parse error on line "+(A+1)+": Unexpected "+(w==we?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Bt,{text:v.match,token:this.terminals_[w]||w,line:v.yylineno,loc:qt,expected:$t})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+T+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(v.yytext),m.push(v.yylloc),p.push(E[1]),w=null,$e=v.yyleng,Dt=v.yytext,A=v.yylineno,qt=v.yylloc;break;case 2:if(x=this.productions_[E[1]][1],F.$=g[g.length-x],F._$={first_line:m[m.length-(x||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(x||1)].first_column,last_column:m[m.length-1].last_column},qs&&(F._$.range=[m[m.length-(x||1)].range[0],m[m.length-1].range[1]]),Vt=this.performAction.apply(F,[Dt,$e,A,O.yy,E[1],g,m].concat(Fs)),typeof Vt<"u")return Vt;x&&(p=p.slice(0,-1*x*2),g=g.slice(0,-1*x),m=m.slice(0,-1*x)),p.push(this.productions_[E[1]][0]),g.push(F.$),m.push(F._$),Ae=y[p[p.length-2]][p[p.length-1]],p.push(Ae);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof jr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(xs);function B(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Ss={Root:B("Root"),Concat:B("Concat"),Literal:B("Literal"),Splat:B("Splat"),Param:B("Param"),Optional:B("Optional")},Ps=xs.parser;Ps.yy=Ss;var Hr=Ps,zr=Object.keys(Ss);function Ir(i){return zr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var ks=Ir,Dr=ks,Fr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Cs(i){this.captures=i.captures,this.re=i.re}Cs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var qr=Dr({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Fr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Cs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Vr=qr,Br=ks,Wr=Br({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Yr=Wr,Jr=Hr,Kr=Vr,Zr=Yr;yt.prototype=Object.create(null);yt.prototype.match=function(i){var t=Kr.visit(this.ast),e=t.match(i);return e||!1};yt.prototype.reverse=function(i){return Zr.visit(this.ast,i)};function yt(i){var t;if(this?t=this:t=Object.create(yt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Jr.parse(i),t}var Gr=yt,Qr=Gr,Xr=Qr;const ti=Lr(Xr);var ei=Object.defineProperty,Os=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ei(t,e,r),r};const Ts=class extends J{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>it` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new ti(r.path)})),this._historyObserver=new ht(this,e),this._authObserver=new ht(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),it` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(as(this,"auth/redirect"),it` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):it` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),it` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){le(this,"history/redirect",{href:t})}};Ts.styles=mr`
    :host,
    main {
      display: contents;
    }
  `;let Pt=Ts;Os([Es()],Pt.prototype,"_user");Os([Es()],Pt.prototype,"_match");const si=Object.freeze(Object.defineProperty({__proto__:null,Element:Pt,Switch:Pt},Symbol.toStringTag,{value:"Module"})),ri=class Rs extends HTMLElement{constructor(){if(super(),Mt(this).template(Rs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ri.template=L`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Us=class se extends HTMLElement{constructor(){super(),this._array=[],Mt(this).template(se.template).styles(se.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ns("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{xe(t,"button.add")?te(t,"input-array:add"):xe(t,"button.remove")&&te(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ii(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Us.template=L`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Us.styles=ls`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function ii(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Ns(e)))}function Ns(i,t){const e=i===void 0?L`<input />`:L`<input value="${i}" />`;return L`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function pe(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ni=Object.defineProperty,oi=Object.getOwnPropertyDescriptor,ai=(i,t,e,s)=>{for(var r=oi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ni(t,e,r),r};class jt extends J{constructor(t){super(),this._pending=[],this._observer=new ht(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}ai([As()],jt.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const At=globalThis,fe=At.ShadowRoot&&(At.ShadyCSS===void 0||At.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),qe=new WeakMap;let Ms=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(fe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&qe.set(e,t))}return t}toString(){return this.cssText}};const li=i=>new Ms(typeof i=="string"?i:i+"",void 0,me),D=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Ms(e,i,me)},ci=(i,t)=>{if(fe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=At.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ve=fe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return li(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:hi,defineProperty:ui,getOwnPropertyDescriptor:di,getOwnPropertyNames:pi,getOwnPropertySymbols:fi,getPrototypeOf:mi}=Object,k=globalThis,Be=k.trustedTypes,gi=Be?Be.emptyScript:"",Jt=k.reactiveElementPolyfillSupport,lt=(i,t)=>i,kt={toAttribute(i,t){switch(t){case Boolean:i=i?gi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ge=(i,t)=>!hi(i,t),We={attribute:!0,type:String,converter:kt,reflect:!1,useDefault:!1,hasChanged:ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=We){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&ui(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=di(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??We}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=mi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,s=[...pi(e),...fi(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ve(r))}else t!==void 0&&e.push(Ve(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ci(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:kt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n,o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:kt;this._$Em=r,this[r]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??ge)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[lt("elementProperties")]=new Map,Y[lt("finalized")]=new Map,Jt==null||Jt({ReactiveElement:Y}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ct=globalThis,Ct=ct.trustedTypes,Ye=Ct?Ct.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ls="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,js="?"+P,yi=`<${js}>`,I=document,pt=()=>I.createComment(""),ft=i=>i===null||typeof i!="object"&&typeof i!="function",ye=Array.isArray,vi=i=>ye(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Kt=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Je=/-->/g,Ke=/>/g,U=RegExp(`>|${Kt}(?:([^\\s"'>=/]+)(${Kt}*=${Kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ze=/'/g,Ge=/"/g,Hs=/^(?:script|style|textarea|title)$/i,bi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),$=bi(1),tt=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Qe=new WeakMap,M=I.createTreeWalker(I,129);function zs(i,t){if(!ye(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ye!==void 0?Ye.createHTML(t):t}const _i=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=nt;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===nt?f[1]==="!--"?o=Je:f[1]!==void 0?o=Ke:f[2]!==void 0?(Hs.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=r??nt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?U:f[3]==='"'?Ge:Ze):o===Ge||o===Ze?o=U:o===Je||o===Ke?o=nt:(o=U,r=void 0);const h=o===U&&i[l+1].startsWith("/>")?" ":"";n+=o===nt?a+yi:u>=0?(s.push(d),a.slice(0,u)+Ls+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[zs(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class mt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=_i(t,e);if(this.el=mt.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=M.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Ls)){const c=f[o++],h=r.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?wi:p[1]==="?"?Ai:p[1]==="@"?Ei:Ht}),r.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Hs.test(r.tagName)){const u=r.textContent.split(P),c=u.length-1;if(c>0){r.textContent=Ct?Ct.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],pt()),M.nextNode(),a.push({type:2,index:++n});r.append(u[c],pt())}}}else if(r.nodeType===8)if(r.data===js)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=I.createElement("template");return s.innerHTML=t,s}}function et(i,t,e=i,s){var o,l;if(t===tt)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=ft(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=et(i,r._$AS(i,t.values),r,s)),t}class $i{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??I).importNode(e,!0);M.currentNode=r;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new vt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new xi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=I,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class vt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),ft(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=mt.createElement(zs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new $i(r,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Qe.get(t.strings);return e===void 0&&Qe.set(t.strings,e=new mt(t)),e}k(t){ye(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new vt(this.O(pt()),this.O(pt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Ht{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=et(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==tt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=et(this,l[s+a],e,a),d===tt&&(d=this._$AH[a]),o||(o=!ft(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class wi extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Ai extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Ei extends Ht{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??_)===tt)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class xi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const Zt=ct.litHtmlPolyfillSupport;Zt==null||Zt(mt,vt),(ct.litHtmlVersions??(ct.litHtmlVersions=[])).push("3.3.0");const Si=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new vt(t.insertBefore(pt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis;class H extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Si(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}}var ts;H._$litElement$=!0,H.finalized=!0,(ts=j.litElementHydrateSupport)==null||ts.call(j,{LitElement:H});const Gt=j.litElementPolyfillSupport;Gt==null||Gt({LitElement:H});(j.litElementVersions??(j.litElementVersions=[])).push("4.2.0");const Pi={};function ki(i,t,e){switch(i[0]){case"products/load":console.log("📦 [update] Loading products..."),Xe(e).then(r=>{console.log("✅ [update] Loaded products:",r),t(n=>({...n,products:r}))});return;case"products/set":console.log("📦 [update] Setting products directly:",i[1].products),t(r=>({...r,products:i[1].products}));return;case"product/save":{const{id:r,product:n,onSuccess:o,onFailure:l}=i[1];console.log("📝 [update] Saving product:",r,n);const a={...n,price:Number(n.price)};Ci(r,a,e).then(()=>(console.log("✅ [update] Save successful. Reloading products."),Xe(e))).then(d=>{t(f=>({...f,products:d})),o==null||o()}).catch(d=>{console.error("❌ [update] Save failed:",d),l==null||l(d)});return}default:const s=i[0];throw new Error(`Unhandled message "${s}"`)}}function Xe(i){console.log("📡 [loadProducts] Fetching with user:",i);const t=localStorage.getItem("authToken"),e={...oe.headers(i),...t?{Authorization:`Bearer ${t}`}:{}};return fetch("/api/products",{headers:e}).then(s=>s.ok?s.json():(console.warn("⚠️ [loadProducts] Server responded with:",s.status),[])).then(s=>{console.log("📄 [loadProducts] Raw server product data:",s);const r=s.map(n=>({id:n.productid,name:n.name,price:Number(n.price),image:n.imgSrc,category:n.category??"women"}));return console.log("✅ [loadProducts] Mapped products:",r),r})}function Ci(i,t,e){return console.log("📡 [saveProduct] PATCH /api/products/"+i,t),fetch(`/api/products/${i}`,{method:"PATCH",headers:{...oe.headers(e),"Content-Type":"application/json"},body:JSON.stringify(t)}).then(s=>{if(s.ok)console.log("✅ [saveProduct] Server confirmed save.");else return s.text().then(r=>{throw new Error(`Failed to save product: ${s.status} ${r}`)})})}const ve=class ve extends jt{constructor(){super("desi:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["products/load",{}])}render(){return $`
      <main class="page">
        <!-- Hero Section -->
        <section class="hero-section section">
        <a class="logo-link" href="/app">
          <img src="/assets/logo.png" class="logo-img" alt="Desi Threads Logo" />
          <h1 class="site-title">DESI THREADS</h1>
        </a>
        <p class="catchphrase">Sustainable Indian Fashion, Redefined.</p>
        <a href="/app/login" class="explore-button">Login</a>
      </section>

        <!-- Explore Women's Collection -->
        <section class="women-collection section" id="explore">
          <div class="grid">
            <div class="text-content">
              <h2>Explore Our Women's Collection</h2>
              <p>
                Dive into curated sarees, lehengas, and more — celebrate tradition
                while embracing sustainability through preloved fashion treasures.
              </p>
              <a href="/app/women" class="shop-button">Shop Now</a>
            </div>
            <div class="image-content">
              <img src="/assets/woman-collection.png" alt="Indian Woman Wearing Saree" />
            </div>
          </div>
        </section>

        <!-- Men's Collection -->
        <section class="men-collection section">
          <div class="grid">
            <div class="image-content">
              <img src="/assets/mens-fashion.png" alt="Indian Men's Fashion" />
            </div>
            <div class="text-content">
              <h2>Featured Men's Fashion</h2>
              <p>
                Discover the elegance and charm of traditional Indian menswear.
                From embroidered kurtas to sherwanis, find sustainable styles that impress.
              </p>
              <a href="#" class="shop-button">Shop Now</a>
            </div>
          </div>
        </section>

        <!-- Why Desi Threads -->
        <section class="why-desi-threads section">
          <h2>Why Desi Threads?</h2>
          <p>
            We believe fashion should honor tradition and the planet. By giving a
            second life to timeless Indian clothing, Desi Threads empowers
            sustainability without sacrificing style. Join us in embracing
            eco-conscious fashion with deep-rooted cultural beauty.
          </p>
        </section>
      </main>
    `}};ve.styles=D`
    .hero-section {
      text-align: center;
      padding: 6rem 2rem;
      background-image: url('/assets/background.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
    }

    .hero-section::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.6);
      z-index: 0;
    }

    .hero-section h1,
    .hero-section .catchphrase,
    .hero-section .explore-button {
      position: relative;
      z-index: 1;
    }

    .catchphrase {
      font-size: 1.5rem;
      font-style: italic;
      color: gray;
      margin-bottom: 2rem;
    }

    .explore-button {
      background-color: black;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: bold;
    }

    .explore-button:hover {
      background-color: var(--color-accent-hover);
    }

    .section {
      padding: 6rem 2rem;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
    }

    .text-content {
      max-width: 500px;
    }

    .image-content img {
      width: 100%;
      border-radius: 0.5rem;
    }

    .shop-button {
      background-color: black;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: bold;
    }

    .shop-button:hover {
      background-color: var(--color-accent-hover);
    }

    .why-desi-threads {
      width: 100%;
      text-align: center;
      background-color: var(--color-background-header);
    }

    .why-desi-threads h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .why-desi-threads p {
      font-size: 1.2rem;
      max-width: 800px;
      margin: 0 auto;
      color: #555;
    }
    .logo-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: center;
        text-decoration: none;
        color: inherit;
        margin-bottom: 1rem;
      }
      
      .logo-img {
        width: 60px;
        height: auto;
      }
      
      .site-title {
        font-family: 'Playfair Display', serif;
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
      }      

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `;let re=ve;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Is=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oi={attribute:!0,type:String,converter:kt,reflect:!1,hasChanged:ge},Ti=(i=Oi,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function zt(i){return(t,e)=>typeof e=="object"?Ti(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function It(i){return zt({...i,state:!0,attribute:!1})}var Ri=Object.defineProperty,Ui=Object.getOwnPropertyDescriptor,Ni=(i,t,e,s)=>{for(var r=Ui(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ri(t,e,r),r};const be=class be extends jt{get products(){var t;return((t=this.model.products)==null?void 0:t.filter(e=>e.category==="women"))??[]}constructor(){super("desi:model")}connectedCallback(){super.connectedCallback(),console.log("Dispatching products/load"),this.dispatchMessage(["products/load",{}])}render(){return $`
      <main class="shop-page">
        <aside class="filters">
          <h2>Filters</h2>

          <div class="filter-group">
            <label>Waist Size (in):</label>
            <div class="size-options">
              <button type="button">25</button>
              <button type="button">26</button>
              <button type="button">27</button>
              <button type="button">28</button>
              <button type="button">29</button>
              <button type="button">30</button>
              <button type="button">30+</button>
            </div>
          </div>

          <div class="filter-group">
            <label>Price Range: <span id="price-value">$0</span> – $5,000</label>
            <input type="range" min="0" max="5000" value="0" step="50" id="price-slider">
          </div>

          <div class="filter-group">
            <label>Color:</label>
            <div class="color-options">
              <span class="color red"></span>
              <span class="color blue"></span>
              <span class="color black"></span>
              <span class="color orange"></span>
              <span class="color yellow"></span>
              <span class="color pink"></span>
              <span class="color purple"></span>
              <span class="color green"></span>
            </div>
          </div>

          <div class="filter-group">
            <label>Condition:</label>
            <div class="condition-options">
              <label><input type="radio" name="condition"> New</label>
              <label><input type="radio" name="condition"> Excellent</label>
              <label><input type="radio" name="condition"> Good</label>
              <label><input type="radio" name="condition"> Fair</label>
              <label><input type="radio" name="condition"> Old</label>
            </div>
          </div>
        </aside>

        <section>
          <ul class="product-grid">
            ${this.products.map(t=>$`
                <li class="product-card">
                  <img src=${t.image} alt=${t.name} />
                  <div class="product-info">
                    <h3>${t.name}</h3>
                    <p>$${t.price.toFixed(2)}</p>
                    <a class="edit-button" href="/app/product/${t.id}/edit">Edit</a>
                  <div>
                </li>
              `)}
          </ul>
        </section>
      </main>
    `}};be.styles=D`
  .shop-page {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .filters {
    background: var(--color-background-sage);
    padding: 1.5rem;
    border-radius: 8px;
  }

  .filters h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .filter-group {
    margin-bottom: 2rem;
  }

  .filter-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .size-options button {
    margin: 0.3rem;
    padding: 0.4rem 0.8rem;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
    border-radius: 0.4rem;
    transition: background-color 0.2s, color 0.2s;
  }

  .size-options button:hover {
    background-color: black;
    color: white;
  }

  .color-options {
    display: flex;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .color {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 1px solid #aaa;
    cursor: pointer;
  }

  .color.red { background: red; }
  .color.yellow { background: yellow; }
  .color.blue { background: blue; }
  .color.black { background: black; }
  .color.orange { background: orange; }
  .color.pink { background: pink; }
  .color.purple { background: purple; }
  .color.green { background: green; }

  .condition-options label {
    display: block;
    margin-top: 0.3rem;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
  }

  .product-card {
    display: flex;
    flex-direction: column;
    background: var(--color-background-sage);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    height: auto;
  }

  .product-card img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .product-card:hover {
    transform: translateY(-5px);
  }

  .product-info {
    padding: 1rem;
    text-align: center;
  }

  .product-info h3 {
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }

  .product-info p {
    font-weight: bold;
    color: #555;
  }
  .edit-button {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.4rem 0.8rem;
    background-color: #222;
    color: white;
    text-decoration: none;
    border-radius: 0.4rem;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }
  
  .edit-button:hover {
    background-color: #444;
  }  

  @media (max-width: 768px) {
    .shop-page {
      grid-template-columns: 1fr;
    }

    .filters {
      margin-bottom: 2rem;
    }
  }
`;let Ot=be;Ni([It()],Ot.prototype,"products");const Mi=D`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ul,
  menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }
`,Li={styles:Mi};var ji=Object.defineProperty,bt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ji(t,e,r),r};const _e=class _e extends H{constructor(){super(...arguments),this.formData={},this.redirect="/",this.loading=!1}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password&&!this.loading)}render(){return $`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">
            ${this.loading?"Logging in...":"Login"}
          </button>
        </slot>
        ${this.error?$`<p class="error">${this.error}</p>`:null}
      </form>
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,n=this.formData;s==="username"?this.formData={...n,username:r}:s==="password"&&(this.formData={...n,password:r})}async handleSubmit(t){t.preventDefault(),this.error=void 0,this.loading=!0;try{const e=await fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)});if(!e.ok)throw new Error("Invalid username or password");const{token:s}=await e.json();localStorage.setItem("authToken",s),this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]}))}catch(e){this.error=e.message||"Login failed"}finally{this.loading=!1}}};_e.styles=[Li.styles,D`
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      button[type="submit"] {
        font-size: 1.1rem;
        padding: 0.75rem 1.5rem;
        background-color: var(--color-background, #ee5470);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button[type="submit"]:hover:enabled {
        background-color: var(--color-primary-dark, #006644);
      }

      button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .error {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let C=_e;bt([It()],C.prototype,"formData");bt([zt()],C.prototype,"api");bt([zt()],C.prototype,"redirect");bt([It()],C.prototype,"error");bt([It()],C.prototype,"loading");pe({"login-form":C});var Hi=Object.getOwnPropertyDescriptor,zi=(i,t,e,s)=>{for(var r=s>1?void 0:s?Hi(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(r)||r);return r};let Tt=class extends H{render(){return $`
      <mu-auth>
        <div class="container">
          <h1 class="title">DESI THREADS</h1>
          <main class="card">
            <h2>User Login</h2>
            <login-form api='/auth/login' redirect="/app">
              <label>
                Username:
                <input name="username" autocomplete="off" />
              </label>
              <label>
                Password:
                <input type="password" name="password" />
              </label>
            </login-form>
          </main>
          <p>
            Or did you want to
            <a href="/app/newuser">Sign up as a new user</a>?
          </p>
        </div>
      </mu-auth>
    `}};Tt.styles=D`
    :host {
      display: block;
      min-height: 100vh;
      background: url("/assets/login-background.png") no-repeat center center fixed;
      background-size: cover;
      font-family: var(--body-font, 'Playfair Display', serif);
      color: var(--color-text, black);
      padding: 2rem;
      box-sizing: border-box;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    h1.title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: black;
      text-align: center;
    }

    .card {
      background: var(--color-background-header, white);
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .card h2 {
      text-align: center;
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }

    p {
      margin-top: 1.5rem;
      font-size: 0.9rem;
      text-align: center;
    }

    a {
      color: #ff4081;
      text-decoration: none;
      font-weight: bold;
    }
  `;Tt=zi([Is("login-view")],Tt);var Ii=Object.getOwnPropertyDescriptor,Di=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ii(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(r)||r);return r};let Rt=class extends H{render(){return $`
      <mu-auth>
        <div class="container">
          <h1 class="title">DESI THREADS</h1>
          <main class="card">
            <h2>Create Account</h2>
            <login-form api="/auth/register" redirect="/app">
              <label>
                Username:
                <input name="username" autocomplete="off" />
              </label>
              <label>
                Password:
                <input type="password" name="password" />
              </label>
            </login-form>
          </main>
          <p>
            Already have an account?
            <a href="/app/login">Login here</a>.
          </p>
        </div>
      </mu-auth>
    `}};Rt.styles=D`
    :host {
      display: block;
      min-height: 100vh;
      background: url("/assets/login-background.png") no-repeat center center fixed;
      background-size: cover;
      font-family: var(--body-font, 'Playfair Display', serif);
      color: var(--color-text, black);
      padding: 2rem;
      box-sizing: border-box;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    h1.title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: black;
      text-align: center;
    }

    .card {
      background: var(--color-background-header, white);
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .card h2 {
      text-align: center;
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }

    p {
      margin-top: 1.5rem;
      font-size: 0.9rem;
      text-align: center;
    }

    a {
      color: #ff4081;
      text-decoration: none;
      font-weight: bold;
    }
  `;Rt=Di([Is("newuser-view")],Rt);var Fi=Object.defineProperty,qi=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Fi(t,e,r),r};const Nt=class Nt extends jt{constructor(){super("desi:model"),this.id="",this.handleSubmit=t=>{const e={...t.detail,price:Number(t.detail.price)};this.dispatchMessage(["product/save",{id:this.id,product:e,onSuccess:()=>us.dispatch(this,"history/navigate",{href:"/app/women"}),onFailure:s=>console.error("Save failed:",s)}])}}firstUpdated(){var t;(t=this.model)!=null&&t.products||this.dispatchMessage(["products/load",{}])}get product(){var t,e;return(e=(t=this.model)==null?void 0:t.products)==null?void 0:e.find(s=>s.id===this.id)}render(){var e;const t=this.product;return(e=this.model)!=null&&e.products?t?$`
      <main class="page">
        <div class="form-box">
          <h2>Edit Product</h2>
          <mu-form .init=${t} @mu-form:submit=${this.handleSubmit}>
            <label>Name:
              <input type="text" name="name" required />
            </label>
            <label>Price:
              <input type="number" name="price" required />
            </label>
            <label>Image URL:
              <input type="text" name="image" />
            </label>
            <label>Category:
              <select name="category" required>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="accessories">Accessories</option>
              </select>
            </label>

            <div class="button-wrapper" slot="button">
              <button type="submit">💾 Save</button>
            </div>
          </mu-form>
        </div>
      </main>
    `:$`<main class="page"><p>Product not found for ID: ${this.id}</p></main>`:$`<main class="page"><p>Loading products...</p></main>`}};Nt.uses=pe({"mu-form":ar.Element}),Nt.styles=D`
    main.page {
      display: flex;
      justify-content: center;
      padding: 3rem 1rem;
      font-family: "Playfair Display", serif;
    }

    .form-box {
      background-color: var(--color-header, #f49e62);
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    mu-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
      font-weight: 600;
      font-size: 1rem;
    }

    input,
    select {
      margin-top: 0.4rem;
      padding: 0.6rem 0.8rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: white;
    }

    .button-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 1.5rem;
    }

    button[type="submit"] {
      padding: 0.75rem 1.5rem;
      background-color: #222;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button[type="submit"]:hover {
      background-color: #444;
    }
  `;let Ut=Nt;qi([zt()],Ut.prototype,"id");const Vi=[{path:"/app/product/:id/edit",view:i=>{const{id:t}=i;return $`<product-edit-view .id=${t}></product-edit-view>`}},{path:"/app/women",view:()=>$`<women-view></women-view>`},{path:"/app/login",view:()=>$`<login-view></login-view>`},{path:"/app/newuser",view:()=>$`<newuser-view></newuser-view>`},{path:"/app",view:()=>$`<home-view></home-view>`},{path:"/",redirect:"/app"}];pe({"mu-auth":oe.Provider,"mu-history":us.Provider,"mu-switch":class extends si.Element{constructor(){super(Vi,"desi:history","desi:auth")}},"mu-store":class extends pr.Provider{constructor(){super(ki,Pi,"desi:auth")}},"home-view":re,"women-view":Ot,"login-view":Tt,"newuser-view":Rt,"product-edit-view":Ut});
