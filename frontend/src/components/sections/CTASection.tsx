import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"></div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Decorative badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="material-symbols-outlined text-primary text-sm">
            auto_awesome
          </span>
          <span className="text-sm text-white/90 font-medium">
            Transform Your Life Today
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-white">
          Begin Your{" "}
          <span className="bg-gradient-to-r from-primary via-orange-400 to-amber-400 bg-clip-text text-transparent">
            Spiritual Journey
          </span>
        </h2>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          Join over 50,000 satisfied customers who have transformed their lives
          with authentic Vedic products and personalized astrological guidance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/shop">
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-lg font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              <span className="material-symbols-outlined mr-2">
                shopping_bag
              </span>
              Start Shopping
            </Button>
          </Link>
          <Link href="/rashi">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all hover:scale-105"
            >
              <span className="material-symbols-outlined mr-2">
                auto_awesome
              </span>
              Free Kundali
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-white/50 text-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">
              verified
            </span>
            <span>Lab Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">
              local_shipping
            </span>
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">
              support_agent
            </span>
            <span>Expert Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
