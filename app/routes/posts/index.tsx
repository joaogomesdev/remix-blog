import { getPosts } from "app/models/post.server";
import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { LoaderDataProps } from "./post.types";
type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json<LoaderData>({ posts });
};

function PostItems() {
  const { posts } = useLoaderData() as LoaderDataProps;
  return (
    <>
      <div>
        <div className="page-header">
          <h1>Posts</h1>
          <Link to="/posts/new" className="btn">
            New Post 📑
          </Link>
        </div>
        <ul className="posts-list">
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <h3>{post.title}</h3>
                {new Date(post.created_at).toLocaleString()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default PostItems;
