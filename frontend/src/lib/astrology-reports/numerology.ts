/**
 * Numerology Engine
 *
 * Handles core profile calculations and year-specific numerology predictions.
 */

import { YearlyNumerology } from "./types";

// ============================================
// Helpers
// ============================================

/**
 * Reduce a number to a single digit (1-9),
 * preserving Master Numbers (11, 22, 33) if needed in future,
 * but currently standardizing to 1-9 for simplicity.
 */
function reduceToDigit(num: number): number {
  let sum = num;
  while (sum > 9) {
    sum = String(sum)
      .split("")
      .reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum;
}

/**
 * Pythagorean Letter-to-Number Map
 */
const LETTER_MAP: Record<string, number> = {
  a: 1,
  j: 1,
  s: 1,
  b: 2,
  k: 2,
  t: 2,
  c: 3,
  l: 3,
  u: 3,
  d: 4,
  m: 4,
  v: 4,
  e: 5,
  n: 5,
  w: 5,
  f: 6,
  o: 6,
  x: 6,
  g: 7,
  p: 7,
  y: 7,
  h: 8,
  q: 8,
  z: 8,
};

function calculateNameNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
  let sum = 0;
  for (const char of cleanName) {
    sum += LETTER_MAP[char] || 0;
  }
  return reduceToDigit(sum);
}

function calculateSoulUrge(name: string): number {
  const vowels = "aeiou";
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
  let sum = 0;
  for (const char of cleanName) {
    if (vowels.includes(char)) {
      sum += LETTER_MAP[char] || 0;
    }
  }
  return reduceToDigit(sum);
}

function calculatePersonality(name: string): number {
  const vowels = "aeiou";
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
  let sum = 0;
  for (const char of cleanName) {
    if (!vowels.includes(char)) {
      sum += LETTER_MAP[char] || 0;
    }
  }
  return reduceToDigit(sum);
}

export function calculateCoreNumerology(dob: string, name: string) {
  const [year, month, day] = dob.split("-").map(Number);

  // Life Path: Sum of Month + Day + Year
  const lifePath = reduceToDigit(
    reduceToDigit(month) + reduceToDigit(day) + reduceToDigit(year),
  );

  // Birth Number: Just the day
  const birthNum = reduceToDigit(day);

  // Name Numbers
  const destinyNum = calculateNameNumber(name);
  const soulUrgeNum = calculateSoulUrge(name);
  const personalityNum = calculatePersonality(name);

  return {
    lifePath: { number: lifePath, meaning: CORE_MEANINGS.lifePath[lifePath] },
    destiny: { number: destinyNum, meaning: CORE_MEANINGS.destiny[destinyNum] },
    soulUrge: {
      number: soulUrgeNum,
      meaning: CORE_MEANINGS.soulUrge[soulUrgeNum],
    },
    personality: {
      number: personalityNum,
      meaning: CORE_MEANINGS.personality[personalityNum],
    },
    birthDate: { number: birthNum, meaning: CORE_MEANINGS.birthDate[birthNum] },
  };
}

export function calculatePersonalYearPrediction(
  dob: string,
  targetYear: number,
): YearlyNumerology {
  const [_, month, day] = dob.split("-").map(Number);

  // Personal Year = Month + Day + Current Year
  const personalYear = reduceToDigit(
    reduceToDigit(month) + reduceToDigit(day) + reduceToDigit(targetYear),
  );

  const element = ELEMENT_MAP[personalYear];

  return {
    personalYear,
    prediction: PERSONAL_YEAR_PREDICTIONS[personalYear],
    theme: PERSONAL_YEAR_THEMES[personalYear],
    element,
  };
}

// ============================================
// Data / Text Blocks
// ============================================

const ELEMENT_MAP: Record<number, "Fire" | "Earth" | "Air" | "Water"> = {
  1: "Fire",
  2: "Water",
  3: "Fire",
  4: "Earth",
  5: "Air",
  6: "Air",
  7: "Water",
  8: "Earth",
  9: "Fire",
};

const PERSONAL_YEAR_THEMES: Record<number, string> = {
  1: "New Beginnings & Independence",
  2: "Cooperation & Patience",
  3: "Creativity & Self-Expression",
  4: "Hard Work & Foundation",
  5: "Change & Freedom",
  6: "Responsibility & Home",
  7: "Reflection & Inner Growth",
  8: "Achievement & Power",
  9: "Completion & Letting Go",
};

const PERSONAL_YEAR_PREDICTIONS: Record<number, string> = {
  1: "This is a year of new beginnings and fresh starts. It's the perfect time to launch new projects, take initiative, and assert your independence. Energy levels will be high, so channel them into constructive goals.",
  2: "A year for patience, cooperation, and partnership. Progress may seem slower, but it is steady. Focus on diplomacy and waiting for the right timing rather than forcing outcomes.",
  3: "This year emphasizes joy, creativity, and social interaction. Express yourself freely and potential opportunities will arise through networking and social circles. Optimism is your key strength now.",
  4: "A practical year dedicated to building foundations. It requires discipline, organization, and hard work. What you build this year will serve as a stable base for the future.",
  5: "Expect the unexpected. This is a dynamic year of change, travel, and new experiences. Be adaptable and embrace freedom. It's a great time to break old routines.",
  6: "Family, home, and responsibility take center stage. You may find yourself playing a caretaker role. Focus on harmony in relationships and domestic stability.",
  7: "A quiet year for introspection and study. Look inward for answers rather than seeking validation externally. Spiritual growth and intellectual pursuits are favored.",
  8: "This is your power year for career and finance. Ambition meets opportunity. It's a time to organize, lead, and manifest material success through efficient action.",
  9: "The end of a 9-year cycle. Focus on completion, letting go of what no longer serves you, and preparing for the new. Compassion and humanitarian efforts bring deep satisfaction.",
};

const CORE_MEANINGS = {
  lifePath: {
    1: "You are a born leader, independent and ambitious.",
    2: "You are a diplomat, sensitive and cooperative.",
    3: "You are a creative spirit, expressive and joyful.",
    4: "You are a builder, grounded and hardworking.",
    5: "You are an adventurer, freedom-loving and versatile.",
    6: "You are a nurturer, responsible and caring.",
    7: "You are a seeker, analytical and spiritual.",
    8: "You are an achiever, powerful and material-focused.",
    9: "You are a humanitarian, compassionate and selfless.",
  } as Record<number, string>,

  destiny: {
    1: "To lead and innovate.",
    2: "To bring harmony and balance.",
    3: "To inspire and uplift others.",
    4: "To build lasting systems.",
    5: "To embrace change and freedom.",
    6: "To serve and nurture.",
    7: "To seek truth and wisdom.",
    8: "To succeed in the material world.",
    9: "To help humanity.",
  } as Record<number, string>,

  soulUrge: {
    1: "Desires independence and leadership.",
    2: "Desires love and peace.",
    3: "Desires self-expression and fun.",
    4: "Desires order and stability.",
    5: "Desires adventure and variety.",
    6: "Desires harmony and family.",
    7: "Desires knowledge and silence.",
    8: "Desires success and status.",
    9: "Desires to give to the world.",
  } as Record<number, string>,

  personality: {
    1: "Appears confident and dominant.",
    2: "Appears friendly and approachable.",
    3: "Appears charming and entertaining.",
    4: "Appears disciplined and serious.",
    5: "Appears witty and adventurous.",
    6: "Appears fatherly/motherly and caring.",
    7: "Appears mysterious and intelligent.",
    8: "Appears strong and influential.",
    9: "Appears generous and kind.",
  } as Record<number, string>,

  birthDate: {
    1: "Independent and original approach.",
    2: "Intuitive and sensitive nature.",
    3: "Artistic and expressive talents.",
    4: "Methodical and practical mind.",
    5: "Quick-thinking and versatile.",
    6: "Responsible and family-oriented.",
    7: "Analytical and philosophical.",
    8: "Business-minded and efficient.",
    9: "Broad-minded and idealistic.",
  } as Record<number, string>,
};
