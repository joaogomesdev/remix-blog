import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime";
import { getLoggedUser } from "~/models/user.server";
import globalStylesUrl from "~/styles/global.css";

interface DocumentProps {
  children: React.ReactNode;
}

interface LayoutProps {
  children: React.ReactNode;
}

export const links = () => [
  {
    rel: "stylesheet",
    href: globalStylesUrl,
  },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Blog",
  description: "A cool blog buitl with Remix 📀",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function Document({ children }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLoggedUser(request);
  const data = {
    user,
  };
  return data;
};

function Layout({ children }: LayoutProps) {
  const { user } = useLoaderData();

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>

        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="post">
                <button className="btn" type="submit">
                  Logout {user?.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="container">{children}</div>
    </>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <>
      <Document>
        <Layout>
          <h1>Error</h1>
          <p>{error.message}</p>
        </Layout>
      </Document>
    </>
  );
};
