/**
 * Health Interpretation Blocks
 *
 * Reusable, deterministic text blocks for health predictions.
 * Selected by rule engine based on planetary positions.
 */

// ============================================
// Dasha-Based Blocks
// ============================================

export const HEALTH_DASHA_BLOCKS = {
  saturn_active:
    "Pay attention to bone health, joints, and chronic conditions. " +
    "Regular health checkups are advisable.",

  jupiter_active:
    "Overall health benefits from optimism. Watch for issues " +
    "related to liver and weight management.",

  mars_active:
    "High energy but prone to accidents and inflammation. " +
    "Channel physical energy through exercise.",

  venus_active:
    "Hormonal balance and reproductive health need attention. " +
    "Enjoy pleasure in moderation.",

  mercury_active:
    "Nervous system and skin health are highlighted. " +
    "Mental wellness through balanced communication.",

  rahu_active:
    "Unusual health patterns may emerge. Stay vigilant about " +
    "diagnosis and avoid self-medication.",

  ketu_active:
    "Spiritual practices support physical wellbeing. " +
    "Address any nagging health issues from the past.",

  sun_active:
    "Vitality is generally strong. Heart health and eyesight " +
    "deserve regular monitoring.",

  moon_active:
    "Emotional health directly impacts physical wellbeing. " +
    "Digestive and fluid balance need attention.",
};

// ============================================
// House-Based Blocks
// ============================================

export const HEALTH_HOUSE_BLOCKS = {
  saturn_6th:
    "Chronic health issues require ongoing management. " +
    "Discipline in diet and routine is essential.",

  mars_6th:
    "Good for overcoming health challenges through effort. " +
    "Avoid injuries through careful activity.",

  jupiter_6th:
    "Natural healing ability is enhanced. Recovery from " +
    "illness tends to be smoother.",

  sun_1st:
    "Strong vitality and constitution. Self-care practices " +
    "yield excellent results.",

  moon_1st:
    "Emotional sensitivity affects physical health. " +
    "Nurturing self-care is important.",

  rahu_6th:
    "Unusual health conditions may require specialist attention. " +
    "Alternative treatments might help.",
};

// ============================================
// General Health Blocks
// ============================================

export const HEALTH_GENERAL_BLOCKS = {
  growth_year:
    "Health energy is on an upswing. Good time to establish " +
    "new healthy habits and routines.",

  growth_year_alt:
    "Your vitality increases this year. Use this energy to " +
    "tackle fitness goals you previously postponed.",

  foundation_year:
    "Focus on building sustainable health practices. " +
    "Prevention is better than cure.",

  foundation_year_alt:
    "Stabilize your physical wellbeing through routine. " +
    "Consistency in diet and sleep is key now.",

  intensity_year:
    "Work-related stress may affect health. Balance " +
    "productivity with adequate rest.",

  intensity_year_alt:
    "High activity levels demand better recovery. " +
    "Prioritize downtime to avoid burnout.",

  harvest_year:
    "Past health investments show results. Maintain " +
    "good practices that have worked.",

  harvest_year_alt:
    "You enjoy the benefits of previous healthy choices. " +
    "Optimize your wellness regimen further.",

  transition_year:
    "Health patterns may shift. Adapt wellness routines " +
    "to changing needs and circumstances.",

  transition_year_alt:
    "Listen to your body's changing signals. adjusting " +
    "your lifestyle now prevents future issues.",
};

// ============================================
// Advice Blocks
// ============================================

export const HEALTH_ADVICE_BLOCKS = {
  regular_checkups: "Schedule preventive health checkups during this period.",

  exercise_routine: "Establish or maintain a consistent exercise routine.",

  stress_management:
    "Practice stress management techniques like meditation or yoga.",

  dietary_balance: "Focus on balanced nutrition and adequate hydration.",

  adequate_sleep: "Prioritize quality sleep for overall wellbeing.",

  mental_wellness: "Pay attention to mental health and seek support if needed.",
};

// ============================================
// Personal Year Specific Blocks
// ============================================

export const HEALTH_PERSONAL_YEAR_BLOCKS: Record<number, string> = {
  1: "Start new fitness routines or diet plans. Your vitality is high, but watch for burnout from overexertion. Focus on cardiovascular health.",
  2: "Emotional health directly impacts physical well-being. Stay hydrated and address any digestive issues. Gentle activities like swimming or walking are best.",
  3: "Social activities may lead to overindulgence. Monitor your diet and weight. Use creative outlets to relieve stress and maintain mental balance.",
  4: "Focus on structure and routine. Regular checkups, dental care, and skeletal health are highlighted. Discipline in habits brings long-term results.",
  5: "Nervous energy may be high. Prioritize sleep and relaxation techniques. Variety in exercise keeps you motivated. Watch out for accidents due to haste.",
  6: "Health issues may relate to family stress. Take care of your heart and circulation. Nurturing others shouldn't come at the expense of your own health.",
  7: "A need for rest and introspection. Meditation and spiritual practices aid physical healing. Avoid toxic environments and substances.",
  8: "High physical demands require robust energy management. Strength training is beneficial. Watch for stress-related tension in digestion or head.",
  9: "Release old unhealthy habits. detoxification and cleansing are favored. Prepare your body for a new cycle by letting go of what limits you.",
};
