import PageLayout from "@/components/page-layout";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <PageLayout>
      <div className={styles.Content}>Facelock</div>
    </PageLayout>
  );
}
