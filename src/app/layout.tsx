"use client";

import { ConfigProvider } from "antd";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            token: {
              motionDurationMid: "0.0s",
              borderRadius: 0,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
