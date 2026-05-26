import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { MODES, FRIEND_SUBMODES, type TopMode, type FriendSubMode } from "@/lib/game";

type Search = { mode?: string };

export const Route = createFileRoute("/paywall")({
  component: Paywall,
  validateSearch: (s: Record<string, unknown>): Search => ({
    mode: typeof s.mode === "string" ? s.mode : undefined,
  }),
});

const ALL_MODES: TopMode[] = ["date", "couples", "friends", "family"];

const PERKS = [
  "200+ premium questions across all modes",
  "New decks added every month",
  "Shuffle, skip, and favorites",
  "Play offline, anywhere",
];

function getDisplayConfig(mode?: string) {
  if (!mode) return { ...MODES.couples, bgClass: MODES.couples.bgClass };
  if (mode in MODES) return MODES[mode as TopMode];
  if (mode in FRIEND_SUBMODES) {
    const sm = FRIEND_SUBMODES[mode as FriendSubMode];
    return { ...sm, bgClass: MODES.friends.bgClass, ring: sm.ring };
  }
  return MODES.couples;
}

function Paywall() {
  const { mode } = useSearch({ from: "/paywall" });
  const m = getDisplayConfig(mode);

  const currentTopMode = mode && mode in MODES ? (mode as TopMode) : "couples";
  const currentIdx = ALL_MODES.indexOf(currentTopMode);
  const suggestedMode = ALL_MODES[(currentIdx + 1) % ALL_MODES.length];
  const sm = MODES[suggestedMode];

  return (
    <div className={`${m.bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-8`}>
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <header className="flex items-center justify-end">
          <Link
            to="/"
            aria-label="Close"
            className="size-10 grid place-items-center rounded-full bg-white/70 backdrop-blur text-slate-700 hover:bg-white transition"
          >
            <X className="size-5" />
          </Link>
        </header>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              You're just getting started 🔥
            </h1>
            <p className="mt-3 text-slate-600">
              Unlock the full Wannas deck and keep the conversation going.
            </p>
          </div>

          <div className="mt-8 bg-white/90 backdrop-blur rounded-3xl p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)]">
            <ul className="space-y-3">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className={`mt-0.5 size-6 grid place-items-center rounded-full ${m.accent.split(" ")[0]} text-white`}>
                    <Check className="size-4" />
                  </span>
                  <span className="text-slate-700">{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-baseline justify-center gap-2">
              <span className="text-4xl font-extrabold text-slate-900">$4.99</span>
              <span className="text-slate-500 text-sm">one-time unlock</span>
            </div>
          </div>

          <div className="mt-5 bg-white/50 dark:bg-white/10 backdrop-blur rounded-2xl px-5 py-4">
            <p className="text-xs text-slate-500 text-center mb-3 font-medium">
              Or try a different mode for free →
            </p>
            <Link
              to="/mode/$mode"
              params={{ mode: suggestedMode }}
              className={`${sm.accent} text-white text-sm font-semibold rounded-xl h-11 flex items-center justify-center gap-2 active:scale-95 transition`}
            >
              {sm.emoji} {sm.name}
            </Link>
          </div>
        </div>

        <button
          className={`mt-4 ${m.accent} text-white text-lg font-semibold rounded-2xl h-14 shadow-lg shadow-black/10 active:scale-[0.98] transition`}
          onClick={() => alert("Payments coming soon ✨")}
        >
          Unlock All Cards
        </button>
        <button
          className="mt-3 text-sm text-slate-500 hover:text-slate-700 transition"
          onClick={() => alert("No previous purchase found.")}
        >
          Restore Purchase
        </button>
      </div>
    </div>
  );
}
