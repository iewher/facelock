import { Metadata } from "next";

import { PageLayout } from "@/components";
import Favorites from "./favorites";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Список избранных элементов",
};

export default function Page() {
  return (
    <PageLayout title="Избранное">
      <Favorites />
    </PageLayout>
  );
}
