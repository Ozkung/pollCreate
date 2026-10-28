import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Noto_Sans_Thai, Poppins, Prompt } from "next/font/google";
import { Decorations } from "./decorations";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["700", "800"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Poppins and Inter have no Thai glyphs; these are their closest Thai matches.
const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai"],
  weight: ["600", "700", "800"],
});
const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai"],
});

export const metadata: Metadata = {
  title: "Create Poll",
  description: "สร้างโพล แชร์ลิงก์ และดูผลโหวตแบบเรียลไทม์",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${poppins.variable} ${inter.variable} ${prompt.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Decorations />
        <header className="relative mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 pt-8 sm:px-8">
          <Link href="/" className="flex items-center gap-3 font-heading text-xl font-extrabold">
            <span className="num bg-accent" aria-hidden>
              ✓
            </span>
            Create Poll
          </Link>
          <Link href="/" className="btn btn-primary">
            + สร้างโพล
          </Link>
        </header>
        <main className="relative mx-auto w-full max-w-[1200px] flex-1 px-4 py-12 sm:px-8">
          {children}
        </main>
        <footer className="relative mx-auto w-full max-w-[1200px] px-4 pb-8 text-sm text-ink-muted sm:px-8">
          Create Poll · สร้างโพลง่ายๆ แชร์ได้ทันที
        </footer>
      </body>
    </html>
  );
}
