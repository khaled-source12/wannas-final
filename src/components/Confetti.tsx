const COLORS = ["#fb7185", "#a78bfa", "#34d399", "#60a5fa", "#fbbf24", "#f97316", "#e879f9"];

const PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  left: 5 + Math.random() * 90,
  delay: Math.random() * 0.7,
  duration: 1.3 + Math.random() * 0.9,
  size: 6 + Math.random() * 8,
  isCircle: Math.random() > 0.45,
  initRotation: Math.random() * 360,
}));

export default function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: "-24px",
            left: `${p.left}%`,
            animationName: "confetti-fall",
            animationTimingFunction: "linear",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationFillMode: "forwards",
          }}
        >
          <div
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.isCircle ? "50%" : "2px",
              transform: `rotate(${p.initRotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
