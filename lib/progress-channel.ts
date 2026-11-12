const CHANNEL = "h2compute.progress.reset";
const CLEARED = "h2compute-reset-cleared-v1";
const PENDING = "h2compute-reset-pending-v1";
type Channel = Pick<BroadcastChannel, "onmessage" | "postMessage" | "close">;
export type ProgressResetChannel = {
  notify: (cleared: boolean) => boolean;
  close: () => void;
};
export function openProgressResetChannel(
  onReset: (cleared: boolean) => void,
  create: () => Channel | null = () =>
    typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(CHANNEL),
): ProgressResetChannel {
  let channel: Channel | null = null;
  let closed = false;
  try {
    channel = create();
    if (channel) channel.onmessage = (event: MessageEvent<unknown>) => {
      if (!closed && (event.data === CLEARED || event.data === PENDING)) {
        onReset(event.data === CLEARED);
      }
    };
  } catch {
    // Storage events remain available when channel creation is unsupported/denied.
    channel = null;
  }
  return {
    notify(cleared) {
      if (!channel || closed) return false;
      try {
        channel.postMessage(cleared ? CLEARED : PENDING);
        return true;
      } catch {
        return false;
      }
    },
    close() {
      if (closed) return;
      closed = true;
      if (channel) {
        channel.onmessage = null;
        try { channel.close(); } catch { /* Cleanup cannot block navigation. */ }
      }
    },
  };
}
