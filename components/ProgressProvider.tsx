"use client";
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  decodeProgress,
  emptyProgress,
  readProgress,
  resetProgress,
  saveProgress,
  type Progress,
} from "@/lib/progress";
const EVENT = "h2compute-progress";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}
function snapshot() {
  try {
    return readProgress(window.localStorage);
  } catch {
    return "unavailable";
  }
}
const Context = createContext<{
  progress: Progress;
  update: (value: Partial<Progress>) => void;
  reset: () => void;
  notice: string;
  ready: boolean;
} | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "loading");
  const [memory, setMemory] = useState<Progress | null>(null);
  const [notice, setNotice] = useState("");
  const decoded = decodeProgress(
    raw === "loading" || raw === "unavailable" ? null : raw,
  );
  const progress = memory ?? decoded.progress;
  function update(value: Partial<Progress>) {
    const next = { ...progress, ...value, version: 1 as const };
    next.completed =
      next.completed && next.quizReviewed && next.practiceReviewed;
    let saved = false;
    try {
      saved = saveProgress(window.localStorage, next);
    } catch {
      /* Storage may be blocked. */
    }
    setMemory(saved ? null : next);
    setNotice(
      saved
        ? "Progress saved on this browser."
        : "Progress is available for this visit only; browser storage could not save it.",
    );
    window.dispatchEvent(new Event(EVENT));
  }
  function reset() {
    let removed = false;
    try {
      removed = resetProgress(window.localStorage);
    } catch {
      /* Storage may be blocked. */
    }
    setMemory(removed ? null : emptyProgress);
    setNotice(
      removed
        ? "Local progress reset."
        : "Progress cleared for this visit. Stored progress could not be removed; try clearing site data in your browser.",
    );
    window.dispatchEvent(new Event(EVENT));
  }
  const message =
    notice ||
    (raw === "unavailable"
      ? "Browser storage is unavailable. You can learn and complete this journey for this visit."
      : decoded.recovered
        ? "Saved progress was invalid or used an unsupported version. Starting fresh; your next update will replace it."
        : "");
  return (
    <Context.Provider
      value={{
        progress,
        update,
        reset,
        notice: message,
        ready: raw !== "loading",
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useProgress() {
  const value = useContext(Context);
  if (!value) throw new Error("ProgressProvider missing");
  return value;
}
export function ProgressBadge() {
  const { progress, ready } = useProgress();
  return (
    <span className="badge badge-outline h-auto min-h-8 text-wrap border-base-300 bg-base-200 px-3 py-1 font-semibold">
      {!ready
        ? "Loading progress…"
        : progress.completed
          ? "Journey complete"
          : "One lesson · start here"}
    </span>
  );
}
export function ProgressControls() {
  const { progress, notice, ready, reset } = useProgress();
  const [confirm, setConfirm] = useState(false);
  return (
    <section
      className="card progress-card border border-base-300 bg-base-200"
      aria-label="Local learning progress"
    >
      <div>
        <strong>Your learning, your device</strong>
        <p>
          {ready && progress.completed
            ? "1 of 1 published journeys complete."
            : "0 of 1 published journeys complete."}{" "}
          Saved in this browser, without an account. Clearing site data removes
          it.
        </p>
      </div>
      {!confirm ? (
        <button
          className="btn btn-outline btn-primary"
          disabled={!ready}
          onClick={() => setConfirm(true)}
        >
          Reset local progress
        </button>
      ) : (
        <div className="reset-confirm">
          <p>Reset lesson, checkpoint and practice progress on this browser?</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              reset();
              setConfirm(false);
            }}
          >
            Confirm reset
          </button>{" "}
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setConfirm(false)}
          >
            Cancel
          </button>
        </div>
      )}
      <p className="status" role="status">
        {notice}
      </p>
    </section>
  );
}
