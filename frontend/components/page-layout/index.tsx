import { FiPlus } from "react-icons/fi";

import { PrimaryButton } from "@/components";
import Navbar from "../navbar";
import styles from "./index.module.scss";

export function PageLayout({
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
          <div className={styles.Header}>
            <h3>{title}</h3>
            <PrimaryButton icon={<FiPlus />}>Создать</PrimaryButton>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
