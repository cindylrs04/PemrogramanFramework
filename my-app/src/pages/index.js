import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Halaman Utama</h1>
      <p>Praktikum Setup Project Next.js (Pages Router)</p>

      <Link href="/about">
        <a>Ke Halaman About</a>
      </Link>
    </div>
  );
}