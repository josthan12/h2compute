import type { Metadata } from "next";
import Link from "next/link";
import {
  ProgressProvider,
  ProgressControls,
} from "@/components/ProgressProvider";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "H2Compute · Learn with understanding",
    template: "%s · H2Compute",
  },
  description:
    "Independent H2 Computing theory, explanatory quizzes and offline practice. Free, with local progress.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="h2notes">
      <body>
        <ProgressProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <header className="site-header">
            <Link className="brand" href="/">
              <span className="brand-mark" aria-hidden="true">
                H2
              </span>
              Compute
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/topics/python-control-flow">Learning path</Link>
              <Link href="/about">About & coverage</Link>
            </nav>
            <span className="header-note">Free · No account</span>
          </header>
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <div className="shell">
            <ProgressControls />
          </div>
          <footer className="shell">
            <p>
              Independent learning for H2 Computing 9569. Partial coverage; no
              SEAB, MOE, NUS or school affiliation.
            </p>
            <Link href="/privacy">Privacy & local progress</Link>
          </footer>
        </ProgressProvider>
      </body>
    </html>
  );
}
