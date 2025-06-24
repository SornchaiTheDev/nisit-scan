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

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = {
            API_URL:"${process.env.API_URL}",
            BASE_PATH:"${process.env.BASE_PATH}"
            }
            `,
          }}
        ></script>
      </head>
      <body className={prompt.className}>
        <RouteChangedWrapper>
          <QueryWrapper>
            <Loading />
            <Toaster
              position="top-right"
              closeButton
              richColors
              toastOptions={{ className: "text-lg" }}
            />
            {children}
          </QueryWrapper>
        </RouteChangedWrapper>
      </body>
    </html>
  );
}
