import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/family-activities")({
  component: FamilyActivities,
});

type AgeGroup = "toddler" | "young" | "older" | "teen";
type Location = "Home" | "Mall" | "Beach" | "Park";

interface Activity {
  name: string;
  description: string;
  emoji: string;
  duration: string;
}

function getAgeGroup(age: number): AgeGroup {
  if (age <= 4) return "toddler";
  if (age <= 8) return "young";
  if (age <= 12) return "older";
  return "teen";
}

const ACTIVITIES: Record<AgeGroup, Record<Location, Activity[]>> = {
  toddler: {
    Home: [
      { name: "Finger Painting", emoji: "🎨", description: "Set up a safe painting station — let them create art with their hands on paper or a tray.", duration: "30–45 min" },
      { name: "Pillow Fort", emoji: "🏰", description: "Build a cosy fort using cushions, pillows and blankets. Hide inside with a torch and a snack.", duration: "45–60 min" },
      { name: "Simon Says", emoji: "🙋", description: "Classic game perfect for toddlers — gets them moving, listening, and giggling.", duration: "20–30 min" },
      { name: "Playdough Shapes", emoji: "🧁", description: "Roll, squish, and create different shapes and pretend foods together.", duration: "30–45 min" },
      { name: "Dance Party", emoji: "💃", description: "Put on their favourite songs and have a wild living-room dance party.", duration: "20–30 min" },
    ],
    Mall: [
      { name: "Toy Store Tour", emoji: "🧸", description: "Explore the toy store — let them pick their favourite toy to tell you about (no buying required!).", duration: "30–40 min" },
      { name: "Food Court Taste Test", emoji: "🍟", description: "Visit different food stalls and try small bites together. Talk about favourites.", duration: "30–45 min" },
      { name: "Escalator Adventure", emoji: "🛗", description: "Ride the escalators and pretend you're going to different magical floors.", duration: "15–20 min" },
      { name: "Spot the Colour Game", emoji: "🌈", description: "Walk around the mall calling out colours — first to spot each colour wins.", duration: "30 min" },
    ],
    Beach: [
      { name: "Sand Castles", emoji: "🏰", description: "Build the biggest, most epic sandcastle you can. Add shells and stones as decorations.", duration: "45–60 min" },
      { name: "Shell Hunt", emoji: "🐚", description: "Walk the shoreline collecting the most interesting shells. See who finds the best one.", duration: "30–45 min" },
      { name: "Wave Jumping", emoji: "🌊", description: "Stand at the water's edge and jump over incoming waves together.", duration: "30 min" },
      { name: "Draw in the Sand", emoji: "✍️", description: "Use sticks or fingers to draw animals, letters and shapes in the wet sand.", duration: "20–30 min" },
    ],
    Park: [
      { name: "Animal Spotting", emoji: "🐦", description: "Count how many different animals, insects or birds you can spot on your walk.", duration: "30–45 min" },
      { name: "Flower Collection", emoji: "🌸", description: "Collect fallen leaves, petals and interesting sticks to make a nature collage later.", duration: "30 min" },
      { name: "Obstacle Course", emoji: "🏃", description: "Use benches, trees, and paths to create a fun obstacle course to run through.", duration: "30–45 min" },
      { name: "Bubble Blowing", emoji: "🫧", description: "Bring a bottle of bubbles and chase them around the park.", duration: "20–30 min" },
    ],
  },
  young: {
    Home: [
      { name: "Board Game Tournament", emoji: "🎲", description: "Pick 2–3 board games and play a mini tournament. Keep score across all games.", duration: "60–90 min" },
      { name: "Indoor Scavenger Hunt", emoji: "🔍", description: "Hide 10 objects around the house with clues leading to the next one. Prize at the end.", duration: "45–60 min" },
      { name: "Cook Together", emoji: "👨‍🍳", description: "Let the kids help make a simple recipe — pizza, pancakes, or biscuits. Eat the results together.", duration: "45–60 min" },
      { name: "Magic Show", emoji: "🪄", description: "Look up simple card tricks or magic tricks online and practice performing them for each other.", duration: "45 min" },
      { name: "Build a Movie Night", emoji: "🎬", description: "Let the kids pick the film, make popcorn and build a blanket cinema in the living room.", duration: "2 hrs" },
    ],
    Mall: [
      { name: "Guess the Price", emoji: "🏷️", description: "Walk into shops and guess how much items cost — whoever is closest wins a point.", duration: "45 min" },
      { name: "Photo Challenge", emoji: "📸", description: "Give each child a phone and a list of things to photograph (e.g. something red, something funny).", duration: "30–40 min" },
      { name: "Design Your Dream Store", emoji: "🏪", description: "Walk past stores and let the kids describe what their own version of that store would sell.", duration: "30 min" },
      { name: "Food Court Masterchef", emoji: "🍽️", description: "Each child picks one dish from the food court — then you all taste and rate each one.", duration: "45–60 min" },
    ],
    Beach: [
      { name: "Beach Olympics", emoji: "🏅", description: "Run races, long jump into soft sand, and do a 3-legged race. Award medals to all.", duration: "45–60 min" },
      { name: "Sand Sculpture Battle", emoji: "🗿", description: "Split into teams. Each team sculpts an animal or character from sand. Vote on the best.", duration: "45 min" },
      { name: "Skim Stones Contest", emoji: "🪨", description: "Find flat stones and learn to skim them across the water. Count the bounces.", duration: "30 min" },
      { name: "Beach Treasure Hunt", emoji: "💎", description: "Create a list of things to find: a perfectly round pebble, a feather, a striped shell, etc.", duration: "30–45 min" },
    ],
    Park: [
      { name: "Frisbee Tournament", emoji: "🥏", description: "Play frisbee — mix up teams and keep score. Losers do funny forfeits.", duration: "45 min" },
      { name: "Nature Art", emoji: "🍃", description: "Collect leaves, twigs and petals and arrange them on the ground into a piece of art.", duration: "30 min" },
      { name: "Cloud Watching", emoji: "☁️", description: "Lie on the grass and take turns saying what shapes you see in the clouds. Rate each other's creativity.", duration: "20–30 min" },
      { name: "Hide and Seek", emoji: "🙈", description: "Classic hide and seek with a twist: the seeker has to describe where they found each person.", duration: "30–45 min" },
    ],
  },
  older: {
    Home: [
      { name: "Escape Room at Home", emoji: "🔐", description: "Set up a homemade escape room with puzzles, riddles, and a hidden key. 30-minute time limit.", duration: "60–90 min" },
      { name: "Bake-Off Challenge", emoji: "🎂", description: "Everyone bakes or decorates a cupcake or biscuit. Rate on taste, creativity and presentation.", duration: "60 min" },
      { name: "Trivia Night", emoji: "🧠", description: "Create teams and run a quiz across categories: sport, geography, movies, science. Crown a winner.", duration: "45–60 min" },
      { name: "Movie Pitch", emoji: "🎥", description: "Each person invents a movie concept (title, cast, plot in 30 seconds). Everyone votes on the best.", duration: "30–45 min" },
      { name: "Card Game Marathon", emoji: "🃏", description: "Play Uno, Rummy or Go Fish. Play 5 rounds and see who comes out on top.", duration: "60 min" },
    ],
    Mall: [
      { name: "Style Challenge", emoji: "👗", description: "Pick one item for each other from a clothing store within a £10 budget. Try them on.", duration: "45–60 min" },
      { name: "Would You Buy? Game", emoji: "🛒", description: "Walk through stores — for each unusual item, everyone bets whether they'd buy it or not.", duration: "30 min" },
      { name: "Smoothie Invention", emoji: "🥤", description: "Visit a juice bar and challenge each other to invent the weirdest smoothie that actually tastes good.", duration: "30–40 min" },
      { name: "Photography Battle", emoji: "📷", description: "Spend 20 minutes taking the most creative photos around the mall. Review and vote on the best.", duration: "40 min" },
    ],
    Beach: [
      { name: "Volleyball", emoji: "🏐", description: "Set up a makeshift net (use towels or bags) and play beach volleyball. First to 15 wins.", duration: "45–60 min" },
      { name: "Bodyboard Competition", emoji: "🏄", description: "Take turns riding waves on a bodyboard — score each other on distance, style and wipeouts.", duration: "45 min" },
      { name: "Build a Raft Challenge", emoji: "⛵", description: "Using only items found on the beach, build a raft and test if it floats in shallow water.", duration: "45–60 min" },
      { name: "Sunset Photography", emoji: "🌅", description: "Walk the beach at golden hour and everyone takes photos. Vote on the best shot at dinner.", duration: "30–45 min" },
    ],
    Park: [
      { name: "Capture the Flag", emoji: "🚩", description: "Split into two teams. Hide your flag and try to capture theirs before they get yours.", duration: "45 min" },
      { name: "Orienteering Challenge", emoji: "🗺️", description: "Draw a simple map of the park and challenge each other to find 5 specific spots using only the map.", duration: "45–60 min" },
      { name: "Kickball Match", emoji: "⚽", description: "Set up bases and play a game of kickball. Teams of 2 work well in a smaller park.", duration: "45 min" },
      { name: "Survival Skills", emoji: "🌿", description: "Learn to identify 5 different plants, build a basic shelter from sticks, and navigate by the sun.", duration: "60 min" },
    ],
  },
  teen: {
    Home: [
      { name: "Cooking Battle", emoji: "👨‍🍳", description: "Each person cooks a dish from a random ingredient pulled from a hat. Rate and eat the results.", duration: "60–90 min" },
      { name: "Escape Room Night", emoji: "🔐", description: "Book an online escape room or create one with complex riddles. Work as a team against the clock.", duration: "60 min" },
      { name: "Documentary Night", emoji: "🎬", description: "Each person picks a 10-minute documentary clip. Watch all of them and discuss the most interesting.", duration: "60 min" },
      { name: "Podcast Record", emoji: "🎙️", description: "Record a 10-minute family podcast episode on any topic — sport, travel, news, or life advice.", duration: "45 min" },
      { name: "Design Sprint", emoji: "✏️", description: "Everyone designs a logo, product or app idea in 20 minutes, then pitches it to the family.", duration: "45 min" },
    ],
    Mall: [
      { name: "Charity Shop Flip", emoji: "♻️", description: "Give each teen £5 to spend in a charity/thrift shop. At home, decide whose buy was the best value.", duration: "45–60 min" },
      { name: "Food Review Blog", emoji: "🍔", description: "Go to 3 different food stalls. Write, record or voice-note a proper review for each one.", duration: "60 min" },
      { name: "Outfit Challenge", emoji: "👑", description: "Each person styles an outfit for someone else using only items available in one store.", duration: "45 min" },
      { name: "Mall Scavenger Hunt", emoji: "🔍", description: "Create a list of 15 things to find — a store with a blue logo, a fake plant, a security camera, etc.", duration: "45–60 min" },
    ],
    Beach: [
      { name: "Surfing Lesson", emoji: "🏄", description: "Book a group beginner surf lesson or practice bodyboarding together in shallow water.", duration: "90 min" },
      { name: "Campfire & Stories", emoji: "🔥", description: "If permitted, build a small fire and take turns telling true (or invented) stories about the sea.", duration: "60 min" },
      { name: "Sea Swimming Challenge", emoji: "🌊", description: "Swim to a marker buoy or float and back. Time each other. Celebrate every finisher.", duration: "30–45 min" },
      { name: "Long Walk & Talk", emoji: "🚶", description: "Walk in one direction for 30 minutes with a rule: no phones, only real conversation.", duration: "60 min" },
    ],
    Park: [
      { name: "Sports Medley", emoji: "🏃", description: "Rotate through 4 sports every 10 minutes: football, frisbee, badminton, sprint races.", duration: "60 min" },
      { name: "Debate Club", emoji: "🗣️", description: "Draw a debate topic from a hat and argue for 5 minutes each. Topics: sport, food, travel, life.", duration: "45 min" },
      { name: "Mindful Walk", emoji: "🌿", description: "Walk in silence for 10 minutes — notice 5 things you see, 4 you hear, 3 you feel. Share after.", duration: "30 min" },
      { name: "Sketch Battle", emoji: "✏️", description: "Everyone draws the same park scene in 10 minutes. Vote on the most creative interpretation.", duration: "30 min" },
    ],
  },
};

function FamilyActivities() {
  const [phase, setPhase] = useState<"setup" | "results">("setup");
  const [numKids, setNumKids] = useState(2);
  const [ages, setAges] = useState<number[]>([6, 9]);
  const [location, setLocation] = useState<Location | null>(null);
  const [shownIndices, setShownIndices] = useState<number[]>([0, 1, 2]);

  const m = { bgClass: "bg-mode-family", accent: "bg-emerald-500 hover:bg-emerald-600", accentSoft: "bg-emerald-100", text: "text-emerald-600" };

  const updateNumKids = (n: number) => {
    setNumKids(n);
    setAges((prev) => {
      const next = [...prev];
      while (next.length < n) next.push(8);
      return next.slice(0, n);
    });
  };

  const getActivities = (): Activity[] => {
    if (!location) return [];
    const minAge = Math.min(...ages);
    const group = getAgeGroup(minAge);
    return ACTIVITIES[group][location] ?? [];
  };

  const handleGenerate = (loc: Location) => {
    setLocation(loc);
    setShownIndices([0, 1, 2]);
    setPhase("results");
  };

  const shuffleActivities = () => {
    const acts = getActivities();
    const available = acts.map((_, i) => i);
    const next: number[] = [];
    while (next.length < Math.min(3, available.length)) {
      const i = Math.floor(Math.random() * available.length);
      if (!next.includes(available[i])) next.push(available[i]);
    }
    setShownIndices(next.length > 0 ? next : [0, 1, 2]);
  };

  const activities = getActivities();
  const shown = shownIndices.map((i) => activities[i]).filter(Boolean);

  const LOCATIONS: { label: Location; emoji: string }[] = [
    { label: "Home", emoji: "🏠" },
    { label: "Mall", emoji: "🛍️" },
    { label: "Beach", emoji: "🏖️" },
    { label: "Park", emoji: "🌳" },
  ];

  if (phase === "results" && location) {
    const minAge = Math.min(...ages);
    const group = getAgeGroup(minAge);
    const groupLabel = { toddler: "Toddlers (2–4)", young: "Young Kids (5–8)", older: "Older Kids (9–12)", teen: "Teens (13+)" }[group];

    return (
      <div className={`${m.bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-10`}>
        <div className="w-full max-w-md mx-auto flex flex-col flex-1">
          <header className="flex items-center justify-between">
            <button
              onClick={() => setPhase("setup")}
              className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white transition"
            >
              <ArrowLeft className="size-5" />
            </button>
            <span className={`text-xs font-semibold uppercase tracking-widest ${m.text}`}>
              🎮 Activities
            </span>
            <div className="size-10" />
          </header>

          <div className="mt-6 mb-5">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Activities for you
            </h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
              {numKids} kid{numKids > 1 ? "s" : ""} · {groupLabel} · {LOCATIONS.find(l => l.label === location)?.emoji} {location}
            </p>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {shown.map((act, i) => (
              <div key={i} className="bg-white/85 dark:bg-white/10 backdrop-blur rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="flex items-start gap-4">
                  <div className={`size-14 grid place-items-center rounded-2xl ${m.accentSoft} text-3xl flex-none`}>
                    {act.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 dark:text-slate-50 text-base">{act.name}</div>
                    <div className={`text-xs font-semibold ${m.text} mt-0.5`}>{act.duration}</div>
                  </div>
                </div>
                <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {act.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={shuffleActivities}
              className="flex items-center justify-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur rounded-2xl h-12 text-slate-700 dark:text-slate-100 font-semibold text-sm hover:bg-white dark:hover:bg-white/20 transition active:scale-95"
            >
              <RefreshCw className="size-4" /> Try Different Activities
            </button>
            <button
              onClick={() => history.back()}
              className={`${m.accent} text-white text-base font-semibold rounded-2xl h-13 py-3.5 flex items-center justify-center w-full shadow-lg active:scale-[0.98] transition`}
            >
              Back to Family Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${m.bgClass} min-h-[100dvh] flex flex-col px-6 pt-6 pb-10`}>
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <header className="flex items-center justify-between">
          <Link
            to="/mode/$mode"
            params={{ mode: "family" }}
            className="size-10 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur text-slate-700 dark:text-slate-100 hover:bg-white transition"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <span className={`text-xs font-semibold uppercase tracking-widest ${m.text}`}>
            🎮 Activities
          </span>
          <div className="size-10" />
        </header>

        <div className="mt-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Let's plan something fun
          </h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">Tell us about your kids and we'll suggest activities.</p>
        </div>

        <div className="mt-6 flex flex-col gap-5 flex-1">
          <div className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-3xl p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">How many kids are playing?</p>
            <div className="flex items-center gap-4 justify-center">
              <button onClick={() => updateNumKids(Math.max(1, numKids - 1))} className="size-11 grid place-items-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-100 hover:bg-slate-200 transition active:scale-90">
                <Minus className="size-4" />
              </button>
              <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 w-12 text-center tabular-nums">{numKids}</span>
              <button onClick={() => updateNumKids(Math.min(6, numKids + 1))} className="size-11 grid place-items-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-100 hover:bg-slate-200 transition active:scale-90">
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-3xl p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Ages of the kids</p>
            <div className="flex flex-col gap-3">
              {ages.map((age, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400 w-16">Kid {i + 1}</span>
                  <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => { const n = [...ages]; n[i] = Math.max(2, age - 1); setAges(n); }} className="size-9 grid place-items-center rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 transition active:scale-90 text-slate-700 dark:text-slate-100">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="flex-1 text-center font-bold text-slate-900 dark:text-slate-50 text-base tabular-nums">{age} yrs</span>
                    <button onClick={() => { const n = [...ages]; n[i] = Math.min(17, age + 1); setAges(n); }} className="size-9 grid place-items-center rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 transition active:scale-90 text-slate-700 dark:text-slate-100">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-3xl p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Where are you?</p>
            <div className="grid grid-cols-2 gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.label}
                  onClick={() => handleGenerate(loc.label)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95 ${location === loc.label ? `${m.accentSoft} ring-2 ring-emerald-400` : "bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20"}`}
                >
                  <span className="text-2xl">{loc.emoji}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{loc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
