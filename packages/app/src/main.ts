import { define, Auth, History, Store, Switch } from "@calpoly/mustang";
import { html } from "lit";

import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";

import { HomeViewElement } from "./views/home-view";
import { WomenViewElement } from "./views/women-view";
import { LoginViewElement } from "./views/login-view";
import { NewUserViewElement } from "./views/newuser-view";
import { ProductEditView } from "./views/product-edit-view";

const routes: Switch.Route[] = [
    {
        path: "/app/product/:id/edit",
        view: (params) => {
          const { id } = params as { id: string };
          return html`<product-edit-view .id=${id}></product-edit-view>`;
        }
    },      
    {
      path: "/app/women",
      view: () => html`<women-view></women-view>`
    },
    {
      path: "/app/login",
      view: () => html`<login-view></login-view>`
    },
    {
      path: "/app/newuser",
      view: () => html`<newuser-view></newuser-view>`
    },
    {
      path: "/app",
      view: () => html`<home-view></home-view>`
    },
    {
      path: "/",
      redirect: "/app"
    }  
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "desi:history", "desi:auth");
    }
  },
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "desi:auth");
    }
  },
  "home-view": HomeViewElement,
  "women-view": WomenViewElement,
  "login-view": LoginViewElement,
  "newuser-view": NewUserViewElement,
  "product-edit-view": ProductEditView
});
