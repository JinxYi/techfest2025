import { Layout } from "@/components/layouts";
import PostList from "@/components/post-list";
import { PostProvider } from "@/context/post-context";

function App() {

  return (
    <Layout>
      <PostProvider>
        <PostList />
      </PostProvider>
    </Layout>
  );
}

export default App;
