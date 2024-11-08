import styles from "./index.module.scss";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.PageLayout}>{children}</div>;
}
