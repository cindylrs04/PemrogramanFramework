import Script from 'next/script'; 
import Image from "next/image";
import styles from './navbar.module.css';
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data }: any = useSession();

  return (
    <div className={styles.navbar}>
      {/* Modifikasi Baris 16-19: Brand dengan ID dan Script */}
      <div className={styles.navbar__brand} id="title"></div>
      <Script id="title-script" strategy='lazyOnload'>
        {`document.getElementById('title').innerHTML = 'MyApp';`}
      </Script>

      <div className={styles.navbar__right}>
        {data ? (
          <>
            <div className={styles.navbar__user}>
              Welcome, {data.user?.fullname}
              
              {data.user?.image && (
                // Baris 28-32: Penggunaan komponen Image sesuai kotak merah
                <Image
                  src={data.user.image}
                  alt={data.user.fullname}
                  width={50}
                  height={50}
                  className={styles.navbar__user__image}
                />
              )}
            </div>
            <button 
              className={`${styles.navbar__button} ${styles["navbar__button--danger"]}`}
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button 
            className={`${styles.navbar__button} ${styles["navbar__button--primary"]}`}
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;