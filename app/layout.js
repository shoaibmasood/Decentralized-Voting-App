"use client";
import { AppContextWrapper } from "./context/AppContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AppContextWrapper>
        <body>{children}</body>
      </AppContextWrapper>
    </html>
  );
}
