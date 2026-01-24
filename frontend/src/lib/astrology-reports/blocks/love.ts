/**
 * Love Interpretation Blocks
 *
 * Reusable, deterministic text blocks for love/relationship predictions.
 * Selected by rule engine based on planetary positions.
 */

// ============================================
// Dasha-Based Blocks
// ============================================

export const LOVE_DASHA_BLOCKS = {
  saturn_active:
    "Relationships require patience and commitment. Long-term " +
    "partnerships are tested but can strengthen.",

  jupiter_active:
    "Blessings in love and marriage are supported. Finding " +
    "a partner with shared values is favored.",

  mars_active:
    "Passion and intensity in relationships. Channel energy " +
    "constructively to avoid conflicts.",

  venus_active:
    "Excellent period for romance and love. Existing " +
    "relationships deepen and flourish.",

  mercury_active:
    "Communication in relationships improves. Intellectual " +
    "compatibility becomes more important.",

  rahu_active:
    "Unconventional relationships may form. Foreign or " +
    "unusual partnerships are possible.",

  ketu_active:
    "Spiritual connection in relationships matters more. " +
    "Past relationship patterns may need healing.",

  sun_active:
    "Pride and ego can affect relationships. Focus on " +
    "mutual respect and recognition.",

  moon_active:
    "Emotional depth in relationships is highlighted. " +
    "Nurturing partners bring happiness.",
};

// ============================================
// House-Based Blocks
// ============================================

export const LOVE_HOUSE_BLOCKS = {
  venus_7th:
    "Excellent placement for marriage and partnerships. " +
    "Harmony and attraction in relationships.",

  jupiter_7th:
    "Wisdom and ethics guide partner selection. " +
    "Beneficial, supportive partnerships form.",

  mars_7th:
    "Passion but potential for conflict in relationships. " +
    "Balance assertiveness with compromise.",

  saturn_7th:
    "Serious, committed relationships are favored. " +
    "Patience in finding the right partner.",

  sun_7th:
    "Partnerships with accomplished individuals. " +
    "Balance ego needs in relationships.",

  moon_7th:
    "Emotionally nurturing partnerships sought. " +
    "Partner's moods affect your wellbeing.",

  rahu_7th:
    "Unconventional or foreign partnerships possible. " +
    "Careful evaluation before commitment.",

  venus_5th:
    "Romance and creative expression flourish. " +
    "Love affairs bring joy and inspiration.",
};

// ============================================
// General Love Blocks
// ============================================

export const LOVE_GENERAL_BLOCKS = {
  growth_year:
    "New romantic opportunities may arise. Existing " +
    "relationships can reach new depths.",

  growth_year_alt:
    "Love flows more freely this year. Be open to " +
    "unexpected romantic encounters or renewals.",

  foundation_year:
    "Build stable relationship foundations. Trust " +
    "and commitment deepen through consistency.",

  foundation_year_alt:
    "Establish trust and security in your partnerships. " +
    "Reliability is your most attractive quality now.",

  intensity_year:
    "Relationships face tests that can strengthen bonds. " +
    "Commitment and effort are required.",

  intensity_year_alt:
    "Passions run high. Navigate intense emotions with " +
    "honesty to forge unbreakable bonds.",

  harvest_year:
    "Enjoy the rewards of relationship investments. " +
    "Love and partnership bring fulfillment.",

  harvest_year_alt:
    "A time of romantic celebration. Shared joy and " +
    "milestones enrich your connection.",

  transition_year:
    "Relationship dynamics may shift. Adapt to " +
    "changing needs while maintaining core connection.",

  transition_year_alt:
    "Evolving needs transform your love life. " +
    "Embrace the new form your relationships take.",
};

// ============================================
// Advice Blocks
// ============================================

export const LOVE_ADVICE_BLOCKS = {
  open_communication:
    "Maintain open and honest communication with your partner.",

  patience: "Practice patience and understanding in relationship matters.",

  self_love:
    "Cultivate self-love and personal growth before seeking partnerships.",

  commitment: "Demonstrate commitment through consistent actions.",

  balance: "Balance personal space with togetherness in relationships.",

  appreciation: "Express appreciation and gratitude to your partner regularly.",
};

// ============================================
// Marriage Timing Blocks
// ============================================

export const MARRIAGE_TIMING_BLOCKS = {
  favorable:
    "Marriage prospects are favorable during this period. " +
    "Take steps toward finding or committing to a partner.",

  moderate:
    "Marriage is possible but requires careful consideration. " +
    "Ensure compatibility before major decisions.",

  patience_needed:
    "Marriage timing may require patience. Focus on personal " +
    "growth while remaining open to opportunities.",
};

// ============================================
// Personal Year Specific Blocks
// ============================================

export const LOVE_PERSONAL_YEAR_BLOCKS: Record<number, string> = {
  1: "New beginnings in love. If single, you may meet someone exciting. If coupled, inject freshness and independence into the relationship.",
  2: "Partnership is the theme. Deepening connections, sensitivity, and cooperation are highlighted. Avoid over-dependency.",
  3: "Fun, social, and expressive. Enjoy dating or lighthearted moments with your partner. Communication is key to romance now.",
  4: "Building security in relationships. Serious commitments may be discussed. Work together on shared goals and stability.",
  5: "Adventure and change. Relationships need freedom and variety. Stagnant partnerships may face challenges or sudden shifts.",
  6: "The year of love and marriage. Commitment, home life, and nurturing are favored. Resolving conflicts through love is supported.",
  7: "Introspection in love. You may need space to understand your needs. Spiritual connection is more important than superficial romance.",
  8: "Power dynamics in relationships. Ensure equality and mutual respect. Status or financial success may influence partner choice.",
  9: "Compassion and completion. Let go of past hurts. You may end a relationship that has run its course or elevate it to a higher level.",
};
