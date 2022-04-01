import { useEffect, useRef } from "react";
import { ActionFunction, json, useActionData } from "remix";
import { createUserSession, login } from "~/models/session.server";
import { createUser, findUser } from "~/models/user.server";
import { ActionLoginData } from "../posts/post.types";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");

  if (
    typeof username !== "string" ||
    username.length === 0 ||
    username.length < 3
  ) {
    return json<ActionLoginData>(
      { errors: { username: "Username is required" } },
      { status: 400 }
    );
  }

  if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length < 6
  ) {
    return json<ActionLoginData>(
      { errors: { password: "Password should be at least 6 characters" } },
      { status: 400 }
    );
  }

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });

      if (!user) {
        return json<ActionLoginData>(
          { errors: { username: "Invalid credentials" } },
          { status: 400 }
        );
      }
      // //  create session

      return createUserSession(user.id, "/posts");
    }
    case "register": {
      // return null;
      //  check user
      const userExists = await findUser(username);
      if (userExists) {
        return json<ActionLoginData>(
          { errors: { username: "Username alrealy exists" } },
          { status: 400 }
        );
      }
      //  create user
      const user = await createUser(username, password);

      if (!user) {
        if (userExists) throw new Error("Something went wrong");
      }

      //  create session
      return createUserSession(user.id, "/posts");
    }
    default: {
      return json<ActionLoginData>(
        { errors: { loginType: "Login type is not valid" } },
        { status: 400 }
      );
    }
  }
};

function Login() {
  const actionData = useActionData();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLTextAreaElement>(null);
  const loginRadiodRef = useRef<HTMLInputElement>(null);
  const registerRadiodRef = useRef<HTMLInputElement>(null);
  console.log(actionData?.errors);

  useEffect(() => {
    if (actionData?.errors?.username) {
      usernameRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Login</h1>
      </div>

      <div className="page-content">
        <form method="POST">
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                ref={loginRadiodRef}
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>

            <label>
              <input
                ref={registerRadiodRef}
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />{" "}
              Register
            </label>
          </fieldset>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              ref={usernameRef}
              aria-invalid={actionData?.errors?.username ? true : undefined}
              aria-errormessage={
                actionData?.errors?.username ? "username-error" : undefined
              }
            />
            {actionData?.errors?.username && (
              <div className="error" id="username-error">
                <p>{actionData.errors.username}</p>
              </div>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password}
            />
            {actionData?.errors?.password && (
              <div className="error" id="password-error">
                <p>{actionData.errors.password}</p>
              </div>
            )}
          </div>

          <button className="btn btn-block" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
