import { ActionFunction, redirect } from "@remix-run/server-runtime";
import {} from "remix";
import { logout } from "~/models/session.server";
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: ActionFunction = async ({ request }) => {
  return redirect("/");
};
