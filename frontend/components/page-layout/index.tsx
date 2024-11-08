import Navbar from "../navbar";
import styles from "./index.module.scss";

export default function PageLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className={styles.PageLayout}>
      <h1>Facelock</h1>
      <div className={styles.Content}>
        <Navbar />
        <div className={styles.Children}>
          <h3>{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}
