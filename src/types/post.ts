export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostInteraction {
  id: string;
  postId: string;
  userId: string;
  type: "like" | "comment" | "share";
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}
