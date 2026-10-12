import Link from "next/link";
import { notFound } from "next/navigation";
import { exercises } from "@/lib/content";
import Markdown from "@/components/Markdown";
import { PracticeReview } from "@/components/Journey";
export function generateStaticParams() {
  return exercises().map(({ slug }) => ({ slug }));
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
      exercises().find((item) => item.slug === slug)?.title ?? "Task not found",
  };
}
export default async function ExercisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exercise = exercises().find((item) => item.slug === slug);
  if (!exercise) notFound();
  return (
    <article className="shell narrow">
      <Link href={`/lessons/${exercise.lesson}#offline-practice`}>
        ← Back to lesson
      </Link>
      <p className="eyebrow">
        03 / Offline practice · {exercise.estimatedMinutes} min · Core
      </p>
      <h1>{exercise.title}</h1>
      <p className="lead">{exercise.summary}</p>
      <p className="meta">
        2026 outcomes {exercise.syllabus.outcomes.join(", ")} · Page 8 · Partial
        coverage
      </p>
      <Markdown body={exercise.body} />
      <section>
        <h2>Visible examples</h2>
        <p>
          Each row is a separate example. Line breaks follow the input/output
          contract above.
        </p>
        <div className="table-scroll">
          <table className="table table-fixed">
            <caption>Visible normal and boundary examples</caption>
            <thead>
              <tr>
                <th scope="col" className="w-1/2 whitespace-normal">Input</th>
                <th scope="col" className="w-1/2 whitespace-normal">Expected output</th>
              </tr>
            </thead>
            <tbody>
              {exercise.examples.map((example) => (
                <tr key={example.input}>
                  <td>
                    <code className="inline-block whitespace-pre-wrap">
                      {example.input.trim()}
                    </code>
                  </td>
                  <td>
                    <code className="inline-block whitespace-pre-wrap">
                      {example.output.trim()}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>Need a nudge?</h2>
        {exercise.hints.map((hint, index) => (
          <details
            key={hint}
            className="collapse collapse-arrow my-4 border border-base-300 bg-base-100"
          >
            <summary className="collapse-title font-semibold">
              Hint {index + 1}
            </summary>
            <div className="collapse-content">
              <p>{hint}</p>
            </div>
          </details>
        ))}
      </section>
      <PracticeReview
        key={exercise.slug}
        lessonId={exercise.lesson}
        model={<Markdown body={exercise.model} />}
      />
      <section className="source-note">
        <h2>Content review</h2>
        <p>
          {exercise.provenance} Reviewed {exercise.reviewedOn}.{" "}
          {exercise.reviewer}.
        </p>
      </section>
    </article>
  );
}
