import Link from "next/link";
import { lessons } from "@/lib/content";
import { ProgressBadge } from "@/components/ProgressProvider";
export const metadata = { title: "Python control flow" };
export default function Topic() {
  return (
    <div className="shell narrow">
      <p className="eyebrow">Python programming / Topic 01</p>
      <h1>Python control flow</h1>
      <p className="lead">
        Follow the order. Choose a branch. Explain the result.
      </p>
      <p>
        This topic begins with sequence and selection. Counted and conditional
        loops, then combined flow and tracing, are the next lessons planned.
      </p>
      <ProgressBadge />
      <h2 className="section-title">Start your journey</h2>
      {lessons().map((lesson) => (
        <article
          className="card lesson-card border border-base-300 bg-base-100"
          key={lesson.slug}
        >
          <p className="eyebrow">
            01 / Published lesson · {lesson.estimatedMinutes} min
          </p>
          <h3>
            <Link href={`/lessons/${lesson.slug}`}>{lesson.title}</Link>
          </h3>
          <p>{lesson.summary}</p>
          <p className="meta">
            Lesson → explanatory checkpoint → offline practice → completion
          </p>
          <Link className="btn btn-primary" href={`/lessons/${lesson.slug}`}>
            Start lesson →
          </Link>
        </article>
      ))}
      <section className="coverage-strip">
        <h2>What comes next</h2>
        <p>02 · Counted and conditional loops — planned</p>
        <p>03 · Combined flow and tracing — planned</p>
        <p>
          2026 outcomes 2.2.3 and 2.2.6 (printed page 8) are partially covered.
          Iteration and recursive tracing are not taught here.
        </p>
        <Link href="/about">Read the coverage register →</Link>
      </section>
    </div>
  );
}
