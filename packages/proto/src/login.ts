import { define, Auth } from "@calpoly/mustang";
import { LoginFormElement } from "./auth/login-form";

define({
  "mu-auth": Auth.Provider,
  "login-form": LoginFormElement
});
