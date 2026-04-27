import { useRouter } from "next/router";

const halamanToko = () => {
  // const Router = useRouter();
  // console.log(Router);
  const { query } = useRouter();
  
  return (
    <div>
      <h1>Halaman Toko</h1>
      <p>Toko: {`${query.slug && query.slug[0] + "-" + query.slug[1]}`}</p> {/* menggunakan backtick bukan petik satu */}
    </div>
  );
};

export default halamanToko;