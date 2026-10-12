import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { ProgressBadge } from "@/components/ProgressProvider";
export default function Home() {
  return (
    <div className="shell">
      <section className="home-hero">
        <div>
          <p className="eyebrow">H2 Computing / Theory foundation</p>
          <h1>
            Understand the code.
            <br />
            <em>Then make it yours.</em>
          </h1>
          <p className="lead">
            Clear explanations, small checkpoints, and time to practise. Start
            with one complete Python lesson, at your own pace.
          </p>
          <Link className="btn btn-primary" href="/topics/python-control-flow">
            Explore Python control flow <span aria-hidden="true">→</span>
          </Link>
          <p className="meta">
            Original content · Local progress · No sign-up
          </p>
        </div>
        <aside className="card hero-note border border-base-300 bg-base-200">
          <span className="eyebrow">A useful first question</span>
          <p className="large-question">
            Which branch
            <br />
            runs first?
          </p>
          <pre>
            <code>
              {fs.readFileSync(
                path.join(process.cwd(), "content/examples/branch-preview.py"),
                "utf8",
              )}
            </code>
          </pre>
          <p>For 75, the second branch prints Ready. Explain why.</p>
        </aside>
      </section>
      <section className="intro-grid">
        <div>
          <p className="eyebrow">Your first learning path</p>
          <h2>Python control flow</h2>
          <p>
            Learn to follow execution in order and select the right branch. One
            15-minute lesson, then an 8-minute offline task.
          </p>
          <ProgressBadge />
        </div>
        <ol className="path">
          <li>
            <span>01</span>
            <div>
              <strong>Read & trace</strong>
              <p>A worked example, explained step by step.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Check & understand</strong>
              <p>Two questions with reasons for every answer.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Practise & reflect</strong>
              <p>Try offline, compare a model, save your progress.</p>
            </div>
          </li>
        </ol>
      </section>
      <section className="coverage-strip">
        <h2>A focused beginning</h2>
        <p>
          Python programming is the first published area. Algorithms and data
          structures, and relational databases and SQL, are planned. This
          foundation covers only sequence and selection; full syllabus coverage
          is not claimed.
        </p>
        <Link href="/about">See syllabus mapping & limits →</Link>
      </section>
    </div>
  );
}
