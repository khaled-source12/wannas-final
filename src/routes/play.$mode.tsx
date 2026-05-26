import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import { MODES, QUESTIONS, FAMILY_QUESTIONS, type TopMode, type FamilyAgeGroup } from "@/lib/game";
import GameScreen from "@/components/GameScreen";

export const Route = createFileRoute("/play/$mode")({
  component: PlayScreen,
  beforeLoad: ({ params }) => {
    if (!(params.mode in MODES) || params.mode === "friends") throw notFound();
  },
});

function PlayScreen() {
  const { mode } = useParams({ from: "/play/$mode" }) as { mode: Exclude<TopMode, "friends"> };
  const m = MODES[mode];

  let questions = QUESTIONS[mode];
  let nameOverride: string | undefined;
  let emojiOverride: string | undefined;

  if (mode === "family") {
    const stored = sessionStorage.getItem("familyAgeGroup") as FamilyAgeGroup | null;
    const ageGroup: FamilyAgeGroup = stored && stored in FAMILY_QUESTIONS ? stored : "mixed";
    questions = FAMILY_QUESTIONS[ageGroup];

    const labels: Record<FamilyAgeGroup, { name: string; emoji: string }> = {
      young:  { name: "Heart to Heart", emoji: "🧒" },
      older:  { name: "Heart to Heart", emoji: "🧑" },
      teen:   { name: "Heart to Heart", emoji: "🧑‍🤝‍🧑" },
      mixed:  { name: "Heart to Heart", emoji: "🖤" },
    };
    nameOverride  = labels[ageGroup].name;
    emojiOverride = labels[ageGroup].emoji;
  }

  return (
    <GameScreen
      modeKey={mode}
      name={nameOverride ?? m.name}
      emoji={emojiOverride ?? m.emoji}
      bgClass={m.bgClass}
      accent={m.accent}
      accentSoft={m.accentSoft}
      text={m.text}
      questions={questions}
      backPath="/mode/$mode"
      backParams={{ mode }}
      paywallMode={mode}
    />
  );
}
