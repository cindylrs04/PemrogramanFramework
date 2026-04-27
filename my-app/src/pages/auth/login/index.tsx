import Link from "next/link";
import style from "@/views/auth/login/login.module.scss"; 
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

const TampilanLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push, query } = useRouter();
  const [error, setError] = useState("");

  const callbackUrl: any = query.callbackUrl || "/";

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: event.target.email.value, 
        password: event.target.password.value,
        callbackUrl,
      });

      if (!res?.error) {
        setIsLoading(false);
        push(callbackUrl);
      } else {
        setIsLoading(false);
        setError(res?.error || "Login failed");
      }
    } catch (error) {
      setIsLoading(false);
      setError("wrong email or password");
    }
  };

  return (
    <div className={style.login}>
      {error && <p className={style.login__error}>{error}</p>}
      
      {/* Tambahan data-testid */}
      <h1 data-testid="title" className={style.login__title}>
        Halaman Login
      </h1>

      <div className={style.login__form}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className={style.login__form__item}>
            <label className={style.login__form__item__label}>
              Email
            </label>
            <input
              type="email"
              name="email" 
              autoComplete="email"
              placeholder="Email"
              className={style.login__form__item__input}
            />
          </div>

          <div className={style.login__form__item}>
            <label className={style.login__form__item__label}>
              Password
            </label>
            <input
              type="password"
              id="password" 
              name="password" 
              autoComplete="current-password"
              placeholder="password"
              className={style.login__form__item__input}
            />
          </div>

          <button 
            type="submit" 
            className={style.login__form__item__button}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "login"}
          </button>

          <br /> <br />
          
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl, redirect: false })}
            className={style.login__form__item__button}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "sign in with google"}
          </button>

          <br /> <br />

          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl, redirect: false })}
            className={`${style.login__form__item__button} ${style.login__form__item__button__github}`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "sign in with github"}
          </button>

        </form>

        <br />
        <p className={style.login__form__item__text}>
          tidak punya {""} akun?{" "}
          <Link href="/auth/register">Ke Halaman Register</Link>
        </p>
      </div>
    </div>
  );
};

export default TampilanLogin;