import Navbar from "../navbar";
import styles from "./index.module.scss";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.PageLayout}>
      <h1>Facelock</h1>
      <div className={styles.Content}>
        <Navbar />
        <div className={styles.Children}>{children}</div>
      </div>
    </div>
  );
}
