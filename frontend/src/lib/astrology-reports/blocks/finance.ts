/**
 * Finance Interpretation Blocks
 *
 * Reusable, deterministic text blocks for finance predictions.
 * Selected by rule engine based on planetary positions.
 */

// ============================================
// Dasha-Based Blocks
// ============================================

export const FINANCE_DASHA_BLOCKS = {
  saturn_active:
    "Financial growth is gradual but stable. Avoid quick schemes and " +
    "focus on long-term wealth accumulation strategies.",

  jupiter_active:
    "Financial abundance is supported through ethical means. " +
    "Investments in education and wisdom pay dividends.",

  mars_active:
    "Bold financial decisions may bring gains, but impulsive spending " +
    "should be carefully controlled.",

  venus_active:
    "Income through creative and luxury sectors is favored. " +
    "Aesthetic investments may appreciate well.",

  mercury_active:
    "Financial gains through trade, communication, and intellectual " +
    "property are highlighted.",

  rahu_active:
    "Unexpected financial gains are possible, but speculation " +
    "carries risks. Foreign income sources may emerge.",

  ketu_active:
    "Detachment from material concerns aids spiritual growth. " +
    "Minimize unnecessary expenses during this period.",

  sun_active:
    "Government-related income or recognition-based earnings " +
    "become more prominent.",

  moon_active:
    "Income fluctuations are possible. Real estate and nurturing " +
    "businesses may bring stability.",
};

// ============================================
// House-Based Blocks
// ============================================

export const FINANCE_HOUSE_BLOCKS = {
  jupiter_2nd:
    "Excellent placement for wealth accumulation. Family wealth " +
    "and savings grow naturally.",

  jupiter_11th:
    "Gains from multiple sources increase significantly. " +
    "Network and social connections bring financial benefits.",

  saturn_2nd:
    "Slow but steady wealth building. Conservative financial " +
    "strategies prove most effective.",

  saturn_11th:
    "Long-term investments and delayed gains characterize finances. " +
    "Patience with financial goals is essential.",

  venus_2nd:
    "Comfort and luxury within means are achievable. " +
    "Avoid excessive spending on aesthetics.",

  mars_2nd:
    "Active income through effort and initiative. " +
    "Control impulsive financial decisions.",

  mercury_2nd:
    "Income through intellectual work and communication. " +
    "Multiple income streams support stability.",

  rahu_2nd:
    "Unconventional income sources may appear. " +
    "Foreign currency or technology-based gains possible.",

  sun_2nd:
    "Government jobs or positions of authority bring stable income. " +
    "Family wealth may be connected to father's side.",

  moon_2nd:
    "Income fluctuates with emotional investments. " +
    "Real estate and hospitality sectors may be favorable.",
};

// ============================================
// General Finance Blocks
// ============================================

export const FINANCE_GENERAL_BLOCKS = {
  growth_year:
    "Financial opportunities expand this year. New income " +
    "sources may present themselves.",

  growth_year_alt:
    "Your financial landscape widens. Look for revenue " +
    "in new places such as side ventures or investments.",

  foundation_year:
    "Build financial reserves and reduce unnecessary debt. " +
    "Stability comes through disciplined saving.",

  foundation_year_alt:
    "Secure your assets and plan for the long term. " +
    "Avoid risky speculation and focus on guaranteed returns.",

  intensity_year:
    "Financial demands may increase alongside income. " +
    "Budget carefully to maintain balance.",

  intensity_year_alt:
    "Monetary flow may be volatile. Keep a tight rein on " +
    "expenditures and ensure cash flow is managed.",

  harvest_year:
    "Fruits of past financial discipline become evident. " +
    "Good time for measured investments.",

  harvest_year_alt:
    "Financial abundance flows from previous wise choices. " +
    "Reinvest profits to ensure continued prosperity.",

  transition_year:
    "Financial restructuring may be beneficial. " +
    "Adapt spending patterns to changing circumstances.",

  transition_year_alt:
    "Economic shifts require adaptability. Review your " +
    "budget and align it with your current reality.",
};

// ============================================
// Advice Blocks
// ============================================

export const FINANCE_ADVICE_BLOCKS = {
  save_more: "Consider increasing savings allocation by 5-10% this period.",

  invest_wisely: "Research investments thoroughly before committing funds.",

  avoid_speculation:
    "Avoid high-risk financial speculation during this period.",

  diversify: "Diversify income sources and investments for stability.",

  clear_debts: "Prioritize clearing outstanding debts if possible.",

  plan_ahead: "Create or review long-term financial plans.",

  emergency_fund: "Ensure emergency fund covers at least 6 months of expenses.",
};

// ============================================
// Personal Year Specific Blocks
// ============================================

export const FINANCE_PERSONAL_YEAR_BLOCKS: Record<number, string> = {
  1: "New income streams are likely. Be bold in financial negotiations and investments. Self-employment or side ventures launched now have excellent potential.",
  2: "Financial stability comes through partnerships. Avoid risky speculation. Joint finances or shared resources require careful management and transparency.",
  3: "Money flows in and out more freely. You may spend on travel or aesthetics. Creative projects can become profitable. Watch out for impulse buying.",
  4: "A year for saving and budgeting. Secure your assets and attend to details. Hard work pays off, but get-rich-quick schemes will fail.",
  5: "Financial ups and downs are possible. You may find money through foreign sources, travel, or quick turnover. Diversify your risks.",
  6: "Expenses related to home and family may increase. Real estate investments or improving your living situation are favored usages of funds.",
  7: "Income may stabilize but not expand rapidly. Use this time to research deep investments. Spiritual or intellectual pursuits may bring indirect gains.",
  8: "The peak financial year. Big returns are possible if you have been disciplined. Assert your value in business deals. Large transactions are favored.",
  9: "Clear old debts and finalize financial obligations. Donate to causes you believe in. Prepare your balance sheet for the new cycle ahead.",
};
