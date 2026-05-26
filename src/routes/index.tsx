import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MODES, type TopMode } from "@/lib/game";
import { ThemeToggle } from "@/components/ThemeToggle";
import AuthPaywallSheet from "@/components/AuthPaywallSheet";

export const Route = createFileRoute("/")({
  component: Onboarding,
});

type Step = 0 | 1 | 2;

const VIBES: Record<"date" | "couples", { emoji: string; label: string }[]> = {
  date: [
    { emoji: "💫", label: "Curious & Deep" },
    { emoji: "😄", label: "Playful & Flirty" },
    { emoji: "🥂", label: "Romantic" },
    { emoji: "🔑", label: "Deep Secrets" },
  ],
  couples: [
    { emoji: "🔥", label: "Spice It Up" },
    { emoji: "💕", label: "Reconnect deeply" },
    { emoji: "😂", label: "Just have fun" },
    { emoji: "💬", label: "Real talk" },
  ],
};

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const [selectedMode, setSelectedMode] = useState<TopMode | null>(null);
  const [couplesPaywall, setCouplesPaywall] = useState(false);

  const goToModeHome = (mode: TopMode) =>
    navigate({ to: "/mode/$mode", params: { mode } });

  const pickMode = (mode: TopMode) => {
    if (mode === "family") {
      navigate({ to: "/mode/$mode", params: { mode: "family" } });
      return;
    }
    if (mode === "couples") {
      setCouplesPaywall(true);
      return;
    }
    setSelectedMode(mode);
    setStep(2);
  };

  const bgForStep2 =
    selectedMode && selectedMode !== "friends" ? MODES[selectedMode].bgClass : "bg-mode-friends";

  return (
    <div className="min-h-[100dvh] relative overflow-hidden">
      {/* ── Step 0: Welcome ── */}
      <div
        className={`absolute inset-0 bg-mode-home flex flex-col items-center justify-center px-8 text-center transition-all duration-500 ${
          step === 0 ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-8 pointer-events-none"
        }`}
      >
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <img
          src="/wannas-logo.png"
          alt="Wannas"
          className="size-28 rounded-3xl shadow-2xl shadow-indigo-200 mb-6 object-cover"
        />
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Wannas
        </h1>
        <p className="mt-3 text-xl font-medium text-slate-700 dark:text-slate-200">
          Real conversations.
        </p>
        <p className="text-xl font-medium bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
          Real connections.
        </p>
        <p className="mt-3 text-xs font-semibold tracking-widest text-indigo-400 dark:text-indigo-300 uppercase">
          4 modes · 400+ questions
        </p>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-xs text-sm">
          Thought-provoking questions for dates, couples, friends & family.
        </p>

        <button
          onClick={() => setStep(1)}
          className="mt-10 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-lg font-semibold rounded-2xl h-14 px-10 shadow-lg shadow-indigo-200 active:scale-[0.98] transition"
        >
          Get Started →
        </button>
      </div>

      {/* ── Step 1: Who's playing? ── */}
      <div
        className={`absolute inset-0 bg-mode-home flex flex-col px-6 pt-10 pb-10 transition-all duration-500 ${
          step === 1 ? "opacity-100 translate-x-0 pointer-events-auto" : step === 0 ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-0 -translate-x-8 pointer-events-none"
        }`}
      >
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md mx-auto flex flex-col flex-1">
          <button
            onClick={() => setStep(0)}
            className="self-start text-sm text-slate-400 hover:text-slate-600 transition mb-6"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Who's playing tonight?
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
            We'll personalise the experience for you.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 flex-1 content-start">
            {(["date", "couples", "friends", "family"] as TopMode[]).map((id) => {
              const m = MODES[id];
              const isPremium = id === "couples";
              return (
                <button
                  key={id}
                  onClick={() => pickMode(id)}
                  className="relative flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 transition-all active:scale-[0.97] text-center"
                >
                  {isPremium && (
                    <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-full shadow-sm">
                      Premium
                    </div>
                  )}
                  <div className={`size-16 grid place-items-center rounded-2xl ${m.accentSoft} text-4xl`}>
                    {m.emoji}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-50 text-sm leading-tight">
                      {m.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      {m.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Step 2: Personalize (date / friends only) ── */}
      <div
        className={`absolute inset-0 ${bgForStep2} flex flex-col px-6 pt-10 pb-10 transition-all duration-500 ${
          step === 2 ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-8 pointer-events-none"
        }`}
      >
        {selectedMode && (
          <PersonalizeStep
            mode={selectedMode}
            onBack={() => setStep(1)}
            onContinue={() => goToModeHome(selectedMode)}
          />
        )}
      </div>

      {/* Couples premium paywall */}
      {couplesPaywall && (
        <AuthPaywallSheet
          accent="bg-rose-500 hover:bg-rose-600"
          onClose={() => setCouplesPaywall(false)}
          couplesVariant
        />
      )}
    </div>
  );
}

function PersonalizeStep({
  mode,
  onBack,
  onContinue,
}: {
  mode: TopMode;
  onBack: () => void;
  onContinue: () => void;
}) {
  const m = MODES[mode];

  if (mode === "friends") {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col flex-1 items-center justify-center text-center">
        <button onClick={onBack} className="self-start text-sm text-slate-400 hover:text-slate-600 transition mb-8">
          ← Back
        </button>
        <div className="text-7xl mb-4">👥</div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Ready to get everyone talking?
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xs">
          Choose from 8 categories — Football, TV, Music, Gaming & more.
        </p>
        <button
          onClick={onContinue}
          className={`mt-10 ${m.accent} text-white text-lg font-semibold rounded-2xl h-14 px-10 shadow-lg active:scale-[0.98] transition`}
        >
          Pick a Category →
        </button>
      </div>
    );
  }

  const vibes = VIBES[mode as keyof typeof VIBES] ?? [];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col flex-1">
      <button onClick={onBack} className="self-start text-sm text-slate-400 hover:text-slate-600 transition mb-6">
        ← Back
      </button>
      <div className={`size-16 grid place-items-center rounded-2xl ${m.accentSoft} text-4xl mb-4`}>
        {m.emoji}
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
        {mode === "date" ? "What's the vibe tonight?" : "How are you feeling?"}
      </h2>
      <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">Tap one to continue.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {vibes.map((v) => (
          <button
            key={v.label}
            onClick={onContinue}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.97]"
          >
            <span className="text-3xl">{v.emoji}</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight text-center">
              {v.label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onContinue}
        className={`mt-auto ${m.accent} text-white text-base font-semibold rounded-2xl h-12 shadow-lg active:scale-[0.98] transition`}
      >
        Start Playing →
      </button>
    </div>
  );
}
