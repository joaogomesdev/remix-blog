import { ActionFunction, redirect } from "@remix-run/server-runtime";
import { logout } from "app/models/session.server";
import {} from "remix";
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: ActionFunction = async ({ request }) => {
  return redirect("/");
};
