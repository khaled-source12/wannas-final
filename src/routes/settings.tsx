import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, FileText, Heart, Moon, RefreshCw, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { getTimerMode, setTimerMode, type TimerMode } from "@/lib/timer";

export const Route = createFileRoute("/settings")({
  component: SettingsScreen,
});

function SettingsScreen() {
  const { theme, toggle } = useTheme();
  const [timer, setTimer] = useState<TimerMode>(() => getTimerMode());

  const cycleTimer = () => {
    const next: TimerMode = timer === null ? 30 : timer === 30 ? 60 : null;
    setTimerMode(next);
    setTimer(next);
  };

  const timerLabel = timer === null ? "Off" : `${timer}s per card`;

  return (
    <div className="bg-mode-home min-h-[100dvh] flex flex-col px-6 pt-6 pb-10">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            aria-label="Back"
            className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white dark:hover:bg-white/20 transition"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="font-bold text-slate-800 dark:text-slate-100">Settings</h1>
          <div className="size-10" />
        </header>

        {/* Gameplay section */}
        <p className="mt-8 mb-2 px-1 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Gameplay
        </p>
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
          {/* Timer toggle */}
          <button
            className="w-full text-left border-b border-slate-100 dark:border-white/10"
            onClick={cycleTimer}
          >
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition">
              <span className="size-10 grid place-items-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-100">
                <Clock className="size-5" />
              </span>
              <span className="flex-1 text-slate-800 dark:text-slate-100 font-medium">Card Timer</span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  timer !== null
                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                    : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                }`}
              >
                {timerLabel}
              </span>
            </div>
          </button>

          {/* Saved cards */}
          <Link to="/favorites">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition">
              <span className="size-10 grid place-items-center rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-500">
                <Heart className="size-5" />
              </span>
              <span className="flex-1 text-slate-800 dark:text-slate-100 font-medium">Saved Cards</span>
              <span className="text-slate-300 dark:text-slate-500">›</span>
            </div>
          </Link>
        </div>

        {/* Preferences section */}
        <p className="mt-6 mb-2 px-1 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Preferences
        </p>
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
          {[
            {
              icon: <Moon className="size-5" />,
              label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
              onClick: toggle,
              iconBg: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-100",
            },
            {
              icon: <ShieldCheck className="size-5" />,
              label: "Privacy Policy",
              href: "#",
              iconBg: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-100",
            },
            {
              icon: <FileText className="size-5" />,
              label: "Terms of Service",
              href: "#",
              iconBg: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-100",
            },
            {
              icon: <RefreshCw className="size-5" />,
              label: "Restore Purchase",
              onClick: () => alert("No previous purchase found."),
              iconBg: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-100",
            },
            {
              icon: <Star className="size-5" />,
              label: "Rate the App",
              onClick: () => alert("Thanks for the love! ⭐"),
              iconBg: "bg-amber-50 dark:bg-amber-900/30 text-amber-500",
            },
          ].map((r, i) => {
            const inner = (
              <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition">
                <span className={`size-10 grid place-items-center rounded-xl ${r.iconBg}`}>
                  {r.icon}
                </span>
                <span className="flex-1 text-slate-800 dark:text-slate-100 font-medium">{r.label}</span>
                <span className="text-slate-300 dark:text-slate-500">›</span>
              </div>
            );
            return (
              <div key={r.label} className={i === 0 ? "" : "border-t border-slate-100 dark:border-white/10"}>
                {r.href ? (
                  <a href={r.href}>{inner}</a>
                ) : (
                  <button className="w-full text-left" onClick={r.onClick}>{inner}</button>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-auto pt-10 text-center text-xs text-slate-400 dark:text-slate-500">
          Wannas · v0.2
        </p>
      </div>
    </div>
  );
}
