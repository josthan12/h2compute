import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { TOPICS } from "@/lib/lesson-ids";
import { ProgressBadge } from "@/components/ProgressProvider";
export default function Home() {
  return (
    <div className="shell">
      <section className="home-hero">
        <div>
          <p className="eyebrow">H2 Computing / Priority-topic beta</p>
          <h1>
            Understand the code.
            <br />
            <em>Then make it yours.</em>
          </h1>
          <p className="lead">
            Clear explanations, small checkpoints, and time to practise. Work
            through Python, searching and relational SQL paths, at your own pace.
          </p>
          <Link className="btn btn-primary" href="/topics/python-control-flow">
            Explore Python control flow <span aria-hidden="true">→</span>
          </Link>
          <p className="meta">Original content · Local progress · No sign-up</p>
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
            Learn to follow execution in order and select the right branch.
            Three lessons with worked examples, explanatory checkpoints and
            offline tasks.
          </p>
          <ProgressBadge topicId="python-control-flow" />
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
      <section aria-labelledby="learning-paths" className="my-12">
        <p className="eyebrow">Choose your next concept</p>
        <h2 id="learning-paths">Three connected learning paths</h2>
        {TOPICS.map(topic => <article className="card lesson-card border border-base-300 bg-base-100" key={topic.id}>
          <p className="eyebrow">{topic.area} · {topic.lessonIds.length} lessons</p>
          <h3><Link href={`/topics/${topic.id}`}>{topic.title}</Link></h3>
          <p>{topic.summary}</p><ProgressBadge topicId={topic.id} />
          <Link className="mt-4" href={`/topics/${topic.id}`}>Explore this path →</Link>
        </article>)}
      </section>
      <section className="coverage-strip">
        <h2>A focused beginning</h2>
        <p>
          Eight lessons teach selected parts of Python control flow, list searching
          and relational data/SQL. Each has a checkpoint and offline task.
          Browser execution is disabled. Full-topic and full-syllabus coverage
          are not claimed.
        </p>
        <Link href="/about">See syllabus mapping & limits →</Link>
      </section>
    </div>
  );
}
