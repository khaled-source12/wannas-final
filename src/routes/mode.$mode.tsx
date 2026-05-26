import { createFileRoute, Link, notFound, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Settings } from "lucide-react";
import { useState } from "react";
import { MODES, FRIEND_SUBMODES, FRIEND_SUBMODE_LIST, type TopMode, type FriendSubMode } from "@/lib/game";

export const Route = createFileRoute("/mode/$mode")({
  component: ModeHome,
  beforeLoad: ({ params }) => {
    if (!(params.mode in MODES)) throw notFound();
  },
});

function ModeHome() {
  const { mode } = useParams({ from: "/mode/$mode" }) as { mode: TopMode };
  const m = MODES[mode];
  const navigate = useNavigate();

  return (
    <div className={`${m.bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-10`}>
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/" })}
            className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white dark:hover:bg-white/20 transition"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <span className={`text-xs font-semibold uppercase tracking-widest ${m.text}`}>
            {m.emoji} {m.name}
          </span>
          <Link
            to="/settings"
            className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-500 dark:text-slate-300 hover:bg-white dark:hover:bg-white/20 transition"
          >
            <Settings className="size-4" />
          </Link>
        </header>

        {mode === "friends" && <FriendsHome />}
        {mode === "family" && <FamilyHome m={m} />}
        {mode === "date" && <DateHome m={m} mode={mode} />}
        {mode === "couples" && <CouplesHome m={m} mode={mode} />}
      </div>
    </div>
  );
}

function DateHome({ m, mode }: { m: (typeof MODES)[TopMode]; mode: "date" }) {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
        <div className={`size-28 grid place-items-center rounded-3xl ${m.accentSoft} text-6xl shadow-inner mb-6`}>
          {m.emoji}
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          {m.name}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xs text-base">
          {m.tagline}
        </p>
      </div>
      <Link
        to="/play/$mode"
        params={{ mode }}
        className={`${m.accent} text-white text-lg font-semibold rounded-2xl h-14 grid place-items-center shadow-lg shadow-black/10 active:scale-[0.98] transition`}
      >
        Start Playing
      </Link>
      <button
        onClick={() => navigate({ to: "/" })}
        className="mt-3 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 transition text-center"
      >
        Switch mode
      </button>
    </div>
  );
}

function CouplesHome({ m, mode }: { m: (typeof MODES)[TopMode]; mode: "couples" }) {
  const navigate = useNavigate();
  const items = [
    { emoji: "🕯️", label: "Date night in" },
    { emoji: "🛋️", label: "Lazy evenings" },
    { emoji: "🌹", label: "Anniversaries" },
    { emoji: "💕", label: "Reconnecting" },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
        <div className={`size-28 grid place-items-center rounded-3xl ${m.accentSoft} text-6xl shadow-inner mb-6`}>
          {m.emoji}
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          {m.name}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xs">{m.tagline}</p>
        <div className="mt-8 w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Perfect for
          </p>
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 bg-white/60 dark:bg-white/10 backdrop-blur rounded-2xl px-4 py-3">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Link
        to="/play/$mode"
        params={{ mode }}
        className={`${m.accent} text-white text-lg font-semibold rounded-2xl h-14 grid place-items-center shadow-lg shadow-black/10 active:scale-[0.98] transition`}
      >
        Start Playing
      </Link>
      <button
        onClick={() => navigate({ to: "/" })}
        className="mt-3 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 transition text-center"
      >
        Switch mode
      </button>
    </div>
  );
}

type AgeGroup = { emoji: string; label: string; value: string };
const AGE_GROUPS: AgeGroup[] = [
  { emoji: "🧒", label: "Young Kids", value: "young", },
  { emoji: "🧑", label: "Older Kids", value: "older" },
  { emoji: "🧑‍🤝‍🧑", label: "Teens", value: "teen" },
  { emoji: "👨‍👩‍👧", label: "Mixed Ages", value: "mixed" },
];

function FamilyHome({ m }: { m: (typeof MODES)[TopMode] }) {
  const navigate = useNavigate();
  const [showAgePicker, setShowAgePicker] = useState(false);

  const handleAgeSelect = (value: string) => {
    sessionStorage.setItem("familyAgeGroup", value);
    navigate({ to: "/play/$mode", params: { mode: "family" } });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex flex-col items-center text-center py-8">
        <div className={`size-24 grid place-items-center rounded-3xl ${m.accentSoft} text-5xl shadow-inner mb-5`}>
          {m.emoji}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          {m.name}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm max-w-xs">
          Choose how you want to spend your time together.
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1 content-start">
        <Link
          to="/family-activities"
          className="flex items-start gap-4 p-5 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 transition-all active:scale-[0.97]"
        >
          <div className={`size-14 grid place-items-center rounded-2xl ${m.accentSoft} text-3xl flex-none`}>
            🎮
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-50 text-base">Activities</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Fun things to do together based on your kids' ages and where you are.
            </div>
          </div>
        </Link>

        <button
          onClick={() => setShowAgePicker(true)}
          className="flex items-start gap-4 p-5 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 transition-all active:scale-[0.97] text-left w-full"
        >
          <div className={`size-14 grid place-items-center rounded-2xl ${m.accentSoft} text-3xl flex-none`}>
            🖤
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-50 text-base">Heart to Heart</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Questions designed to open up real family conversations.
            </div>
          </div>
        </button>
      </div>

      <button
        onClick={() => navigate({ to: "/" })}
        className="mt-6 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 transition text-center"
      >
        Switch mode
      </button>

      {/* Age picker overlay */}
      {showAgePicker && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAgePicker(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🖤</div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                Who's joining?
              </h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
                We'll tailor the questions to your group.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {AGE_GROUPS.map((ag) => (
                <button
                  key={ag.value}
                  onClick={() => handleAgeSelect(ag.value)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/10 hover:bg-emerald-50 dark:hover:bg-white/20 border-2 border-transparent hover:border-emerald-300 transition-all active:scale-95"
                >
                  <span className="text-3xl">{ag.emoji}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-center leading-tight">
                    {ag.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAgePicker(false)}
              className="mt-4 w-full text-sm text-slate-400 hover:text-slate-600 transition py-2 text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FriendsHome() {
  const m = MODES.friends;
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col">
      <div className="mt-8 mb-4 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Pick a category
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
          Choose a topic and start playing.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1 content-start">
        {FRIEND_SUBMODE_LIST.map((subId) => {
          const sub = FRIEND_SUBMODES[subId as FriendSubMode];
          return (
            <Link
              key={subId}
              to="/play/friends/$sub"
              params={{ sub: subId }}
              className="group flex flex-col items-center gap-3 p-5 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 transition-all active:scale-[0.97] text-center"
            >
              <div className={`size-14 grid place-items-center rounded-2xl ${sub.accentSoft} text-3xl`}>
                {sub.emoji}
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-50 text-sm leading-tight">
                {sub.name}
              </span>
            </Link>
          );
        })}
      </div>
      <button
        onClick={() => navigate({ to: "/" })}
        className="mt-6 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 transition text-center"
      >
        Switch mode
      </button>
    </div>
  );
}
