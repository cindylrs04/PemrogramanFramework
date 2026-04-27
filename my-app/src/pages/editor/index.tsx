import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const EditorPage = () => {
  const { data: session, status }: any = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== "editor")) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Dashboard Editor</h1>
      <p>Selamat datang, {session?.user?.fullname}. Anda memiliki akses khusus.</p>
    </div>
  );
};

export default EditorPage;