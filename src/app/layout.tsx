import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "Create Poll",
  description: "สร้างโพล แชร์ลิงก์ และดูผลโหวตแบบเรียลไทม์",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="mx-auto w-full max-w-xl px-4 pt-8">
          <Link href="/" className="text-lg font-semibold text-accent">
            📊 Create Poll
          </Link>
        </header>
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
