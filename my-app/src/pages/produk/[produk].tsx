import fetcher from "@/utlis/swr/fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";
import DetailProduk from "../../views/DetailProduct";
import { ProductType } from "@/types/product.type";

const HalamanProduk = ({ product }: { product: ProductType }) => {
  // digunakan client-side rendering
  // const Router = useRouter(); ...

  return (
    <div>
      <DetailProduk products={product} />
    </div>
  );
};

export default HalamanProduk;

// digunakan server-side rendering
// export async function getServerSideProps({ params }: { params: { produk: string } }) {
//   const res = await fetch(`http://localhost:3000/api/produk/${params?.produk}`);
//   const respone = await res.json();
//   return {
//     props: {
//       product: respone.data,
//     },
//   };
// }

// digunakan static-site generation
export async function getStaticPaths() {
  const res = await fetch("http://localhost:3000/api/products");
  const response = await res.json();

  const paths = response.data.map((product: ProductType) => ({
    params: { produk: product.id },
  }));

  // console.log("Paths yang dihasilkan untuk produk:", paths); // Debugging: Tampilkan paths yang dihasilkan
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { produk: string } }) {
  const res = await fetch(`http://localhost:3000/api/produk/${params?.produk}`);
  // const response: ProductType[] = await res.json();
  const response: { data: ProductType } = await res.json();

  // console.log("Data produk yang diambil dari API:", response);
  return {
    props: {
      product: response.data,
    },
  };
}