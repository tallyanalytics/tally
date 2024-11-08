import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { SWRConfig } from 'swr';
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

const inter = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Tally",
  description: "Generated by create turbo",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-background"}>
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html >
  );
}
