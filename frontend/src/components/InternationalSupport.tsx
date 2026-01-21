import React from "react";
import { Button } from "@/components/ui/button";

export default function InternationalSupport() {
  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border border-indigo-500/30 rounded-3xl p-8 my-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3"></div>

      <div className="relative z-10 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center text-center md:text-left">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="size-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/40">
            <span className="material-symbols-outlined text-indigo-300 text-4xl">
              public
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-serif font-bold text-white">
            International Customers?
          </h3>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xl">
            For payments in USD, GBP, EUR, or other currencies, please reach out
            directly. We accept International Cards, PayPal, and Stripe
            payments.
          </p>
        </div>

        {/* Action */}
        <div>
          <Button
            asChild
            variant="outline"
            className="border-indigo-500/50 text-indigo-100 hover:bg-indigo-900/50 hover:text-white"
          >
            <a href="mailto:support@astraspiritual.com">
              <span className="material-symbols-outlined mr-2 text-lg">
                mail
              </span>
              Contact Support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
