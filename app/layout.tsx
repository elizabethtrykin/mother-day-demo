import type { Metadata } from "next";
import { geistMono, seasonSans } from "./fonts/index";
import "./styles/globals.css";
import { StyleSheetManager } from 'styled-components';
import StyledComponentsRegistry from './registry';

export const metadata: Metadata = {
  title: "VAPI Twitter Clone App",
  description: "Created by VAPI, to clone your Twitter personality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistMono.variable} ${seasonSans.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
