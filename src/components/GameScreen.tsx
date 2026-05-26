import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Heart, SkipForward } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { FREE_QUESTIONS, DEEP_DIVE_PROMPTS, shuffleArray } from "@/lib/game";
import { toggleFavorite, isFavorite as checkFav } from "@/lib/favorites";
import { getTimerMode } from "@/lib/timer";
import Confetti from "@/components/Confetti";
import AuthPaywallSheet from "@/components/AuthPaywallSheet";

export interface GameScreenConfig {
  modeKey: string;
  name: string;
  emoji: string;
  bgClass: string;
  accent: string;
  accentSoft: string;
  text: string;
  questions: string[];
  backPath: string;
  backParams?: Record<string, string>;
  paywallMode: string;
}

const DARK_CARD: Record<string, string> = {
  date: "dark:bg-indigo-950 dark:border dark:border-indigo-900/60",
  couples: "dark:bg-rose-950 dark:border dark:border-rose-900/60",
  friends: "dark:bg-violet-950 dark:border dark:border-violet-900/60",
  family: "dark:bg-emerald-950 dark:border dark:border-emerald-900/60",
  football: "dark:bg-green-950 dark:border dark:border-green-900/60",
  "tv-movies": "dark:bg-sky-950 dark:border dark:border-sky-900/60",
  beauty: "dark:bg-pink-950 dark:border dark:border-pink-900/60",
  music: "dark:bg-purple-950 dark:border dark:border-purple-900/60",
  gaming: "dark:bg-indigo-950 dark:border dark:border-indigo-900/60",
  wyr: "dark:bg-amber-950 dark:border dark:border-amber-900/60",
  travel: "dark:bg-cyan-950 dark:border dark:border-cyan-900/60",
  food: "dark:bg-orange-950 dark:border dark:border-orange-900/60",
};

const REACTIONS = ["🔥", "😂", "💡", "🥺"] as const;
type Reaction = typeof REACTIONS[number];

export default function GameScreen({
  modeKey,
  name,
  emoji,
  bgClass,
  accent,
  accentSoft,
  text,
  questions,
  backPath,
  backParams,
  paywallMode,
}: GameScreenConfig) {
  const darkCard = DARK_CARD[modeKey] ?? "dark:bg-slate-900";
  const [timerDuration] = useState<number | null>(() => getTimerMode());
  const [deck] = useState<string[]>(() => shuffleArray([...questions]));
  const [deckIndex, setDeckIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isFav, setIsFav] = useState(() => checkFav(deck[0] ?? ""));
  const [confettiActive, setConfettiActive] = useState(true);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [deepDivePrompt, setDeepDivePrompt] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(timerDuration);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hardPaywall, setHardPaywall] = useState(false);
  const [softPaywall, setSoftPaywall] = useState(false);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [reactionPop, setReactionPop] = useState<Reaction | null>(null);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const axisLock = useRef<"x" | "y" | null>(null);

  const current = deck[deckIndex % deck.length] ?? "";
  const nextCard = deck[(deckIndex + 1) % deck.length] ?? "";

  useEffect(() => {
    const t = setTimeout(() => setConfettiActive(false), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (timerDuration === null) return;
    setTimeLeft(timerDuration);
    const id = setInterval(() => {
      setTimeLeft((t) => (t !== null && t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [deckIndex, timerDuration]);

  const advanceDeck = useCallback((countAnswer: boolean) => {
    if (countAnswer) {
      const next = answeredCount + 1;
      if (next >= FREE_QUESTIONS) {
        setHardPaywall(true);
        return;
      }
      setAnsweredCount(next);
      setStreak((s) => s + 1);
    }
    setFlipped(true);
    setTimeout(() => {
      setDeckIndex((i) => i + 1);
      setIsFav(checkFav(deck[(deckIndex + 1) % deck.length] ?? ""));
      setFlipped(false);
      setShowDeepDive(false);
      setReaction(null);
    }, 450);
  }, [answeredCount, deckIndex, deck]);

  const handleNext = useCallback(() => advanceDeck(true), [advanceDeck]);
  const handleSkip = useCallback(() => advanceDeck(false), [advanceDeck]);

  useEffect(() => {
    if (timeLeft === 0) handleNext();
  }, [timeLeft]);

  const handleFavorite = useCallback(() => {
    const nowFav = toggleFavorite(current, modeKey);
    setIsFav(nowFav);
  }, [current, modeKey]);

  const handleDeepDive = () => {
    setSoftPaywall(true);
    setDeepDivePrompt(DEEP_DIVE_PROMPTS[Math.floor(Math.random() * DEEP_DIVE_PROMPTS.length)]);
  };

  const handleReaction = (r: Reaction) => {
    setReaction(r);
    setReactionPop(r);
    setTimeout(() => setReactionPop(null), 400);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    axisLock.current = null;
    setIsDragging(false);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!axisLock.current) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) axisLock.current = "x";
      else if (Math.abs(dy) > 8) axisLock.current = "y";
    }
    if (axisLock.current === "x") {
      e.preventDefault();
      setIsDragging(true);
      setSwipeOffset(Math.max(-130, Math.min(130, dx)));
    }
  };
  const handleTouchEnd = () => {
    if (swipeOffset > 80) handleFavorite();
    else if (swipeOffset < -80) handleNext();
    setSwipeOffset(0);
    setIsDragging(false);
  };

  const swipeHint = swipeOffset > 40 ? "fav" : swipeOffset < -40 ? "next" : null;
  const timerPct = timerDuration !== null && timeLeft !== null ? timeLeft / timerDuration : 1;
  const questionNum = answeredCount + 1;

  return (
    <div className={`${bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-8`}>
      <Confetti active={confettiActive} />
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <header className="flex items-center justify-between">
          <button
            onClick={() => history.back()}
            aria-label="Back"
            className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white dark:hover:bg-white/20 transition"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className={`text-xs font-semibold uppercase tracking-widest ${text}`}>
              {emoji} {name}
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              {questionNum} / 100
            </span>
          </div>
          <div className="size-10 flex items-center justify-center">
            {streak >= 3 && (
              <span className="text-xs font-bold text-amber-500">🔥{streak}</span>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center py-4 gap-3">
          <div className="w-full flex justify-between px-1 h-5">
            <span className={`text-xs font-semibold text-rose-500 transition-opacity duration-150 ${swipeHint === "fav" ? "opacity-100" : "opacity-0"}`}>
              ❤️ Saving…
            </span>
            <span className={`text-xs font-semibold text-slate-500 dark:text-slate-300 transition-opacity duration-150 ${swipeHint === "next" ? "opacity-100" : "opacity-0"}`}>
              Next →
            </span>
          </div>

          <div
            className="perspective-1200 w-full aspect-[3/4] max-h-[460px]"
            style={{
              transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.025}deg)`,
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`relative w-full h-full preserve-3d transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${flipped ? "rotate-y-180" : ""}`}>
              <CardFace
                text={current}
                isFav={isFav}
                onFav={handleFavorite}
                emoji={emoji}
                name={name}
                accent={accent}
                accentSoft={accentSoft}
                text_color={text}
                darkCard={darkCard}
                timerPct={timerPct}
                timerActive={timerDuration !== null}
                swipeHint={swipeHint}
              />
              <CardFace
                text={nextCard}
                isFav={false}
                onFav={() => {}}
                emoji={emoji}
                name={name}
                accent={accent}
                accentSoft={accentSoft}
                text_color={text}
                darkCard={darkCard}
                timerPct={1}
                timerActive={false}
                swipeHint={null}
                muted
                back
              />
            </div>
          </div>

          {showDeepDive && (
            <div className="w-full bg-white/80 dark:bg-white/10 backdrop-blur rounded-2xl px-5 py-4 border border-white/40 dark:border-white/10">
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${text}`}>Go Deeper 🔍</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{deepDivePrompt}</p>
            </div>
          )}

          <div className="w-full flex items-center justify-center gap-2 mt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-1">How did that land?</span>
            {REACTIONS.map((r) => (
              <button
                key={r}
                onClick={() => handleReaction(r)}
                className={`text-xl transition-all duration-150 rounded-xl px-2 py-1 ${
                  reaction === r
                    ? "bg-white/80 dark:bg-white/20 shadow-sm scale-110"
                    : "opacity-50 hover:opacity-100 hover:scale-105"
                } ${reactionPop === r ? "scale-125" : ""}`}
                aria-label={r}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-1.5 mb-4">
          {Array.from({ length: FREE_QUESTIONS }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < answeredCount
                  ? `${accent.split(" ")[0]} h-3 w-5 opacity-60`
                  : i === answeredCount
                  ? `${accent.split(" ")[0]} h-4 w-8`
                  : "bg-slate-300/60 dark:bg-white/20 h-3 w-3"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDeepDive}
            className="flex-none px-4 h-14 grid place-items-center rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur text-sm font-semibold text-slate-600 dark:text-slate-200 transition active:scale-[0.95] hover:bg-white dark:hover:bg-white/20 whitespace-nowrap"
          >
            Go Deeper
          </button>
          <button
            onClick={handleNext}
            className={`flex-1 ${accent} text-white text-lg font-semibold rounded-2xl h-14 shadow-lg shadow-black/10 active:scale-[0.98] transition`}
          >
            Next Card
          </button>
        </div>

        <button
          onClick={handleSkip}
          className="mt-2.5 flex items-center justify-center gap-1.5 w-full text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition py-1"
        >
          <SkipForward className="size-3.5" />
          Skip this question
        </button>

        {timerDuration !== null && timeLeft !== null && (
          <p className={`mt-2 text-center text-xs font-medium tabular-nums ${timeLeft <= 5 ? "text-red-500" : "text-slate-400 dark:text-slate-500"}`}>
            {timeLeft}s remaining
          </p>
        )}
      </div>

      {hardPaywall && (
        <AuthPaywallSheet accent={accent} onClose={() => history.back()} />
      )}
      {softPaywall && (
        <AuthPaywallSheet accent={accent} onClose={() => setSoftPaywall(false)} />
      )}
    </div>
  );
}

function CardFace({
  text,
  isFav,
  onFav,
  emoji,
  name,
  accent,
  accentSoft,
  text_color,
  darkCard,
  timerPct,
  timerActive,
  swipeHint,
  muted = false,
  back = false,
}: {
  text: string;
  isFav: boolean;
  onFav: () => void;
  emoji: string;
  name: string;
  accent: string;
  accentSoft: string;
  text_color: string;
  darkCard: string;
  timerPct: number;
  timerActive: boolean;
  swipeHint: "fav" | "next" | null;
  muted?: boolean;
  back?: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 backface-hidden bg-white ${darkCard} rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] p-8 flex flex-col overflow-hidden${back ? " rotate-y-180" : ""}`}
    >
      {timerActive && !back && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-white/10 rounded-t-[28px] overflow-hidden">
          <div
            className={`h-full ${accent.split(" ")[0]} transition-all duration-1000 ease-linear`}
            style={{ width: `${timerPct * 100}%` }}
          />
        </div>
      )}
      {!back && swipeHint === "fav" && (
        <div className="absolute inset-0 rounded-[28px] bg-rose-400/10 border-2 border-rose-400 pointer-events-none" />
      )}
      {!back && swipeHint === "next" && (
        <div className="absolute inset-0 rounded-[28px] bg-slate-300/10 border-2 border-slate-300 pointer-events-none" />
      )}

      <div className="flex items-center justify-between">
        <div className={`size-10 grid place-items-center rounded-xl ${accentSoft} text-xl`}>
          {emoji}
        </div>
        {!back ? (
          <button
            onClick={(e) => { e.stopPropagation(); onFav(); }}
            className="size-10 grid place-items-center rounded-full hover:bg-slate-50 dark:hover:bg-white/10 transition active:scale-90"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`size-5 transition-all duration-200 ${isFav ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-300 dark:text-white/30"}`}
            />
          </button>
        ) : (
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${text_color}`}>{name}</span>
        )}
      </div>

      <div className="flex-1 grid place-items-center">
        <p className={`text-center text-2xl leading-snug font-semibold text-slate-900 dark:text-slate-50 ${muted ? "opacity-50" : ""}`}>
          {text}
        </p>
      </div>

      <div className={`h-1.5 w-12 rounded-full ${accent.split(" ")[0]} mx-auto opacity-80`} />
    </div>
  );
}
