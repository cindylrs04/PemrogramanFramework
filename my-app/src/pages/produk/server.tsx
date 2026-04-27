import TampilanProduk from "../../views/produk";
import { ProductType } from "../../types/product.type";

const halamanProdukServer = (props: { products: ProductType[] }) => {
  const { products } = props;
  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        Halaman Produk Server
        </h1>
      <TampilanProduk products={products} />
    </div>
  );
};

export default halamanProdukServer;

// Fungsi getServerSideProps akan dipanggil setiap kali halaman ini diakses, 
// dan akan mengambil data produk dari API sebelum merender halaman.
export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`);
  const respone = await res.json();

  return {
    props: {
      products: respone.data, // Pastikan untuk memberikan nilai default jika data tidak tersedia
    },
  };
}