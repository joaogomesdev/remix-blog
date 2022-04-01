import bcrypt from 'bcrypt'
import { createCookieSessionStorage, redirect } from 'remix'
import invariant from 'tiny-invariant'
import { getUserByUsername } from "~/models/user.server"

type loginRequest = {
  username: string
  password: string
}

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");


const USER_SESSION_KEY = "userId";
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__remix@session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 60, // 60 days
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function login({ username, password }: loginRequest) {
  const user = await getUserByUsername(username);

  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isCorrectPassword) return null
  
  return user

}

export async function logout(request : Request) {
  const session =
    await sessionStorage.getSession(request.headers.get('Cookie'));

  return redirect('/auth/logout', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  })
}


export async function createUserSession(userId: string, requiredTo: string) {
  const session = await sessionStorage.getSession();
  session.set(USER_SESSION_KEY, userId);
  
  return redirect(requiredTo, {
    headers: { 
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  })

}

export async function getUserSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
  
}

