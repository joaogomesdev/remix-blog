export interface Post { 
  id: number,
  title: string,
  body: string,
  created_at: string
}

export interface PostRequest {
  title: string, 
  body: string,
  userId: string
}

export type ActionLoginData = {
  errors?: {
    loginType?: string
    username?: string;
    password?: string;
  };
};

export type ActionPostData = {
  errors?: {
    title?: string;
    body?: string;
  };
};
export type ActionNewPostData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export interface LoaderDataProps {
  posts: Array<Post>
}

export type LoaderDataResponse = {
  posts: Array<Post>
};