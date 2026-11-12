"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  decodeProgress,
  createEmptyProgress,
  createPendingProgress,
  applyPendingProgress,
  queueProgressUpdate,
  readProgressResult,
  resetProgressWithSignal,
  saveProgress,
  STORAGE_KEY,
  type Progress,
  type LessonProgress,
  type PendingProgress,
  type ProgressRead,
} from "@/lib/progress";
import { openProgressResetChannel, type ProgressResetChannel } from "@/lib/progress-channel";
import { LESSON_IDS, TOPICS, type TopicId, type LessonId } from "@/lib/lesson-ids";
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
    const stored = readProgressResult(window.localStorage);
    return stored.available
      ? stored.raw === null ? "absent" : `stored:${stored.raw}`
      : "unavailable";
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
  const [pending, setPending] = useState(createPendingProgress);
  const pendingRef = useRef(pending);
  const channelRef = useRef<ProgressResetChannel | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    // Keep identity for event filtering if the getter is denied later. Reads and
    // writes still use the live getter; this reference never bypasses its denial.
    let storageArea: Storage | null = null;
    try { storageArea = window.localStorage; } catch { /* Initially inaccessible. */ }
    function receiveReset(cleared: boolean) {
      const next = createPendingProgress(!cleared);
      pendingRef.current = next;
      setPending(next);
      setNotice("Local progress reset in another tab.");
    }
    const channel = openProgressResetChannel(receiveReset);
    channelRef.current = channel;
    function handleExternalReset(event: StorageEvent) {
      if (event.newValue !== null) return;
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      try {
        if (storageArea === null) storageArea = window.localStorage;
        if (event.storageArea !== storageArea) return;
      } catch {
        return;
      }
      receiveReset(true);
    }
    window.addEventListener("storage", handleExternalReset);
    return () => {
      window.removeEventListener("storage", handleExternalReset);
      channelRef.current = null;
      channel.close();
    };
  }, []);
  const decoded = decodeProgress(
    raw.startsWith("stored:") ? raw.slice("stored:".length) : null,
  );
  const progress = applyPendingProgress(decoded.progress, pending);
  function replacePending(next: PendingProgress) {
    // Actions can run before React rerenders. Never write inside a state updater.
    pendingRef.current = next;
    setPending(next);
  }
  function update(lessonId: LessonId, value: Partial<LessonProgress>) {
    let stored: ProgressRead = { available: false };
    try { stored = readProgressResult(window.localStorage); } catch { /* Blocked getter. */ }
    const base = stored.available ? decodeProgress(stored.raw).progress : createEmptyProgress();
    const nextPending = queueProgressUpdate(base, pendingRef.current, lessonId, value);
    const next = applyPendingProgress(base, nextPending);
    let saved = false;
    // An unreadable base must never be replaced by an invented empty snapshot.
    if (stored.available) {
      try { saved = saveProgress(window.localStorage, next); } catch { /* Blocked getter. */ }
    }
    replacePending(saved ? createPendingProgress() : nextPending);
    setNotice(
      saved
        ? "Progress saved on this browser."
        : "Progress is available for this visit only; browser storage could not save it.",
    );
    window.dispatchEvent(new Event(EVENT));
  }
  function reset() {
    let result: ReturnType<typeof resetProgressWithSignal> = {
      removed: false, cleared: false, notification: "channel",
    };
    try { result = resetProgressWithSignal(window.localStorage); } catch { /* Blocked getter. */ }
    replacePending(createPendingProgress(!result.cleared));
    const sent = result.notification === "channel" && channelRef.current?.notify(result.cleared);
    const peerNotice = result.notification === "uncertain" || (result.notification === "channel" && !sent)
      ? " Other open tabs may need their own reset."
      : "";
    setNotice((result.removed
      ? "Local progress reset."
      : "Progress cleared for this visit. Stored progress could not be removed; try clearing site data in your browser.") + peerNotice);
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
export function useProgressSummary() { return useProgressState(); }
export function ProgressBadge({ lessonId, topicId }: { lessonId?: LessonId; topicId?: TopicId }) {
  const { progress, ready } = useProgressState();
  const entry = lessonId ? progress.lessons[lessonId] : null;
  const ids: readonly LessonId[] = topicId ? TOPICS.find(topic => topic.id === topicId)!.lessonIds : LESSON_IDS;
  const count = ids.filter(
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
          : `${count} of ${ids.length} lessons complete`}
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
