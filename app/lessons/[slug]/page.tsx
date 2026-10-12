import Link from "next/link";
import { notFound } from "next/navigation";
import { headings, lessons, syllabus } from "@/lib/content";
import Markdown from "@/components/Markdown";
import { Checkpoint, Completion } from "@/components/Journey";
export function generateStaticParams() {
  return lessons().map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title:
      lessons().find((lesson) => lesson.slug === slug)?.title ??
      "Lesson not found",
  };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessons().find((item) => item.slug === slug);
  if (!lesson) notFound();
  return (
    <div className="shell lesson-layout">
      <aside className="toc">
        <Link href="/topics/python-control-flow">← Python control flow</Link>
        <nav aria-label="On this page">
          <p className="eyebrow">In this lesson</p>
          {headings(lesson.body).map((heading) => (
            <a href={`#${heading.id}`} key={heading.id}>
              {heading.title}
            </a>
          ))}
          <a href="#checkpoint">Checkpoint</a>
          <a href="#offline-practice">Offline practice</a>
          <a href="#completion">Completion</a>
        </nav>
      </aside>
      <article className="lesson-content">
        <p className="eyebrow">
          01 / Read & trace · {lesson.estimatedMinutes} min · Core
        </p>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.summary}</p>
        <p className="meta">
          SEAB 2026 · Outcomes {lesson.syllabus.outcomes.join(", ")} · Page 8 ·
          Partial coverage
        </p>
        <div className="prerequisites">
          <strong>Before you begin</strong>
          <ul>
            {lesson.prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <Markdown body={lesson.body} />
        <Checkpoint questions={lesson.quiz} />
        <section id="offline-practice" className="journey-section">
          <p className="eyebrow">03 / Try it yourself</p>
          <h2>Offline practice</h2>
          <p>
            Build a score classifier. Trace it on paper or run it in your own
            Python installation, then compare the model explanation. Allow about
            8 minutes.
          </p>
          <Link className="btn btn-primary" href="/exercises/classify-a-score">
            Try the offline task →
          </Link>
        </section>
        <Completion />
        <section className="source-note">
          <h2>Sources & review</h2>
          <p>{lesson.provenance}</p>
          <p>
            Mapping and example review: {lesson.reviewedOn}. {lesson.reviewer}.
          </p>
          <p>
            <a href={syllabus.source}>Official 2026 syllabus, printed page 8</a>
            . Only sequence/selection and short non-recursive traces are covered
            here.
          </p>
        </section>
      </article>
    </div>
  );
}
