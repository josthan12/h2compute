"use client";
import { useState } from "react";
import Link from "next/link";
import type { Lesson } from "@/lib/content";
import { ProgressBadge, useProgressSummary } from "./ProgressProvider";
export default function TopicLessons({ lessons }: { lessons: Pick<Lesson, "slug" | "title" | "summary" | "estimatedMinutes">[] }) {
  const [incomplete, setIncomplete] = useState(false);
  const { progress, ready } = useProgressSummary();
  const visible = lessons.filter(lesson => !incomplete || !progress.lessons[lesson.slug].completed);
  return <>
    <div className="my-6 flex flex-wrap gap-3" role="group" aria-label="Filter lessons">
      <button className={incomplete ? "btn btn-outline btn-primary" : "btn btn-primary"} aria-pressed={!incomplete} onClick={() => setIncomplete(false)}>All lessons</button>
      <button className={incomplete ? "btn btn-primary" : "btn btn-outline btn-primary"} disabled={!ready} aria-pressed={incomplete} onClick={() => setIncomplete(true)}>Incomplete lessons</button>
    </div>
    <p role="status">{visible.length} {visible.length === 1 ? "lesson" : "lessons"} shown{incomplete ? " · incomplete on this browser" : ""}.</p>
    {visible.length === 0 && <p>All lessons in this path are marked complete. Choose All lessons to revisit them.</p>}
    {visible.map(lesson => <article className="card lesson-card border border-base-300 bg-base-100" key={lesson.slug}>
      <p className="eyebrow">{String(lessons.indexOf(lesson) + 1).padStart(2, "0")} / Published lesson · {lesson.estimatedMinutes} min</p>
      <h3><Link href={`/lessons/${lesson.slug}`}>{lesson.title}</Link></h3>
      <p>{lesson.summary}</p>
      <p className="meta">Lesson → explanatory checkpoint → offline practice → completion</p>
      <ProgressBadge lessonId={lesson.slug} />
      <Link className="btn btn-primary mt-4 self-start" href={`/lessons/${lesson.slug}`}>{lessons.indexOf(lesson) === 0 ? "Start lesson" : "Open lesson"} →</Link>
    </article>)}
  </>;
}
