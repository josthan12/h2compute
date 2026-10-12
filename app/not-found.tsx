import Link from "next/link";
export default function NotFound() {
  return (
    <div className="shell narrow">
      <p className="eyebrow">Page not found</p>
      <h1>Let’s return to the path.</h1>
      <p>This lesson may not be published yet, or the link may be incorrect.</p>
      <Link className="btn btn-primary" href="/topics/python-control-flow">
        Browse Python control flow →
      </Link>
    </div>
  );
}
