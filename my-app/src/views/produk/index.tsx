import styles from "../../pages/produk/produk.module.scss";
import Link from "next/link";
import Image from "next/image";

type ProductType = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

const TampilanProduk = ({ products }: { products: ProductType[] }) => {
  return (
    <div className={styles.produk}>
      <h1 className={styles.produk__title} data-testid="title">
        Product Page
      </h1>
      <div className={styles.produk__content}>
        {/* Perbaikan menggunakan Optional Chaining sesuai gambar */}
        {products?.length > 0 ? (
          <>
            {products?.map((product: ProductType) => (
              <Link 
                href={`/produk/${product.id}`} 
                key={product.id} 
                className={styles.produk__content__item}
              >
                <div className={styles.produk__content__item__image}>
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    width={200} 
                    height={200} 
                  />
                </div>
                <h4 className={styles.produk__content__item__name}>
                  {product.name}
                </h4>
              </Link>
            ))}
          </>
        ) : (
          /* Bagian skeleton jika data kosong */
          <div className={styles.produk__content__skeleton}>
            <div className={styles.produk__content__skeleton__image}></div>
            <div className={styles.produk__content__skeleton__name}></div>
            <div className={styles.produk__content__skeleton__category}></div>
            <div className={styles.produk__content__skeleton__price}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TampilanProduk;