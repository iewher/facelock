"use client";

import { useState } from "react";
import { FiPlus, FiSave, FiX } from "react-icons/fi";

import { PrimaryButton, Input } from "@/components";
import Navbar from "../navbar";
import styles from "./index.module.scss";

export function PageLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [isShowModal, setIsShowModal] = useState(false);

  return (
    <div className={styles.PageLayout}>
      <h1>Facelock</h1>
      <div className={styles.Content}>
        <div className={styles.MainContent}>
          <Navbar />
          <div className={styles.Children}>
            <div className={styles.Header}>
              <h3>{title}</h3>
              <PrimaryButton
                icon={isShowModal ? <FiX /> : <FiPlus />}
                onClick={() => setIsShowModal(!isShowModal)}
              >
                {isShowModal ? "Закрыть" : "Создать"}
              </PrimaryButton>
            </div>
            {children}
          </div>
        </div>
        <CreateForm isOpen={isShowModal} />
      </div>
    </div>
  );
}

function CreateForm({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={styles.CreateForm}
      style={{
        display: isOpen ? "flex" : "none",
      }}
    >
      <h3>Создать элемент</h3>

      <form>
        <Input label="Название" placeholder="Example" />
        <Input label="Пароль" placeholder="Example123" />
        <Input label="Ссылка" placeholder="https://example.com" />

        <PrimaryButton icon={<FiSave />} type="submit">
          Сохранить
        </PrimaryButton>
      </form>
    </div>
  );
}
