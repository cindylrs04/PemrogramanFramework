import { useSession } from "next-auth/react";
import styles from "./profile.module.css";

const HalamanProfile = () => {
  const { data, status }: any = useSession();

  if (status === "loading") {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.avatar}>
          {data?.user?.fullname?.charAt(0) || "U"}
        </div>

        <h2>{data?.user?.fullname || "User"}</h2>
        <p className={styles.email}>{data?.user?.email || "-"}</p>

        <span className={styles.badge}>Active User</span>

      </div>
    </div>
  );
};

export default HalamanProfile;