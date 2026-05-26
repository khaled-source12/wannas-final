import { X, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

type Step = "paywall" | "auth" | "payment";

const PERKS = [
  "100+ questions per mode",
  "All 8 Friends categories unlocked",
  "Go Deeper prompts for real conversations",
  "New questions added every month",
];

interface Props {
  accent: string;
  onClose?: () => void;
  rankingVariant?: boolean;
  couplesVariant?: boolean;
}

export default function AuthPaywallSheet({
  accent,
  onClose,
  rankingVariant = false,
  couplesVariant = false,
}: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("paywall");
  const [email, setEmail] = useState("");
  const [paid, setPaid] = useState(false);

  const accentBg = accent.split(" ")[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl max-h-[90dvh] overflow-y-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-8 grid place-items-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="size-4" />
          </button>
        )}

        {/* Step indicator */}
        {step !== "paywall" && (
          <div className="flex items-center justify-center gap-2 mb-5">
            {(["paywall", "auth", "payment"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  (step === "auth" && i <= 1) || step === "payment"
                    ? `${accentBg} ${i === (step === "auth" ? 1 : 2) ? "w-6" : "w-4"}`
                    : "bg-slate-200 dark:bg-white/10 w-4"
                }`}
              />
            ))}
          </div>
        )}

        {step === "paywall" && (
          <PaywallStep
            accentBg={accentBg}
            accent={accent}
            onClose={onClose}
            navigate={navigate}
            rankingVariant={rankingVariant}
            couplesVariant={couplesVariant}
            onUnlock={() => setStep("auth")}
          />
        )}

        {step === "auth" && (
          <AuthStep
            accentBg={accentBg}
            accent={accent}
            email={email}
            setEmail={setEmail}
            onContinue={() => setStep("payment")}
            onClose={onClose}
          />
        )}

        {step === "payment" && (
          <PaymentStep
            accentBg={accentBg}
            accent={accent}
            email={email}
            paid={paid}
            onPay={() => setPaid(true)}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

function PaywallStep({
  accentBg,
  accent,
  onClose,
  navigate,
  rankingVariant,
  couplesVariant,
  onUnlock,
}: {
  accentBg: string;
  accent: string;
  onClose?: () => void;
  navigate: ReturnType<typeof useNavigate>;
  rankingVariant: boolean;
  couplesVariant: boolean;
  onUnlock: () => void;
}) {
  const heading = couplesVariant
    ? "Unlock Couples / Married"
    : rankingVariant
    ? "Unlock Full Rankings"
    : "You've used your 7 free cards";

  const subtitle = couplesVariant
    ? "This category is made for couples and married partners. Unlock it once to access all questions."
    : rankingVariant
    ? "One-time purchase to unlock full rankings and unlimited play."
    : "Unlock 100+ cards, all modes, and everything — just once.";

  const emoji = couplesVariant ? "🔥" : "🔓";

  return (
    <>
      <div className="text-center mb-5">
        <div className={`size-14 grid place-items-center rounded-2xl ${accentBg} text-white text-2xl mx-auto mb-3`}>
          {emoji}
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{heading}</h2>
        <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <ul className="space-y-2.5 mb-5">
        {PERKS.map((p) => (
          <li key={p} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            <span className={`size-5 grid place-items-center rounded-full ${accentBg} text-white flex-none text-xs`}>
              ✓
            </span>
            {p}
          </li>
        ))}
      </ul>

      <div className="bg-slate-50 dark:bg-white/5 rounded-2xl px-5 py-4 mb-5 flex items-center justify-between">
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-50 text-base">Wannas Premium</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">One-time purchase · No subscription ever</div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">$4.99</div>
      </div>

      <button
        onClick={onUnlock}
        className={`w-full ${accent} text-white text-base font-semibold rounded-2xl py-3.5 shadow-lg active:scale-[0.98] transition`}
      >
        Unlock Everything — $4.99
      </button>

      {!onClose ? (
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-3 w-full text-sm text-slate-400 hover:text-slate-600 transition py-2 text-center"
        >
          Not now — go back to home
        </button>
      ) : (
        <button onClick={onClose} className="mt-3 w-full text-sm text-slate-400 hover:text-slate-600 transition py-2 text-center">
          Maybe later
        </button>
      )}
    </>
  );
}

function AuthStep({
  accentBg,
  accent,
  email,
  setEmail,
  onContinue,
  onClose,
}: {
  accentBg: string;
  accent: string;
  email: string;
  setEmail: (v: string) => void;
  onContinue: () => void;
  onClose?: () => void;
}) {
  const handleEmail = () => {
    if (!email.trim() || !email.includes("@")) return;
    onContinue();
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">👤</div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
          Create your account
        </h2>
        <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Step 1 of 2 — We'll save your account, then you'll complete payment.
        </p>
      </div>

      <div className="space-y-3 mb-5">
        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 text-slate-800 dark:text-slate-50 font-semibold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-white/20 transition active:scale-[0.98]"
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          <span className="mx-3 text-xs text-slate-400 font-medium">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        </div>

        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEmail()}
            placeholder="Enter your email"
            className="flex-1 bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 transition"
          />
          <button
            onClick={handleEmail}
            className={`${accentBg} text-white rounded-2xl px-4 py-3.5 text-sm font-semibold shadow transition active:scale-95`}
          >
            <Mail className="size-4" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 leading-relaxed mb-4">
        By continuing you agree to our{" "}
        <span className="underline cursor-pointer">Terms</span> &{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>

      {onClose && (
        <button onClick={onClose} className="w-full text-sm text-slate-400 hover:text-slate-600 transition py-2 text-center">
          Maybe later
        </button>
      )}
    </>
  );
}

function PaymentStep({
  accentBg,
  accent,
  email,
  paid,
  onPay,
  onClose,
}: {
  accentBg: string;
  accent: string;
  email: string;
  paid: boolean;
  onPay: () => void;
  onClose?: () => void;
}) {
  if (paid) {
    return (
      <div className="text-center py-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">You're all set!</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Wannas Premium is now unlocked. Enjoy unlimited access to all questions and modes.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className={`mt-8 w-full ${accent} text-white text-base font-semibold rounded-2xl py-3.5 shadow-lg active:scale-[0.98] transition`}
          >
            Start Playing →
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">💳</div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
          Complete your purchase
        </h2>
        <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Step 2 of 2 — One-time payment, no subscription.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-white/5 rounded-2xl px-5 py-4 mb-2 flex items-center justify-between">
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-50 text-base">Wannas Premium</div>
          {email && (
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[180px]">{email}</div>
          )}
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">$4.99</div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-5">
        One-time purchase · No subscription ever · Instant access
      </p>

      <button
        onClick={onPay}
        className={`w-full ${accent} text-white text-base font-semibold rounded-2xl py-3.5 shadow-lg active:scale-[0.98] transition`}
      >
        Pay $4.99 →
      </button>

      {onClose && (
        <button onClick={onClose} className="mt-3 w-full text-sm text-slate-400 hover:text-slate-600 transition py-2 text-center">
          Maybe later
        </button>
      )}
    </>
  );
}
