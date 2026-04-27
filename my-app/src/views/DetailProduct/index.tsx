import React from "react";
import Image from "next/image";
import { ProductType } from "../../types/product.type";
import styles from "../DetailProduct/detailProduct.module.scss";

type ProductDetailType = ProductType & {
  description?: string;
};

const DetailProduk = ({ products }: { products: ProductDetailType }) => {
  return (
    <>
      <h1 className={styles.title}>Detail Produk</h1>

      <div className={styles.produkdetail}>
        
        <div className={styles.produkdetail__image}>
          {products.image ? (
            <Image
              src={products.image}
              alt={products.name}
              width={500}
              height={500}
              priority
              quality={80}
              className={styles.produkdetail__img}
            />
          ) : (
            <div className="w-[500px] h-[500px] bg-gray-200 flex items-center justify-center">
              <span>Gambar tidak tersedia</span>
            </div>
          )}
        </div>

        <div className={styles.produkdetail__info}>
          <h1 className={styles.produkdetail__name}>
            {products.name}
          </h1>

          <p className={styles.produkdetail__category}>
            {products.category}
          </p>

          <p className={styles.produkdetail__price}>
            Rp {products.price ? products.price.toLocaleString("id-ID") : "0"}
          </p>

          <p className={styles.produkdetail__description}>
            {products.description ||
              `Produk ${products.name} merupakan bagian dari kategori ${products.category}.`}
          </p>
        </div>

      </div>
    </>
  );
};

export default DetailProduk;