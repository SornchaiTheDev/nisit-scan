import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Toaster } from "~/components/ui/sonner";

const prompt = Prompt({
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nisit Scan",
  description: "Web application for scan nisit card",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={prompt.className}>
        <Toaster
          richColors
          position="top-center"
          toastOptions={{ className: "text-lg" }}
        />
        {children}
      </body>
    </html>
  );
}
