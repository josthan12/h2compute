"use client";
import {
  createContext,
  useContext,
  useEffect,
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
  STORAGE_KEY,
  type Progress,
  type LessonProgress,
  updateLesson,
} from "@/lib/progress";
import { LESSON_IDS, type LessonId } from "@/lib/lesson-ids";
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
  update: (lessonId: LessonId, value: Partial<LessonProgress>) => void;
  reset: () => void;
  notice: string;
  ready: boolean;
} | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "loading");
  const [memory, setMemory] = useState<Progress | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    function handleExternalReset(event: StorageEvent) {
      if (event.newValue !== null) return;
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      try {
        if (event.storageArea !== window.localStorage) return;
      } catch {
        return;
      }
      // A failed save may leave memory overriding storage, even after reset.
      setMemory(null);
      setNotice("Local progress reset in another tab.");
    }
    window.addEventListener("storage", handleExternalReset);
    return () => window.removeEventListener("storage", handleExternalReset);
  }, []);
  const decoded = decodeProgress(
    raw === "loading" || raw === "unavailable" ? null : raw,
  );
  const progress = memory ?? decoded.progress;
  function update(lessonId: LessonId, value: Partial<LessonProgress>) {
    // Re-read storage to preserve updates from another tab before writing.
    const latest = memory ?? decodeProgress(snapshot()).progress;
    const next = updateLesson(latest, lessonId, value);
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
        ? "Saved progress was invalid or used an unsupported version. Invalid entries start fresh; valid lesson progress is preserved."
        : decoded.migrated
          ? "Your earlier lesson progress is preserved. The next learning update will save it in the new format."
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
function useProgressState() {
  const value = useContext(Context);
  if (!value) throw new Error("ProgressProvider missing");
  return value;
}
export function useProgress(lessonId: LessonId) {
  const state = useProgressState();
  return {
    ...state,
    progress: state.progress.lessons[lessonId],
    update: (value: Partial<LessonProgress>) => state.update(lessonId, value),
  };
}
export function ProgressBadge({ lessonId }: { lessonId?: LessonId }) {
  const { progress, ready } = useProgressState();
  const entry = lessonId ? progress.lessons[lessonId] : null;
  const count = LESSON_IDS.filter(
    (id) => progress.lessons[id].completed,
  ).length;
  return (
    <span className="badge badge-outline h-auto min-h-8 text-wrap border-base-300 bg-base-200 px-3 py-1 font-semibold">
      {!ready
        ? "Loading progress…"
        : entry
          ? entry.completed
            ? "Lesson complete"
            : entry.quizReviewed || entry.practiceReviewed
              ? "In progress"
              : "Not yet completed"
          : `${count} of ${LESSON_IDS.length} lessons complete`}
    </span>
  );
}
export function ProgressControls() {
  const { progress, notice, ready, reset } = useProgressState();
  const completed = LESSON_IDS.filter(
    (id) => progress.lessons[id].completed,
  ).length;
  const [confirm, setConfirm] = useState(false);
  return (
    <section
      className="card progress-card border border-base-300 bg-base-200"
      aria-label="Local learning progress"
    >
      <div>
        <strong>Your learning, your device</strong>
        <p>
          {`${ready ? completed : 0} of ${LESSON_IDS.length} published journeys complete.`}{" "}
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
          <p>
            Reset all lesson, checkpoint and practice progress on this browser?
          </p>
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
