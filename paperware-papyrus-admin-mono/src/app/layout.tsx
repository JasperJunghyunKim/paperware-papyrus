"use client";

import { ConfigProvider } from "antd";
import "./globals.css";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import ReactModal from "react-modal";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

ReactModal.setAppElement("body");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={{
              token: {
                motionDurationMid: "0.0s",
                borderRadius: 0,
              },
              components: {
                Table: {
                  padding: 0,
                },
              },
            }}
          >
            {children}
          </ConfigProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
