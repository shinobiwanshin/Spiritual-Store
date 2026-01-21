/**
 * Arcjet Security Configuration
 *
 * This file provides centralized security protection for sensitive API routes.
 * Arcjet is used ONLY on payment and admin routes to prevent:
 * - Automated attacks (SQL injection, XSS via Shield)
 * - Bot abuse and credential stuffing
 * - Rate limit abuse on payment endpoints
 *
 * Public routes (products, shop, services) are intentionally NOT protected
 * to ensure fast browsing experience and SEO crawler access.
 *
 * @see https://docs.arcjet.com/reference/nextjs
 */

import arcjet, {
  shield,
  detectBot,
  tokenBucket,
  fixedWindow,
} from "@arcjet/next";

// =============================================================================
// ENVIRONMENT CONFIGURATION
// =============================================================================

/**
 * Mode determines whether Arcjet blocks requests or just logs them.
 * - "DRY_RUN": Log only (for development/testing)
 * - "LIVE": Actually block malicious requests (for production)
 */
const ARCJET_MODE = process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN";

// =============================================================================
// ARCJET INSTANCES FOR DIFFERENT ROUTE TYPES
// =============================================================================

/**
 * Payment Routes Protection (checkout, verify-payment)
 *
 * STRICT protection because:
 * - Financial transactions are prime targets for fraud
 * - Rate limiting prevents card testing attacks
 * - Bot detection blocks automated payment fraud
 * - Shield protects against injection attacks in payment data
 */
export const paymentProtection = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"], // Track by IP address
  rules: [
    // Shield: Protects against common web attacks (SQLi, XSS, etc.)
    // Essential for any endpoint handling user input
    shield({ mode: ARCJET_MODE }),

    // Bot Detection: Blocks automated scripts trying to abuse payments
    // Allows search engines in case they somehow hit API routes
    detectBot({
      mode: ARCJET_MODE,
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing (should never hit API, but safe)
        "CATEGORY:MONITOR", // Uptime monitoring services
      ],
    }),

    // Rate Limiting: Token bucket - smooth, allows bursts but caps sustained abuse
    // 10 requests max, refills 2 tokens every 10 seconds
    // This allows legitimate users while blocking rapid-fire attacks
    tokenBucket({
      mode: ARCJET_MODE,
      refillRate: 2, // Refill 2 tokens every interval
      interval: 10, // Interval in seconds
      capacity: 10, // Maximum bucket size
    }),
  ],
});

/**
 * Webhook Protection (Razorpay webhooks)
 *
 * Different strategy:
 * - Higher rate limit (webhooks can come in bursts after sales)
 * - DRY_RUN for bots (Razorpay servers may be flagged as bots)
 * - Shield still active for attack protection
 *
 * IMPORTANT: Always verify x-razorpay-signature separately!
 */
export const webhookProtection = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    // Shield active but in DRY_RUN to log suspicious activity without blocking
    // Razorpay webhooks contain JSON that might trigger false positives
    shield({ mode: "DRY_RUN" }),

    // Fixed window rate limit: 100 requests per minute
    // Webhooks can be bursty so we allow more throughput
    fixedWindow({
      mode: ARCJET_MODE,
      window: "1m", // 1 minute window
      max: 100, // Max 100 webhook calls per minute
    }),
  ],
});

/**
 * Cart API Protection
 *
 * Moderate protection:
 * - Higher rate limit (users browse and add items frequently)
 * - Bot detection to prevent inventory scraping
 * - Shield for attack protection
 */
export const cartProtection = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: ARCJET_MODE }),

    detectBot({
      mode: ARCJET_MODE,
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR"],
    }),

    // Higher limit for cart operations (users browse frequently)
    tokenBucket({
      mode: ARCJET_MODE,
      refillRate: 5, // 5 tokens per interval
      interval: 10, // Every 10 seconds
      capacity: 30, // Burst of up to 30 requests
    }),
  ],
});

/**
 * Admin Routes Protection (future use)
 *
 * STRICTEST protection:
 * - Very low rate limit
 * - Aggressive bot blocking
 * - Shield always on
 */
export const adminProtection = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: ARCJET_MODE }),

    detectBot({
      mode: ARCJET_MODE,
      // Only allow monitoring bots, nothing else
      allow: ["CATEGORY:MONITOR"],
    }),

    // Very strict: 5 requests per minute
    fixedWindow({
      mode: ARCJET_MODE,
      window: "1m",
      max: 5,
    }),
  ],
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Razorpay IP ranges for webhook verification (as of 2024)
 * These IPs are documented in Razorpay's webhook documentation.
 * Always verify signature as primary check - IP allowlist is secondary.
 *
 * @see https://razorpay.com/docs/webhooks/validate-test/
 */
export const RAZORPAY_WEBHOOK_IPS = [
  // Razorpay production IP ranges
  "52.66.119.16",
  "52.66.119.17",
  "52.66.119.18",
  "52.66.119.19",
  "52.66.119.20",
  "52.66.119.21",
  "52.66.119.22",
  "52.66.119.23",
  // Add more as Razorpay publishes them
];

/**
 * Check if an IP is in the Razorpay allowlist
 * Use this as a secondary check after signature verification
 */
export function isRazorpayIP(ip: string): boolean {
  return RAZORPAY_WEBHOOK_IPS.includes(ip);
}
