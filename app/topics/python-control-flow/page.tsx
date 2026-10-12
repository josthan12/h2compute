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
        Three connected lessons take you from branching to counted and
        conditional loops, then combine both in a program you can trace and
        explain.
      </p>
      <ProgressBadge />
      <h2 className="section-title">Start your journey</h2>
      {lessons().map((lesson, index) => (
        <article
          className="card lesson-card border border-base-300 bg-base-100"
          key={lesson.slug}
        >
          <p className="eyebrow">
            {String(index + 1).padStart(2, "0")} / Published lesson ·{" "}
            {lesson.estimatedMinutes} min
          </p>
          <h3>
            <Link href={`/lessons/${lesson.slug}`}>{lesson.title}</Link>
          </h3>
          <p>{lesson.summary}</p>
          <p className="meta">
            Lesson → explanatory checkpoint → offline practice → completion
          </p>
          <ProgressBadge lessonId={lesson.slug} />
          <Link
            className="btn btn-primary mt-4 self-start"
            href={`/lessons/${lesson.slug}`}
          >
            {index === 0 ? "Start lesson" : "Open lesson"} →
          </Link>
        </article>
      ))}
      <section className="coverage-strip">
        <h2>A bounded topic, ready to revise</h2>
        <p>
          Revisit any lesson independently. Completion is local and self-marked,
          not a grade.
        </p>
        <p>
          2026 outcomes 2.2.3 and 2.2.6 (printed page 8) are partially covered.
          Sequence, selection, iteration and short non-recursive traces are
          taught. Recursive tracing and full syllabus coverage remain outside
          this topic.
        </p>
        <Link href="/about">Read the coverage register →</Link>
      </section>
    </div>
  );
}
