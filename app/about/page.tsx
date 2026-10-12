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
        This foundation publishes one sequence-and-selection lesson and one
        offline task. It is not full-topic or full-syllabus coverage, an
        official resource, or a replacement for school teaching.
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
      <ul>
        <li>Python programming: partial, sequence and selection published.</li>
        <li>Algorithms and data structures: planned, no lessons published.</li>
        <li>Relational databases and SQL: planned, no lessons published.</li>
      </ul>
      <h2>Content provenance & corrections</h2>
      <p>
        Explanations, scenarios, questions and model solutions were created for
        this project. Mapping and executable examples were checked by Codex;
        independent teacher review is pending. Offline completion is
        self-marked.
      </p>
      <p>
        For corrections, include the lesson URL and a description in the{" "}
        <a href="https://github.com/josthan12/h2compute/issues">
          repository issue tracker
        </a>
        . Do not include personal information or credentials.
      </p>
    </article>
  );
}
