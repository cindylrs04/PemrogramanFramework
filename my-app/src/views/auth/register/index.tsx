import Link from "next/link";
import style from "../../auth/register/register.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";

const TampilanRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // ✅ AMBIL + TRIM DATA
    const email = (formData.get("user_email") as string)?.trim();
    const fullname = (formData.get("Fullname") as string)?.trim();
    const password = (formData.get("user_password") as string)?.trim();

    // ✅ DEBUG (boleh dihapus nanti)
    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    // ✅ VALIDASI EMAIL
    if (!email || email === "") {
      setError("Email wajib diisi");
      setIsLoading(false);
      return;
    }

    // ✅ VALIDASI PASSWORD
    if (!password || password.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullname,
          password,
          role: "member",
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        form.reset();
        push("/auth/login");
      } else {
        setError(result.message || "Terjadi kesalahan");
      }
    } catch (err) {
      setError("Gagal terhubung ke server");
    }

    setIsLoading(false);
  };

  return (
    <div className={style.register}>
      {error && <p className={style.register__error}>{error}</p>}
      
      <h1 className={style.register__title}>Halaman Register</h1>

      <div className={style.register__form}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className={style.register__form__item}>
            <label className={style.register__form__item__label}>
              Email
            </label>
            <input
              type="email"
              name="user_email"
              autoComplete="off"
              placeholder="Email"
              className={style.register__form__item__input}
            />
          </div>

          <div className={style.register__form__item}>
            <label className={style.register__form__item__label}>
              Fullname
            </label>
            <input
              type="text"
              name="Fullname"
              autoComplete="off"
              placeholder="Fullname"
              className={style.register__form__item__input}
            />
          </div>

          <div className={style.register__form__item}>
            <label className={style.register__form__item__label}>
              Password
            </label>
            <input
              type="password"
              name="user_password"
              autoComplete="new-password"
              placeholder="Password"
              className={style.register__form__item__input}
            />
          </div>

          <button 
            type="submit" 
            className={style.register__form__item__button}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>

        <br />

        <p className={style.register__form__item__text}>
          Sudah punya akun? <Link href="/auth/login">Ke Halaman Login</Link>
        </p>
      </div>
    </div>
  );
};

export default TampilanRegister;