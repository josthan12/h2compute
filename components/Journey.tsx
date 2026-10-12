"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import type { Question } from "@/lib/content";
import { checkAnswers } from "@/lib/quiz";
import { useProgress } from "./ProgressProvider";
export function Checkpoint({ questions }: { questions: Question[] }) {
  const { progress, update, ready } = useProgress();
  const [answers, setAnswers] = useState<(number | null)[]>(
    questions.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);
  const result = checkAnswers(
    answers,
    questions.map((q) => q.answer),
  );
  return (
    <section id="checkpoint" className="journey-section">
      <span className="eyebrow">02 / Check your understanding</span>
      <h2>Checkpoint</h2>
      <p>
        Choose an answer for each question, then read every explanation. Retry
        as often as you like.
      </p>
      {progress.quizReviewed && (
        <p className="badge badge-outline h-auto min-h-8 text-wrap border-base-300 bg-base-200 px-3 py-1 font-semibold">
          Checkpoint reviewed on this browser
        </p>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (result) {
            setSubmitted(true);
            update({ quizReviewed: true });
          }
        }}
      >
        {questions.map((question, index) => (
          <fieldset className="fieldset quiz-fieldset" key={question.id}>
            <legend className="fieldset-legend text-wrap">
              {index + 1}. {question.prompt}
            </legend>
            <p className="meta">
              2026 outcomes {question.outcomes.join(", ")} ·{" "}
              {question.estimatedMinutes} min
            </p>
            {question.options.map((option, optionIndex) => (
              <label className="quiz-option" key={option.text}>
                <input
                  type="radio"
                  className="radio radio-primary radio-sm mt-1 shrink-0 border-secondary checked:border-primary"
                  name={question.id}
                  checked={answers[index] === optionIndex}
                  onChange={() => {
                    setAnswers(
                      answers.map((answer, answerIndex) =>
                        answerIndex === index ? optionIndex : answer,
                      ),
                    );
                    setSubmitted(false);
                  }}
                />
                <span>{option.text}</span>
              </label>
            ))}
            {submitted && (
              <div className="feedback">
                <strong>
                  {answers[index] === question.answer
                    ? "Correct."
                    : "Revisit this idea."}
                </strong>
                <ul>
                  {question.options.map((option, optionIndex) => (
                    <li key={option.text}>
                      <strong>
                        {optionIndex === question.answer
                          ? "Correct answer"
                          : "Alternative"}
                        : {option.text}.
                      </strong>{" "}
                      {option.explanation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </fieldset>
        ))}
        <button className="btn btn-primary" disabled={!result || !ready}>
          Check answers
        </button>
        <p className="status" role="status">
          {submitted && result
            ? `${result.correct} of ${result.total} correct. Explanations are shown beneath each question. You can change your answers and check again.`
            : !result
              ? "Answer both questions to check your reasoning."
              : ""}
        </p>
      </form>
    </section>
  );
}
export function PracticeReview({ model }: { model: ReactNode }) {
  const { progress, update, ready } = useProgress();
  const [open, setOpen] = useState(false);
  return (
    <section className="journey-section">
      <details
        className="collapse collapse-arrow my-4 border border-base-300 bg-base-100"
        open={open}
        onToggle={(event) => setOpen(event.currentTarget.open)}
      >
        <summary className="collapse-title font-semibold">
          Show model explanation
        </summary>
        <div className="collapse-content">{model}</div>
      </details>
      <p>
        Compare your branch order and boundary reasoning. Completion is
        self-marked, not a grade.
      </p>
      <button
        className="btn btn-primary"
        disabled={!open || !ready || progress.practiceReviewed}
        onClick={() => update({ practiceReviewed: true })}
      >
        {progress.practiceReviewed
          ? "Model explanation reviewed"
          : "I reviewed the model explanation"}
      </button>
      <p>
        <Link href="/lessons/sequence-and-selection#completion">
          Return to lesson completion →
        </Link>
      </p>
    </section>
  );
}
export function Completion() {
  const { progress, update, ready } = useProgress();
  return (
    <section
      id="completion"
      className="card journey-section completion bg-base-200"
    >
      <span className="eyebrow">04 / Make it stick</span>
      <h2>Finish your journey</h2>
      <p>
        Can you explain the first matching branch and what runs afterwards? Mark
        complete when you have read the lesson, reviewed the checkpoint and
        compared your offline attempt with the model.
      </p>
      <ul>
        <li>
          Checkpoint: {progress.quizReviewed ? "reviewed" : "awaiting review"}
        </li>
        <li>
          Offline model:{" "}
          {progress.practiceReviewed ? "reviewed" : "awaiting review"}
        </li>
      </ul>
      <button
        className="btn btn-primary"
        disabled={
          !ready ||
          !progress.quizReviewed ||
          !progress.practiceReviewed ||
          progress.completed
        }
        onClick={() => update({ completed: true })}
      >
        {progress.completed ? "Journey complete" : "Mark lesson complete"}
      </button>
      <p className="status" role="status">
        {progress.completed
          ? "Completed locally. Revisit the lesson whenever you want to revise."
          : "Review both steps above to enable completion."}
      </p>
      <Link href="/topics/python-control-flow">Back to the topic →</Link>
    </section>
  );
}
