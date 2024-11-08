import styles from "./index.module.scss";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.PageLayout}>
      <h1>Facelock</h1>
      <div className={styles.Content}>{children}</div>
    </div>
  );
}
