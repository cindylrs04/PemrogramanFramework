import Image from "next/image"; 
import styles from "@/styles/404.module.scss";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Halaman Tidak Ditemukan</p>

        {/* Modifikasi bagian ini sesuai instruksi gambar */}
        <Image
          src="/page-not-found.png"
          alt="404"
          width={400}
          height={200}
          className={styles.image}
        />

        <Link href="/" className={styles.button}>
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}