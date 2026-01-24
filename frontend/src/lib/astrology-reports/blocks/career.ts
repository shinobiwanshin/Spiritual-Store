/**
 * Career Interpretation Blocks
 *
 * Reusable, deterministic text blocks for career predictions.
 * Selected by rule engine based on planetary positions.
 */

// ============================================
// Dasha-Based Blocks
// ============================================

export const CAREER_DASHA_BLOCKS = {
  saturn_active:
    "Career progress will require patience and sustained effort. This period rewards " +
    "those who work diligently without expecting immediate recognition.",

  jupiter_active:
    "Professional growth is supported by wisdom and mentorship. Seek guidance from " +
    "experienced colleagues and remain open to learning opportunities.",

  mars_active:
    "Energy and initiative drive your career forward. Take bold action, but channel " +
    "your drive constructively to avoid conflicts with superiors.",

  venus_active:
    "Harmonious workplace relationships become key to success. Creative fields and " +
    "collaborative projects are particularly favored.",

  mercury_active:
    "Communication and analytical skills take center stage. This is an excellent " +
    "period for negotiations, presentations, and intellectual work.",

  rahu_active:
    "Unconventional career paths may open up. Be cautious of shortcuts while " +
    "remaining open to innovative opportunities.",

  ketu_active:
    "A period of introspection regarding career direction. Past work experiences " +
    "offer valuable insights for future decisions.",

  sun_active:
    "Leadership qualities are highlighted. Recognition from authority figures " +
    "becomes more likely when you demonstrate confidence.",

  moon_active:
    "Emotional intelligence plays a larger role in professional success. " +
    "Nurturing relationships with colleagues creates opportunities.",
};

// ============================================
// House-Based Blocks (Planet in specific house)
// ============================================

export const CAREER_HOUSE_BLOCKS = {
  saturn_1st:
    "Self-discipline becomes your greatest professional asset. How you present " +
    "yourself affects career outcomes significantly.",

  saturn_10th:
    "Professional responsibilities increase significantly. Hard work in your " +
    "core role will be noticed and eventually rewarded.",

  saturn_6th:
    "Attention to daily work routines is essential. Health and work life require " +
    "careful balance during this period.",

  jupiter_10th:
    "Excellent prospects for career advancement. Your reputation grows naturally " +
    "through ethical conduct and generosity.",

  jupiter_9th:
    "Higher education or foreign opportunities may benefit your career. " +
    "Expand your horizons through learning.",

  jupiter_2nd:
    "Income potential increases through your professional efforts. " +
    "Invest in skills that increase your value.",

  mars_10th:
    "Competitive drive fuels professional ambitions. Channel this energy " +
    "into achieving concrete goals.",

  mars_6th:
    "Competitive work environment requires strategic navigation. " +
    "Physical stamina supports your daily productivity.",

  venus_10th:
    "Public image benefits from grace and diplomacy. Creative professions " +
    "see particularly strong results.",

  sun_10th:
    "Authority and leadership are natural paths. Recognition from " +
    "government or large organizations is possible.",

  mercury_10th:
    "Communication-based careers thrive. Your analytical abilities " +
    "are recognized and valued.",

  rahu_10th:
    "Ambitious career goals are within reach through unconventional means. " +
    "Technology and foreign connections may play a role.",
};

// ============================================
// Sign-Based Blocks (Planet in specific sign)
// ============================================

export const CAREER_SIGN_BLOCKS = {
  saturn_capricorn:
    "Structured, traditional career paths are favored. Management and " +
    "administrative roles suit you well.",

  saturn_aquarius:
    "Innovation within established systems creates opportunities. " +
    "Technology and humanitarian fields benefit.",

  jupiter_sagittarius:
    "Teaching, publishing, and international work expand naturally. " +
    "Your philosophical approach inspires others.",

  jupiter_pisces:
    "Intuition guides career decisions wisely. Creative and healing " +
    "professions align with your nature.",

  mars_aries:
    "Entrepreneurial ventures and leadership roles suit you. " +
    "Your pioneering spirit drives professional success.",

  mars_scorpio:
    "Research, investigation, and transformational work thrive. " +
    "Your intensity creates breakthroughs.",
};

// ============================================
// General Career Blocks
// ============================================

export const CAREER_GENERAL_BLOCKS = {
  growth_year:
    "New career opportunities emerge this year. Stay alert for " +
    "chances to expand your professional horizons.",

  growth_year_alt:
    "Expansion is the keyword for your professional life this year. " +
    "Be ready to take on larger roles or new projects.",

  foundation_year:
    "Focus on building solid professional skills and relationships. " +
    "The groundwork you lay now supports future advancement.",

  foundation_year_alt:
    "Stability is your priority now. Establish reliable workflows " +
    "and strengthen your professional base.",

  intensity_year:
    "High demands at work require your full commitment. " +
    "Results achieved now have lasting impact on your trajectory.",

  intensity_year_alt:
    "A demanding period lies ahead. Focus on efficiency and " +
    "delivering results under pressure.",

  harvest_year:
    "Recognition for past efforts arrives naturally. " +
    "This is an excellent time to consolidate gains.",

  harvest_year_alt:
    "The fruits of your labor become visible. Receive accolades " +
    "with grace and strategize your next move.",

  transition_year:
    "Career changes or shifts in direction are likely. " +
    "Remain adaptable as new paths present themselves.",

  transition_year_alt:
    "Shifting tides in your career require flexibility. " +
    "Embrace the changes as necessary steps forward.",
};

// ============================================
// Personal Year Specific Blocks
// ============================================

export const CAREER_PERSONAL_YEAR_BLOCKS: Record<number, string> = {
  1: "A year of action and initiative. Perfect for launching new ventures, seeking promotions, or starting a completely new career path. Taking the lead brings success.",
  2: "Career progress relies on collaboration and patience. Focus on networking, supporting others, and working within teams rather than solo glory. Details matter.",
  3: "Creativity and communication are highlighted. Express your ideas boldly. Marketing, writing, and artistic pursuits are particularly favored this year.",
  4: "Hard work and discipline are required. This is a building year—focus on foundations, systems, and organization. Do not cut corners.",
  5: "Change is in the air. Expect unexpected opportunities or shifts in direction. Travel or new technologies may play a significant role.",
  6: "Responsibilities increase. Service to others and harmonious workplace relationships lead to advancement. A good time for team leadership.",
  7: "A period for analysis and skill development. Research, study, and specialization are favored over aggressive expansion. Listen to your intuition.",
  8: "The year of power and achievement. Commercial success, management roles, and financial gains are within reach if you assert yourself.",
  9: "Completion of cycles. Finish existing projects and prepare for the next phase. Clear out what no longer serves your professional growth.",
};
