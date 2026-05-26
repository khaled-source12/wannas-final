import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { getFavorites, toggleFavorite, type FavoriteCard } from "@/lib/favorites";
import { MODES, FRIEND_SUBMODES, type TopMode, type FriendSubMode } from "@/lib/game";

export const Route = createFileRoute("/favorites")({
  component: FavoritesScreen,
});

function getModeDisplay(modeKey: string): { name: string; emoji: string; text: string } {
  if (modeKey in MODES) {
    const m = MODES[modeKey as TopMode];
    return { name: m.name, emoji: m.emoji, text: m.text };
  }
  if (modeKey in FRIEND_SUBMODES) {
    const sm = FRIEND_SUBMODES[modeKey as FriendSubMode];
    return { name: sm.name, emoji: sm.emoji, text: sm.text };
  }
  return { name: modeKey, emoji: "❓", text: "text-slate-500" };
}

function FavoritesScreen() {
  const [favs, setFavs] = useState<FavoriteCard[]>(() => getFavorites());

  const remove = (text: string, mode: string) => {
    toggleFavorite(text, mode);
    setFavs(getFavorites());
  };

  const grouped = favs.reduce<Record<string, FavoriteCard[]>>((acc, f) => {
    if (!acc[f.mode]) acc[f.mode] = [];
    acc[f.mode].push(f);
    return acc;
  }, {});

  return (
    <div className="bg-mode-home min-h-[100dvh] flex flex-col px-6 pt-6 pb-10">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <header className="flex items-center justify-between">
          <Link
            to="/settings"
            aria-label="Back"
            className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white dark:hover:bg-white/20 transition"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Heart className="size-4 fill-rose-500 text-rose-500" /> Saved Cards
          </h1>
          <div className="size-10" />
        </header>

        {favs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
            <div className="text-5xl">💔</div>
            <p className="text-slate-700 dark:text-slate-200 font-semibold text-lg">No saved cards yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
              Swipe right or tap ❤️ on any card while playing to save it here.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-6 h-11 transition active:scale-95"
            >
              Start Playing
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-6">
            {Object.entries(grouped).map(([modeKey, cards]) => {
              const display = getModeDisplay(modeKey);
              return (
                <div key={modeKey}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-lg">{display.emoji}</span>
                    <span className={`text-xs font-bold uppercase tracking-widest ${display.text}`}>
                      {display.name}
                    </span>
                    <span className="text-xs text-slate-400">· {cards.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {cards.map((c) => (
                      <div
                        key={c.text}
                        className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-2xl px-5 py-4 flex items-start gap-3 shadow-sm"
                      >
                        <p className="flex-1 text-slate-800 dark:text-slate-100 text-sm font-medium leading-snug">
                          {c.text}
                        </p>
                        <button
                          onClick={() => remove(c.text, c.mode)}
                          className="flex-none text-slate-300 hover:text-rose-500 dark:text-white/20 dark:hover:text-rose-400 transition active:scale-90 mt-0.5"
                          aria-label="Remove"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
