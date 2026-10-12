export const metadata = { title: "Privacy & local progress" };
export default function Privacy() {
  return (
    <article className="shell narrow notes-prose">
      <p className="eyebrow">No account required</p>
      <h1>Privacy & local progress</h1>
      <p className="lead">Your learning progress stays in this browser.</p>
      <h2>What is saved</h2>
      <p>
        The versioned local-storage entry h2compute.progress stores whether you
        reviewed each checkpoint and offline model, and marked each lesson
        complete. Answers, source code and personal details are not saved.
      </p>
      <p>
        Progress is specific to this browser and site address. Clearing site
        data, switching browsers or using private browsing can erase it. If
        storage is blocked, progress lasts only for this visit. Earlier
        Milestone 1 progress is preserved during migration. Invalid lesson
        entries start fresh while valid entries are kept. Unsupported versions
        start fresh.
      </p>
      <h2>Your controls</h2>
      <p>
        Use Reset local progress below and confirm to remove this site&apos;s
        progress entry. Other browser data is not affected. If removal is
        blocked, clear this site&apos;s data through your browser settings.
      </p>
      <h2>Requests and services</h2>
      <p>
        This foundation has no accounts, analytics, trackers or execution
        service. No code-entry or upload feature exists. Visiting the website
        still sends normal page requests to its host; the host may retain access
        logs according to its own terms. External links have their own privacy
        policies.
      </p>
    </article>
  );
}
