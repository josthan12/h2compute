import Link from "next/link";
import { notFound } from "next/navigation";
import { headings, lessons, exercises, syllabus, syllabusPages } from "@/lib/content";
import { TOPICS } from "@/lib/lesson-ids";
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
  const path = lessons();
  const lesson = path.find((item) => item.slug === slug);
  if (!lesson) notFound();
  const topic = TOPICS.find(topic => topic.id === lesson.topic)!;
  const topicPath = path.filter(item => item.topic === lesson.topic);
  const position = topicPath.findIndex((item) => item.slug === lesson.slug);
  const previous = topicPath[position - 1];
  const next = topicPath[position + 1];
  const exercise = exercises().find(
    (item) => item.slug === lesson.relatedExercises[0],
  );
  if (!exercise) notFound();
  return (
    <div className="shell lesson-layout">
      <aside className="toc">
        <Link href={`/topics/${topic.id}`}>← {topic.title}</Link>
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
          {String(position + 1).padStart(2, "0")} / Read & trace ·{" "}
          {lesson.estimatedMinutes} min · Core
        </p>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.summary}</p>
        <p className="meta">
          SEAB 2026 · Outcomes {lesson.syllabus.outcomes.join(", ")} · Printed pages {syllabusPages(lesson.syllabus.outcomes)} ·
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
        <Checkpoint
          key={lesson.slug}
          questions={lesson.quiz}
          lessonId={lesson.slug}
        />
        <section id="offline-practice" className="journey-section">
          <p className="eyebrow">03 / Try it yourself</p>
          <h2>Offline practice</h2>
          <p>
            {exercise.summary} Try it offline, then compare the model
            explanation. Allow about {exercise.estimatedMinutes} minutes.
          </p>
          <Link
            className="btn btn-primary"
            href={`/exercises/${exercise.slug}`}
          >
            Try the offline task →
          </Link>
        </section>
        <Completion lessonId={lesson.slug} />
        <nav
          aria-label="Lesson sequence"
          className="mt-8 flex flex-wrap justify-between gap-4"
        >
          {previous ? (
            <Link href={`/lessons/${previous.slug}`}>
              ← Previous: {previous.title}
            </Link>
          ) : (
            <Link href={`/topics/${topic.id}`}>← Topic overview</Link>
          )}
          {next ? (
            <Link href={`/lessons/${next.slug}`}>Next: {next.title} →</Link>
          ) : (
            <Link href={`/topics/${topic.id}`}>Review the topic →</Link>
          )}
        </nav>
        <section className="source-note">
          <h2>Sources & review</h2>
          <p>{lesson.provenance}</p>
          <p>
            Mapping and example review: {lesson.reviewedOn}. {lesson.reviewer}.
          </p>
          <p>
            <a href={syllabus.source}>Official 2026 syllabus, printed pages {syllabusPages(lesson.syllabus.outcomes)}</a>
            . {lesson.coverageNote}
          </p>
        </section>
      </article>
    </div>
  );
}
