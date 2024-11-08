import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Facelock",
  description: "Менеджер паролей",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
