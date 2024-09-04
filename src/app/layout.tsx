import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Toaster } from "~/components/ui/sonner";
import QueryWrapper from "~/wrapper/QueryWrapper";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
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
        <QueryWrapper>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{ className: "text-lg" }}
          />
          {children}
        </QueryWrapper>
      </body>
    </html>
  );
}
