import ReactMarkdown from "react-markdown";
import { headingId } from "@/lib/content";
import { Children, isValidElement, type ReactNode } from "react";
function plain(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) =>
      isValidElement<{ children?: ReactNode }>(child)
        ? plain(child.props.children)
        : String(child),
    )
    .join("");
}
export default function Markdown({ body }: { body: string }) {
  return (
    <div className="notes-prose">
      <ReactMarkdown
        skipHtml
        components={{
          h2: ({ children }) => (
            <h2 id={headingId(plain(children))}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 id={headingId(plain(children))}>{children}</h3>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
