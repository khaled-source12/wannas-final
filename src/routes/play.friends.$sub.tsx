import { createFileRoute, notFound, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  FRIEND_SUBMODES, QUESTIONS, QUIZ_QUESTIONS, FREE_QUESTIONS, shuffleArray,
  type FriendSubMode,
} from "@/lib/game";
import { toggleFavorite, isFavorite as checkFav } from "@/lib/favorites";
import Confetti from "@/components/Confetti";
import AuthPaywallSheet from "@/components/AuthPaywallSheet";

export const Route = createFileRoute("/play/friends/$sub")({
  component: FriendsPlayScreen,
  beforeLoad: ({ params }) => {
    if (!(params.sub in FRIEND_SUBMODES)) throw notFound();
  },
});

type Phase = "setup-count" | "setup-settings" | "setup-names" | "game" | "reveal" | "ranking";
type Difficulty = "easy" | "medium" | "hard";

interface PreparedQ {
  text: string;
  options: string[] | null;
  correctAnswer: string | null;
}

interface Player {
  name: string;
  score: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];

function buildDeck(sub: FriendSubMode, difficulty: Difficulty, timerSecs: number): PreparedQ[] {
  if (difficulty === "easy" && sub in QUIZ_QUESTIONS) {
    const arr = QUIZ_QUESTIONS[sub]!;
    return shuffleArray([...arr]).map((q) => {
      const shuffled = shuffleArray([...q.options]);
      return { text: q.q, options: shuffled, correctAnswer: q.options[q.answer] };
    });
  }
  return shuffleArray([...QUESTIONS[sub]]).map((q) => ({ text: q, options: null, correctAnswer: null }));
}

function FriendsPlayScreen() {
  const { sub } = useParams({ from: "/play/friends/$sub" }) as { sub: FriendSubMode };
  const sm = FRIEND_SUBMODES[sub];
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("setup-count");
  const [playerCount, setPlayerCount] = useState(3);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [timerSecs, setTimerSecs] = useState(20);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<PreparedQ[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(new Set());
  const [hardPaywall, setHardPaywall] = useState(false);
  const [rankingPaywall, setRankingPaywall] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  const nameRefs = useRef<(HTMLInputElement | null)[]>([]);

  const currentQ = deck[questionIndex % deck.length] ?? { text: "", options: null, correctAnswer: null };
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const showBlur = sortedPlayers.length > 3;
  const timerPct = timerSecs > 0 ? timeLeft / timerSecs : 1;
  const effectiveTimer = difficulty === "hard" ? 10 : timerSecs;

  useEffect(() => {
    if (phase !== "game") return;
    if (timeLeft <= 0) {
      setPhase("reveal");
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft]);

  const startSettings = () => {
    setPlayerNames(Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`));
    setPhase("setup-settings");
  };

  const startNames = () => setPhase("setup-names");

  const startGame = () => {
    const prepared = buildDeck(sub, difficulty, effectiveTimer);
    setDeck(prepared);
    setPlayers(playerNames.map((name) => ({ name, score: 0 })));
    setQuestionIndex(0);
    setTimeLeft(effectiveTimer);
    setIsFav(checkFav(prepared[0]?.text ?? ""));
    setPhase("game");
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 2000);
  };

  const togglePlayerSelect = (idx: number) => {
    setSelectedPlayers((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const nextQuestion = () => {
    if (selectedPlayers.size > 0) {
      setPlayers((prev) =>
        prev.map((p, i) => (selectedPlayers.has(i) ? { ...p, score: p.score + 1 } : p))
      );
    }
    setSelectedPlayers(new Set());
    const next = questionIndex + 1;
    if (next >= FREE_QUESTIONS) {
      setHardPaywall(true);
      return;
    }
    if (next > 0 && next % 10 === 0) setShowRanking(true);
    setQuestionIndex(next);
    setTimeLeft(effectiveTimer);
    setIsFav(checkFav(deck[next % deck.length]?.text ?? ""));
    setPhase("game");
  };

  const endGame = () => {
    if (selectedPlayers.size > 0) {
      setPlayers((prev) =>
        prev.map((p, i) => (selectedPlayers.has(i) ? { ...p, score: p.score + 1 } : p))
      );
    }
    setSelectedPlayers(new Set());
    setPhase("ranking");
  };

  const bgClass = sm.bgClass;

  /* ── Setup: Count ── */
  if (phase === "setup-count") {
    return (
      <div className={`${bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-10`}>
        <div className="w-full max-w-md mx-auto flex flex-col flex-1">
          <header className="flex items-center">
            <button onClick={() => history.back()} className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white transition">
              <ArrowLeft className="size-5" />
            </button>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
            <div>
              <div className={`size-20 mx-auto grid place-items-center rounded-3xl ${sm.accentSoft} text-5xl mb-4`}>{sm.emoji}</div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">How many are playing?</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">We'll track everyone's score.</p>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setPlayerCount((c) => Math.max(2, c - 1))} className="size-14 grid place-items-center rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur shadow text-slate-700 dark:text-slate-100 active:scale-90 transition hover:bg-white">
                <Minus className="size-5" />
              </button>
              <span className="text-6xl font-extrabold text-slate-900 dark:text-slate-50 w-16 text-center tabular-nums">{playerCount}</span>
              <button onClick={() => setPlayerCount((c) => Math.min(8, c + 1))} className="size-14 grid place-items-center rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur shadow text-slate-700 dark:text-slate-100 active:scale-90 transition hover:bg-white">
                <Plus className="size-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">Min 2 — Max 8 players</p>
          </div>
          <button onClick={startSettings} className={`${sm.accent} text-white text-lg font-semibold rounded-2xl h-14 shadow-lg active:scale-[0.98] transition`}>
            Next →
          </button>
        </div>
      </div>
    );
  }

  /* ── Setup: Settings ── */
  if (phase === "setup-settings") {
    const DIFFICULTIES: { value: Difficulty; label: string; desc: string }[] = [
      { value: "easy", label: "Easy", desc: "Shows 4 answer options" },
      { value: "medium", label: "Medium", desc: "Question only" },
      { value: "hard", label: "Hard", desc: "Question only · 10s timer" },
    ];
    const TIMERS = [10, 20, 30];
    return (
      <div className={`${bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-10`}>
        <div className="w-full max-w-md mx-auto flex flex-col flex-1">
          <header className="flex items-center">
            <button onClick={() => setPhase("setup-count")} className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white transition">
              <ArrowLeft className="size-5" />
            </button>
          </header>
          <div className="mt-6 mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Game Settings</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">Choose your difficulty and timer.</p>
          </div>
          <div className="flex flex-col gap-6 flex-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Difficulty</p>
              <div className="flex flex-col gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => { setDifficulty(d.value); if (d.value === "hard") setTimerSecs(10); }}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                      difficulty === d.value
                        ? `border-current ${sm.text} bg-white dark:bg-white/10 shadow-md`
                        : "border-transparent bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span className="font-bold text-sm">{d.label}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Timer per question</p>
              <div className="flex gap-3">
                {TIMERS.map((t) => {
                  const locked = difficulty === "hard" && t !== 10;
                  return (
                    <button
                      key={t}
                      disabled={locked}
                      onClick={() => setTimerSecs(t)}
                      className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                        (difficulty === "hard" ? t === 10 : timerSecs === t)
                          ? `border-current ${sm.text} bg-white dark:bg-white/10 shadow-md`
                          : locked
                          ? "border-transparent bg-white/30 dark:bg-white/5 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                          : "border-transparent bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {t}s
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <button onClick={startNames} className={`mt-6 ${sm.accent} text-white text-lg font-semibold rounded-2xl h-14 shadow-lg active:scale-[0.98] transition`}>
            Next →
          </button>
        </div>
      </div>
    );
  }

  /* ── Setup: Names ── */
  if (phase === "setup-names") {
    return (
      <div className={`${bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-10`}>
        <div className="w-full max-w-md mx-auto flex flex-col flex-1">
          <header className="flex items-center">
            <button onClick={() => setPhase("setup-settings")} className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white transition">
              <ArrowLeft className="size-5" />
            </button>
          </header>
          <div className="mt-6 mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">What are everyone's names?</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">Tap a name to edit it.</p>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {playerNames.map((name, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/80 dark:bg-white/10 backdrop-blur rounded-2xl px-4 shadow-sm">
                <span className="text-xl w-8 text-center">👤</span>
                <input
                  ref={(el) => { nameRefs.current[i] = el; }}
                  value={name}
                  onChange={(e) => {
                    const next = [...playerNames];
                    next[i] = e.target.value;
                    setPlayerNames(next);
                  }}
                  className="flex-1 bg-transparent py-4 text-slate-900 dark:text-slate-50 font-semibold placeholder:text-slate-400 outline-none text-base"
                  placeholder={`Player ${i + 1}`}
                  maxLength={20}
                />
              </div>
            ))}
          </div>
          <button onClick={startGame} className={`mt-6 ${sm.accent} text-white text-lg font-semibold rounded-2xl h-14 shadow-lg active:scale-[0.98] transition`}>
            Start Game →
          </button>
        </div>
      </div>
    );
  }

  /* ── Game ── */
  if (phase === "game") {
    return (
      <div className={`${bgClass} min-h-[100dvh] flex flex-col`}>
        <Confetti active={confettiActive} />
        {/* Timer bar */}
        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10">
          <div
            className={`h-full ${sm.accent.split(" ")[0]} transition-all duration-1000 ease-linear ${timerPct < 0.3 ? "bg-red-500" : ""}`}
            style={{ width: `${timerPct * 100}%` }}
          />
        </div>
        <div className="flex flex-col flex-1 px-6 pt-4 pb-6">
          <div className="w-full max-w-md mx-auto flex flex-col flex-1">
            <header className="flex items-center justify-between mb-4">
              <button onClick={() => history.back()} className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white transition">
                <ArrowLeft className="size-5" />
              </button>
              <div className="flex flex-col items-center">
                <span className={`text-xs font-semibold uppercase tracking-widest ${sm.text}`}>{sm.emoji} {sm.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Q{questionIndex + 1}/{FREE_QUESTIONS} · {difficulty}</span>
              </div>
              <button onClick={endGame} className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-white/10 backdrop-blur rounded-xl px-3 h-10 hover:bg-white dark:hover:bg-white/20 transition">
                End
              </button>
            </header>

            <div className="flex-1 flex flex-col justify-center gap-4">
              {/* Timer display */}
              <div className="text-center">
                <span className={`text-5xl font-extrabold tabular-nums ${timeLeft <= 5 ? "text-red-500" : "text-slate-700 dark:text-slate-200"}`}>
                  {timeLeft}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-sm ml-1">sec</span>
              </div>

              {/* Question card */}
              <div className="w-full bg-white dark:bg-slate-800 rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)] p-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className={`size-10 grid place-items-center rounded-xl ${sm.accentSoft} text-xl`}>{sm.emoji}</div>
                  <button
                    onClick={() => { const nowFav = toggleFavorite(currentQ.text, sub); setIsFav(nowFav); }}
                    className="size-10 grid place-items-center rounded-full hover:bg-slate-50 dark:hover:bg-white/10 transition active:scale-90"
                  >
                    <span className={`text-xl ${isFav ? "scale-110" : "opacity-40"}`}>{isFav ? "❤️" : "🤍"}</span>
                  </button>
                </div>
                <p className="text-center text-xl leading-snug font-semibold text-slate-900 dark:text-slate-50 min-h-[80px] flex items-center justify-center">
                  {currentQ.text}
                </p>
                <div className={`h-1.5 w-12 rounded-full ${sm.accent.split(" ")[0]} mx-auto opacity-80`} />
              </div>

              {/* Easy mode: answer options */}
              {currentQ.options && (
                <div className="grid grid-cols-2 gap-2">
                  {currentQ.options.map((opt, i) => (
                    <div
                      key={i}
                      className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-2xl px-4 py-3.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
                    >
                      <span className={`text-xs font-bold mr-1 ${sm.text}`}>{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setPhase("reveal")}
              className={`mt-4 ${sm.accent} text-white text-lg font-semibold rounded-2xl h-14 shadow-lg active:scale-[0.98] transition`}
            >
              ⏱ Time's Up!
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Reveal ── */
  if (phase === "reveal") {
    return (
      <div className={`${bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-8`}>
        <div className="w-full max-w-md mx-auto flex flex-col flex-1">
          <header className="flex items-center justify-between mb-4">
            <div className="size-10" />
            <span className={`text-xs font-semibold uppercase tracking-widest ${sm.text}`}>⏱ Time's Up!</span>
            <button onClick={endGame} className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-white/10 backdrop-blur rounded-xl px-3 h-10 hover:bg-white transition">
              End
            </button>
          </header>

          <div className="flex-1 flex flex-col justify-center gap-4">
            {/* Question recap */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 italic px-4">"{currentQ.text}"</p>

            {/* Answer reveal */}
            {currentQ.options ? (
              <div className="grid grid-cols-2 gap-2">
                {currentQ.options.map((opt, i) => {
                  const isCorrect = opt === currentQ.correctAnswer;
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl px-4 py-3.5 text-center text-sm font-bold shadow-sm transition-all ${
                        isCorrect
                          ? "bg-emerald-500 text-white scale-105 shadow-lg shadow-emerald-200 dark:shadow-emerald-900"
                          : "bg-white/40 dark:bg-white/5 text-slate-400 dark:text-slate-600 line-through"
                      }`}
                    >
                      {isCorrect && <span className="mr-1">✓</span>}
                      <span className={`text-xs font-bold mr-1 ${isCorrect ? "text-white/80" : ""}`}>{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl px-5 py-4 text-center shadow-md">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Discuss!</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Share your answers and decide who had the best one.</p>
              </div>
            )}

            {/* Award points */}
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 text-center">
                Who got it right? Tap to award a point
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {players.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => togglePlayerSelect(i)}
                    className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                      selectedPlayers.has(i)
                        ? `${sm.accent.split(" ")[0]} text-white shadow-md scale-105`
                        : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 shadow-sm"
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className={`text-xs font-bold ${selectedPlayers.has(i) ? "text-white/80" : "text-slate-400"}`}>{p.score} pts</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center items-center gap-1.5 my-4">
            {Array.from({ length: FREE_QUESTIONS }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i < questionIndex
                    ? `${sm.accent.split(" ")[0]} h-3 w-5 opacity-60`
                    : i === questionIndex
                    ? `${sm.accent.split(" ")[0]} h-4 w-8`
                    : "bg-slate-300/60 dark:bg-white/20 h-3 w-3"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextQuestion}
            className={`${sm.accent} text-white text-lg font-semibold rounded-2xl h-14 shadow-lg shadow-black/10 active:scale-[0.98] transition`}
          >
            {selectedPlayers.size > 0 ? `Award +${selectedPlayers.size} & Next →` : "Next Question →"}
          </button>
        </div>

        {hardPaywall && <AuthPaywallSheet accent={sm.accent} onClose={() => history.back()} />}
      </div>
    );
  }

  /* ── Ranking ── */
  return (
    <div className={`${bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-10`}>
      <Confetti active={true} />
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <div className="flex-1 flex flex-col">
          <div className="text-center mt-6 mb-8">
            <div className="text-5xl mb-2">🏆</div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Final Rankings</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">{sm.emoji} {sm.name}</p>
          </div>
          <RankingList players={sortedPlayers} showBlur={showBlur} onUnlock={() => setRankingPaywall(true)} />
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => navigate({ to: "/mode/$mode", params: { mode: "friends" } })}
            className={`${sm.accent} text-white text-base font-semibold rounded-2xl h-13 py-3.5 shadow-lg active:scale-[0.98] transition`}
          >
            Play Another Category
          </button>
          <button
            onClick={() => navigate({ to: "/" })}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 transition py-2 text-center"
          >
            Back to Home
          </button>
        </div>
      </div>
      {rankingPaywall && <AuthPaywallSheet accent={sm.accent} onClose={() => setRankingPaywall(false)} rankingVariant />}
    </div>
  );
}

function RankingList({ players, showBlur, onUnlock }: { players: Player[]; showBlur: boolean; onUnlock: () => void }) {
  return (
    <div className="flex flex-col gap-2 relative">
      {players.map((p, i) => (
        <div
          key={p.name}
          className={`flex items-center gap-3 bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-3 ${i >= 3 ? "filter blur-sm pointer-events-none select-none" : ""}`}
        >
          <span className="text-xl w-8 text-center">{MEDALS[i] ?? `#${i + 1}`}</span>
          <span className="flex-1 font-semibold text-slate-900 dark:text-slate-50">{p.name}</span>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{p.score} pts</span>
        </div>
      ))}
      {showBlur && (
        <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center pb-3 bg-gradient-to-t from-white dark:from-slate-900 to-transparent rounded-b-2xl">
          <button
            onClick={onUnlock}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl px-5 py-2.5 shadow-lg active:scale-95 transition"
          >
            🔓 Unlock Full Rankings
          </button>
        </div>
      )}
    </div>
  );
}
