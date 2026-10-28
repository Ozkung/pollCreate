import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Serif_Thai } from "next/font/google";
import "./globals.css";

// Times New Roman has no Thai glyphs; this serif covers Thai text.
const notoSerifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Create Poll",
  description: "สร้างโพล แชร์ลิงก์ และดูผลโหวตแบบเรียลไทม์",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${notoSerifThai.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="mx-auto w-full max-w-xl px-4 pt-12">
          <Link
            href="/"
            className="inline-block origin-left font-bold transition-transform duration-200 ease-out hover:scale-150"
          >
            Create Poll
          </Link>
        </header>
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-13">
          {children}
        </main>
      </body>
    </html>
  );
}
