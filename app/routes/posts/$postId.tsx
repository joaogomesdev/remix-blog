import { Post, User } from "@prisma/client";
import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { deletePostById, getPostById } from "~/models/post.server";
import { getLoggedUser } from "~/models/user.server";
import { ActionPostData } from "./post.types";

type LoaderData = {
  post: Post;
  user?: User | null;
};

type LoadePostData = {
  post: Post;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { postId } = params;
  const loggedUser = await getLoggedUser(request);
  if (!postId) {
    return json<ActionPostData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  const post = await getPostById(postId);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ post, user: loggedUser });
};
export const action: ActionFunction = async ({ request, params }) => {
  const loggedUser = await getLoggedUser(request);
  const form = await request.formData();
  const { postId } = params;

  if (!postId) {
    return json<ActionPostData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (form.get("_method") === "delete") {
    const post = await getPostById(postId);

    if (!post) {
      throw new Response("Not Found", { status: 404 });
    }

    if (loggedUser && post.userId == loggedUser.id) {
      await deletePostById(post.id);
    }

    return redirect("/posts");
  }
};

function PostDetails() {
  const { post, user } = useLoaderData<LoaderData>();
  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">{post.body}</div>
      <div className="page-footer">
        {user?.id === post.userId && (
          <Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">Delete</button>
          </Form>
        )}
      </div>
    </div>
  );
}

export default PostDetails;
