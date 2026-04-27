import { useRouter } from "next/router";

export default function Category() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1>Halaman Category</h1>
      <ul>
        {slug?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}