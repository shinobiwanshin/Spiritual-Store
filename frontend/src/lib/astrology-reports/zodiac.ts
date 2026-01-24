/**
 * Zodiac Logic Engine
 *
 * Handles Sun Sign derivation and compatibility mapping (Friends/Enemies).
 * Ensuring zodiac data is personalized to the user's birth date.
 */

export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

/**
 * Derive Sun Sign from Date of Birth
 */
export function getSunSign(dob: string): ZodiacSign {
  const date = new Date(dob);
  const day = date.getDate();
  const month = date.getMonth() + 1; // 0-indexed

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return "Aquarius";
  return "Pisces";
}

/**
 * Zodiac Compatibility Map
 * Defines Friend and Enemy signs for each Zodiac sign.
 */
const ZODIAC_COMPATIBILITY: Record<
  ZodiacSign,
  {
    friends: { sign: ZodiacSign; description: string }[];
    enemies: { sign: ZodiacSign; description: string }[];
  }
> = {
  Aries: {
    friends: [
      {
        sign: "Leo",
        description: "Shares your passion, energy, and zest for life.",
      },
      {
        sign: "Sagittarius",
        description: "Matches your adventurous spirit and love for freedom.",
      },
    ],
    enemies: [
      {
        sign: "Cancer",
        description: "Too emotional and cautious for your bold nature.",
      },
      {
        sign: "Capricorn",
        description: "Too serious and restrictive for your pace.",
      },
    ],
  },
  Taurus: {
    friends: [
      {
        sign: "Virgo",
        description: "Appreciates your practicality and need for order.",
      },
      {
        sign: "Capricorn",
        description: "Shares your ambition and material goals.",
      },
    ],
    enemies: [
      {
        sign: "Leo",
        description: "Clashes with your need for stability versus their drama.",
      },
      {
        sign: "Aquarius",
        description: "Too unpredictable and detached for your grounding.",
      },
    ],
  },
  Gemini: {
    friends: [
      {
        sign: "Libra",
        description: "Loves intellectual conversation and socializing alike.",
      },
      {
        sign: "Aquarius",
        description: "Matches your innovative ideas and mental agility.",
      },
    ],
    enemies: [
      {
        sign: "Virgo",
        description: "Too critical and detail-oriented for your free spirit.",
      },
      {
        sign: "Pisces",
        description: "Too emotional and vague for your logical mind.",
      },
    ],
  },
  Cancer: {
    friends: [
      {
        sign: "Scorpio",
        description: "Understand your deep emotional currents intuitively.",
      },
      {
        sign: "Pisces",
        description: "Shares your sensitivity and creative imagination.",
      },
    ],
    enemies: [
      {
        sign: "Aries",
        description: "Too aggressive and impulsive for your sensitive nature.",
      },
      {
        sign: "Libra",
        description: "Too superficial or indecisive for your depth.",
      },
    ],
  },
  Leo: {
    friends: [
      {
        sign: "Aries",
        description: "Matches your fiery energy and leadership qualities.",
      },
      {
        sign: "Sagittarius",
        description: "Shares your optimism and love for potential.",
      },
    ],
    enemies: [
      {
        sign: "Taurus",
        description: "Too stubborn and resistant to your authority.",
      },
      {
        sign: "Scorpio",
        description: "Power struggles are likely due to shared intensity.",
      },
    ],
  },
  Virgo: {
    friends: [
      {
        sign: "Taurus",
        description: "Shares your grounded and practical approach to life.",
      },
      {
        sign: "Capricorn",
        description: "Matches your work ethic and desire for achievement.",
      },
    ],
    enemies: [
      {
        sign: "Gemini",
        description: "Too scattered and unreliable for your standards.",
      },
      {
        sign: "Sagittarius",
        description: "Too reckless and careless for your precision.",
      },
    ],
  },
  Libra: {
    friends: [
      {
        sign: "Gemini",
        description: "Enjoy endless conversation and social engagement.",
      },
      {
        sign: "Aquarius",
        description: "Shares your intellectual approach and ideals.",
      },
    ],
    enemies: [
      {
        sign: "Cancer",
        description: "Too moody and emotional for your need for balance.",
      },
      {
        sign: "Capricorn",
        description: "Too cold and work-focused for your social needs.",
      },
    ],
  },
  Scorpio: {
    friends: [
      {
        sign: "Cancer",
        description: "Provides the emotional security and depth you crave.",
      },
      {
        sign: "Pisces",
        description: "Matches your intuition and psychic sensitivity.",
      },
    ],
    enemies: [
      {
        sign: "Leo",
        description: "Ego and power clashes are frequent.",
      },
      {
        sign: "Aquarius",
        description: "Too detached and aloof for your intense bonding.",
      },
    ],
  },
  Sagittarius: {
    friends: [
      {
        sign: "Aries",
        description: "Shares your adventurous and energetic outlook.",
      },
      {
        sign: "Leo",
        description: "Matches your enthusiasm and zest for life.",
      },
    ],
    enemies: [
      {
        sign: "Virgo",
        description: "Too critical and restrictive for your freedom.",
      },
      {
        sign: "Pisces",
        description: "Too sensitive and confusing for your directness.",
      },
    ],
  },
  Capricorn: {
    friends: [
      {
        sign: "Taurus",
        description: "Shares your appreciation for quality and stability.",
      },
      {
        sign: "Virgo",
        description: "Matches your discipline and practical focus.",
      },
    ],
    enemies: [
      {
        sign: "Aries",
        description: "Too impulsive and reckless for your long-term plans.",
      },
      {
        sign: "Libra",
        description: "Too indecisive and social for your solitary focus.",
      },
    ],
  },
  Aquarius: {
    friends: [
      {
        sign: "Gemini",
        description: "Shares your love for ideas and mental stimulation.",
      },
      {
        sign: "Libra",
        description: "Matches your social ideals and intellectualism.",
      },
    ],
    enemies: [
      {
        sign: "Taurus",
        description: "Too stubborn and traditional for your innovation.",
      },
      {
        sign: "Scorpio",
        description: "Too intense and controlling for your freedom.",
      },
    ],
  },
  Pisces: {
    friends: [
      {
        sign: "Cancer",
        description: "Understand your emotional and nurturing needs.",
      },
      {
        sign: "Scorpio",
        description: "Matches your depth and capability for intimacy.",
      },
    ],
    enemies: [
      {
        sign: "Gemini",
        description: "Too superficial and logical for your feelings.",
      },
      {
        sign: "Sagittarius",
        description: "Too blunt and insensitive for your nature.",
      },
    ],
  },
};

/**
 * Get Friend and Enemy signs for a given Sun Sign
 */
export function getZodiacRelations(sign: ZodiacSign) {
  return ZODIAC_COMPATIBILITY[sign] || { friends: [], enemies: [] };
}
