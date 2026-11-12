import Link from "next/link";
import { notFound } from "next/navigation";
import { lessons } from "@/lib/content";
import { TOPICS } from "@/lib/lesson-ids";
import { ProgressBadge } from "@/components/ProgressProvider";
import TopicLessons from "@/components/TopicLessons";
export const dynamicParams = false;
export function generateStaticParams() { return TOPICS.map(({ id: slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: TOPICS.find(topic => topic.id === slug)?.title ?? "Topic not found" };
}
export default async function Topic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = TOPICS.find(topic => topic.id === slug);
  if (!topic) notFound();
  const path = lessons().filter(lesson => lesson.topic === topic.id);
  return <div className="shell narrow">
    <p className="eyebrow">{topic.area} / Learning path</p>
    <h1>{topic.title}</h1>
    <p className="lead">{topic.summary}</p>
    <p>{path.length} connected lessons with worked examples, explanatory checkpoints and offline practice. Revisit any lesson independently.</p>
    <ProgressBadge topicId={topic.id} />
    <h2 className="section-title">Start your journey</h2>
    <TopicLessons lessons={path.map(({ slug, title, summary, estimatedMinutes }) => ({ slug, title, summary, estimatedMinutes }))} />
    <section className="coverage-strip"><h2>A bounded topic, ready to revise</h2>
      <p>{topic.coverage}</p><p>Completion is local and self-marked, not a grade. Browser execution is unavailable; try tasks on paper or with your own local tools.</p>
      <Link href="/about">Read the coverage register →</Link>
    </section>
  </div>;
}
