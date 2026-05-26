export type TimerMode = null | 30 | 60;

const KEY = "spark-timer";

export function getTimerMode(): TimerMode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "30") return 30;
    if (v === "60") return 60;
    return null;
  } catch {
    return null;
  }
}

export function setTimerMode(mode: TimerMode): void {
  try {
    if (mode === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, String(mode));
  } catch {}
}
