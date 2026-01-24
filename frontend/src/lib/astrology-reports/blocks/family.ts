/**
 * Family Interpretation Blocks
 *
 * Reusable, deterministic text blocks for family predictions.
 * Selected by rule engine based on planetary positions.
 */

// ============================================
// Dasha-Based Blocks
// ============================================

export const FAMILY_DASHA_BLOCKS = {
  saturn_active:
    "Family responsibilities may feel heavier. Patience with " +
    "elderly family members brings long-term harmony.",

  jupiter_active:
    "Blessings from elders and family expansion are possible. " +
    "Family gatherings bring joy.",

  mars_active:
    "Family dynamics may have occasional friction. Channel " +
    "protective energy constructively.",

  venus_active:
    "Harmony and beauty in home life are favored. " +
    "Home improvements bring satisfaction.",

  mercury_active:
    "Communication with family members improves. " +
    "Siblings and relatives play important roles.",

  rahu_active:
    "Unconventional family situations may arise. " +
    "Foreign residence or unique living arrangements possible.",

  ketu_active:
    "Detachment from family conflicts brings peace. " +
    "Past family patterns may need resolution.",

  sun_active:
    "Father figures and authority in family are highlighted. " +
    "Family pride and legacy matter.",

  moon_active:
    "Mother and nurturing relationships are central. " +
    "Emotional bonds with family deepen.",
};

// ============================================
// House-Based Blocks
// ============================================

export const FAMILY_HOUSE_BLOCKS = {
  jupiter_4th:
    "Excellent for domestic happiness and property matters. " +
    "Home environment supports growth.",

  moon_4th:
    "Strong emotional attachment to home and family. " +
    "Nurturing domestic environment.",

  venus_4th:
    "Beautiful and comfortable home life. " +
    "Harmony in domestic relationships.",

  saturn_4th:
    "Responsibilities toward home and parents increase. " +
    "Property matters require patience.",

  mars_4th:
    "Energy and activity at home. Guard against " +
    "domestic conflicts or property disputes.",

  sun_4th:
    "Pride in home and heritage. Father's influence " +
    "on domestic matters is significant.",
};

// ============================================
// General Family Blocks
// ============================================

export const FAMILY_GENERAL_BLOCKS = {
  growth_year:
    "Family relationships expand positively. New members " +
    "or deepening bonds are possible.",

  growth_year_alt:
    "Domestic life blossoms. Enjoy shared moments and " +
    "welcome new connections into your circle.",

  foundation_year:
    "Build stable family foundations. Address any " +
    "underlying issues with patience.",

  foundation_year_alt:
    "Strengthen your home base. Support from relatives " +
    "provides the security you seek.",

  intensity_year:
    "Family demands may increase. Balance personal " +
    "and family responsibilities carefully.",

  intensity_year_alt:
    "Domestic duties require your attention. Handle obligations " +
    "promptly to maintain peace at home.",

  harvest_year:
    "Enjoy the fruits of family harmony. Celebrate " +
    "family achievements together.",

  harvest_year_alt:
    "A joyful period for family matters. Gatherings " +
    "and reunions are particularly auspicious.",

  transition_year:
    "Family dynamics may shift. Adapt to changing " +
    "roles within the family structure.",

  transition_year_alt:
    "Changes at home bring new perspectives. " +
    "Be open to unconventional family solutions.",
};

// ============================================
// Advice Blocks
// ============================================

export const FAMILY_ADVICE_BLOCKS = {
  quality_time: "Dedicate quality time to family members regularly.",

  resolve_conflicts:
    "Address family conflicts with patience and understanding.",

  support_elders: "Pay special attention to elderly family members.",

  strengthen_bonds:
    "Invest in strengthening family bonds through communication.",

  balance_needs: "Balance individual needs with family responsibilities.",
};

// ============================================
// Personal Year Specific Blocks
// ============================================

export const FAMILY_PERSONAL_YEAR_BLOCKS: Record<number, string> = {
  1: "You may take a more independent role within the family this year. Setting boundaries or starting a new household is possible. Don't alienate loved ones.",
  2: "Family is central. Focus on harmony, resolving conflicts, and supporting others. A good year for reunions or expanding the family.",
  3: "Social life within the family is active. Celebrations, gatherings, and joy with children are highlighted. Communication flows easily.",
  4: "Domestic responsibilities increase. Home repairs, organizing family finances, or caring for elders may take precedence. Build security.",
  5: "Changes in the home environment. Moving house, family travel, or shifts in family structure are likely. Adaptability is key.",
  6: "The year of domestic duty and love. Marriage, birth, or assuming head-of-household responsibilities are favored. Relationships deepen.",
  7: "A need for privacy within the home. You may withdraw slightly to reflect. Spiritual connections with family members matter more than social ones.",
  8: "Family finances or property matters come to the forefront. Managing shared assets or planning for the family's future legacy is important.",
  9: "Letting go of old family patterns or grievances. Forgiveness brings healing. Prepare for a new chapter in domestic life.",
};
