import { useRouter } from "next/router";

const SlugDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1>Halaman Slug</h1>
      <p>Slug: {slug}</p>
    </div>
  );
};

export default SlugDetailPage;
