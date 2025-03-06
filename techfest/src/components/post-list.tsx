import { PostCard } from "@/components/post-card";
import { usePosts } from "@/context/post-context";

function PostList() {
  const { posts, addPost } = usePosts();

  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          owner={post.owner}
          date={post.date}
          content={post.content}
        />
      ))}
    </>
  );
}

export default PostList;
