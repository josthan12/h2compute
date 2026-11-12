import Link from "next/link";
import { TOPICS } from "@/lib/lesson-ids";
import { syllabus } from "@/lib/content";
export const metadata = { title: "About & syllabus coverage" };
export default function About() {
  return (
    <article className="shell narrow notes-prose">
      <p className="eyebrow">Independent · Original · Focused</p>
      <h1>About & coverage</h1>
      <p className="lead">
        H2Compute is an independent learning project for H2 Computing 9569.
      </p>
      <p>
        This theory beta publishes eight lessons with explanatory checkpoints
        and offline tasks across three bounded paths. It covers selected
        concepts, not complete topic areas or the full syllabus. This is not an official resource, or a replacement for school
        teaching.
      </p>
      <h2>2026 coverage register</h2>
      {Object.entries(syllabus.outcomes).map(([id, outcome]) => (
        <section
          className="card lesson-card border border-base-300 bg-base-100"
          key={id}
        >
          <h3>
            {id} · {outcome.coverage}
          </h3>
          <p>{outcome.summary}</p>
          <p>{outcome.taught}</p>
          <p className="meta">
            Printed page {outcome.page} · verified {syllabus.verifiedOn}
          </p>
        </section>
      ))}
      <p>
        <a href={syllabus.source}>Official SEAB 2026 syllabus</a> is the mapping
        source. Summaries here are paraphrases. All unlisted outcomes are not
        covered by this foundation.
      </p>
      <h2>Within the MVP</h2>
      <ul>{TOPICS.map(topic => <li key={topic.id}><Link href={`/topics/${topic.id}`}>{topic.area}: published, partial</Link>. {topic.coverage}</li>)}</ul>
      <p>Planned: further material within the three approved areas, subject to review. Not covered: every unlisted syllabus outcome, including NoSQL, networking and other syllabus areas. Planning is not a publication promise.</p>
      <h2>Content provenance & corrections</h2>
      <p>
        Explanations, scenarios, questions and model solutions were created for
        this project. Mapping and executable examples were checked by Codex;
        independent teacher review is pending. Offline completion is
        self-marked.
      </p>
      <h2 id="feedback">Feedback & corrections</h2>
      <p>
        For corrections, include the lesson URL and a description in the{" "}
        <a href="https://github.com/josthan12/h2compute/issues">
          repository issue tracker
        </a>
        . Reporting there requires GitHub sign-in; learning here requires no account. Do not include personal information or credentials.
      </p>
    </article>
  );
}
