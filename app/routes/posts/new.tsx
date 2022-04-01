import { useEffect, useRef } from "react";
import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
} from "remix";
import { createPost } from "~/models/post.server";
import { getLoggedUser } from "~/models/user.server";
import { ActionNewPostData } from "./post.types";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLoggedUser(request);
  if (!user) return redirect("/auth/login");
  return user;
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getLoggedUser(request);
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  if (typeof title !== "string" || title.length === 0 || title.length < 3) {
    return json<ActionNewPostData>(
      { errors: { title: "Title should be at least 3 characters" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0 || body.length < 10) {
    return json<ActionNewPostData>(
      { errors: { body: "Body should be at least 10 characters" } },
      { status: 400 }
    );
  }
  if (!user) {
    return redirect("/auth/login");
  }

  const post = await createPost({
    title,
    body,
    userId: user.id,
  });

  return redirect(`/posts/${post.id}`);
};

function New() {
  const actionData = useActionData();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">
        <Form method="post">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              ref={titleRef}
              aria-invalid={actionData?.errors?.title ? true : undefined}
              aria-errormessage={
                actionData?.errors?.title ? "title-error" : undefined
              }
            />
            {actionData?.errors?.title && (
              <div className="error" id="title-error">
                <p>{actionData.errors.title}</p>
              </div>
            )}
          </div>
          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea
              ref={bodyRef}
              name="body"
              id="body"
              aria-invalid={actionData?.errors?.body ? true : undefined}
              aria-errormessage={
                actionData?.errors?.body ? "body-error" : undefined
              }
            />
            {actionData?.errors?.body && (
              <div className="error" id="body-error">
                <p>{actionData.errors.body}</p>
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-block">
            Add Post 👌
          </button>
        </Form>
      </div>
    </>
  );
}

export default New;
