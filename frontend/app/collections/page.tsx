import { Metadata } from "next";

import { PageLayout } from "@/components";
import Collections from "./collections";

export const metadata: Metadata = {
  title: "Коллекции",
  description: "Список коллекций",
};

export default function Page() {
  return (
    <PageLayout title="Коллекции">
      <Collections />
    </PageLayout>
  );
}
