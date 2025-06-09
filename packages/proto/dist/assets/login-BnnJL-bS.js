import"./modulepreload-polyfill-B5Qt9EMX.js";import{i as h,r as p,a as f,x as b,b as d,n as l,d as m,c as g}from"./reset.css-45SUcpOs.js";var v=Object.defineProperty,i=(c,e,t,a)=>{for(var r=void 0,s=c.length-1,u;s>=0;s--)(u=c[s])&&(r=u(e,t,r)||r);return r&&v(e,t,r),r};const n=class n extends h{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return b`
      <form
        @change=${e=>this.handleChange(e)}
        @submit=${e=>this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(e){const t=e.target,a=t==null?void 0:t.name,r=t==null?void 0:t.value,s=this.formData;a==="username"?this.formData={...s,username:r}:a==="password"&&(this.formData={...s,password:r})}handleSubmit(e){e.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==200)throw"Login failed";return t.json()}).then(t=>{const{token:a}=t;localStorage.setItem("authToken",a);const r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:a,redirect:this.redirect}]});console.log("Dispatching message",r),this.dispatchEvent(r)}).catch(t=>{console.error(t),this.error=t.toString()})}};n.styles=[p.styles,f`
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

      button[type="submit"]:hover {
        background-color: var(--color-primary-dark, #006644);
      }

      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let o=n;i([d()],o.prototype,"formData");i([l()],o.prototype,"api");i([l()],o.prototype,"redirect");i([d()],o.prototype,"error");m({"login-form":o});m({"mu-auth":g.Provider,"login-form":o});
