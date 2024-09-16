import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Toaster } from "~/components/ui/sonner";
import QueryWrapper from "~/wrapper/QueryWrapper";
import RouteChangedWrapper from "~/wrapper/RouteChangedWrapper";
import Loading from "~/components/ui/loading";

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
        <RouteChangedWrapper>
          <QueryWrapper>
            <Loading />
            <Toaster
              position="top-right"
              closeButton
              toastOptions={{ className: "text-lg" }}
            />
            {children}
          </QueryWrapper>
        </RouteChangedWrapper>
      </body>
    </html>
  );
}
