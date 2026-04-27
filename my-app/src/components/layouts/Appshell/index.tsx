import { useRouter } from "next/router";
import Navbar from "../navbar";
import Script from "next/script";
import { Poppins } from "next/font/google";

const disableNavbar = ['/auth/login', '/auth/register', '/404'];

type AppShellProps = {
  children: React.ReactNode;
};

// Ganti font jadi Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const AppShell = (props: AppShellProps) => {
  const { children } = props;
  const { pathname } = useRouter();

  return (
    <main className={poppins.className}>
      
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-1234567890"
        strategy="lazyOnload"
      />
      <Script id="ga-script" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1234567890');
        `}
      </Script>

      {!disableNavbar.includes(pathname) && <Navbar />}
      
      {children}
    </main>
  );
};

export default AppShell;