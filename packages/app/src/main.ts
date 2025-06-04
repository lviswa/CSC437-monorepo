import { define, Auth, History, Switch } from "@calpoly/mustang";
import { html } from "lit";

// Import components and views
import { HeaderElement } from "./components/blazing-header";
import { HomeViewElement } from "./views/home-view";
import { WomenViewElement } from "./views/women-view";

// Define SPA routes
const routes = [
  {
    path: "/app/women",
    view: () => html`<women-view></women-view>`
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

// Register all components + SPA router
define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "desi:history", "desi:auth");
    }
  },
  "blazing-header": HeaderElement,
  "home-view": HomeViewElement,
  "women-view": WomenViewElement
});
