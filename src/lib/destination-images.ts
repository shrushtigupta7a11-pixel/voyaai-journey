import destKyoto from "@/assets/dest-kyoto.jpg";
import destSantorini from "@/assets/dest-santorini.jpg";
import destIceland from "@/assets/dest-iceland.jpg";
import destMarrakesh from "@/assets/dest-marrakesh.jpg";
import destQueenstown from "@/assets/dest-queenstown.jpg";
import destLisbon from "@/assets/dest-lisbon.jpg";
import pkgAmalfi from "@/assets/pkg-amalfi.jpg";
import pkgKyoto from "@/assets/pkg-kyoto.jpg";
import pkgIceland from "@/assets/pkg-iceland.jpg";
import heroCoast from "@/assets/hero-coast.jpg";

export const GALLERY = [
  destKyoto, destSantorini, destIceland, destMarrakesh,
  destQueenstown, destLisbon, pkgAmalfi, pkgKyoto, pkgIceland, heroCoast,
];

const KEYWORDS: Array<[string[], string]> = [
  [["kyoto", "japan", "tokyo", "osaka"], destKyoto],
  [["santorini", "greece", "athens", "mykonos"], destSantorini],
  [["iceland", "reykjav", "norway", "finland", "arctic"], destIceland],
  [["marrakesh", "marrakech", "morocco", "dubai", "cairo", "egypt"], destMarrakesh],
  [["queenstown", "new zealand", "switzerland", "alps", "nepal", "himalaya"], destQueenstown],
  [["lisbon", "portugal", "porto", "spain", "barcelona"], destLisbon],
  [["amalfi", "italy", "rome", "positano", "capri"], pkgAmalfi],
  [["bali", "thailand", "maldives", "goa", "phuket", "indonesia"], destSantorini],
];

/** Deterministic image for a destination string, with a stable fallback. */
export function destinationImage(name?: string | null, index = 0): string {
  const q = (name ?? "").toLowerCase();
  for (const [keys, img] of KEYWORDS) {
    if (keys.some((k) => q.includes(k))) return img;
  }
  const hash = q ? [...q].reduce((a, c) => a + c.charCodeAt(0), 0) : index;
  return GALLERY[hash % GALLERY.length];
}
