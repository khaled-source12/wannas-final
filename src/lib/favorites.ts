export type FavoriteCard = { text: string; mode: string };

const KEY = "spark-favorites";

function load(): FavoriteCard[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(favs: FavoriteCard[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(favs));
  } catch {}
}

export function getFavorites(): FavoriteCard[] {
  return load();
}

export function isFavorite(text: string): boolean {
  return load().some((f) => f.text === text);
}

export function toggleFavorite(text: string, mode: string): boolean {
  const favs = load();
  const idx = favs.findIndex((f) => f.text === text);
  if (idx >= 0) {
    favs.splice(idx, 1);
    save(favs);
    return false;
  } else {
    favs.push({ text, mode });
    save(favs);
    return true;
  }
}
