"use client";
import React, { useEffect } from "react";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable zoom-in/out
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
      document.body.style.zoom = "0.99";
    });
    document.addEventListener("gesturechange", function (e) {
      e.preventDefault();
      document.body.style.zoom = "0.99";
    });
    document.addEventListener("gestureend", function (e) {
      e.preventDefault();
      document.body.style.zoom = "1";
    });
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
