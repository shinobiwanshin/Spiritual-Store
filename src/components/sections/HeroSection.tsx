import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-50"></div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 size-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 size-80 bg-terracotta/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-8">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-muted-foreground">
            Authentic Vedic Products Since 2025
          </span>
        </Badge>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight">
          Awaken Your
          <span className="block text-primary">Spiritual Journey</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover lab-certified gemstones, authentic Rudraksha, sacred Yantras,
          and divine idols. All blessed with ancient Vedic mantras for your
          spiritual growth.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/shop">
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
            >
              <span className="material-symbols-outlined mr-2">diamond</span>
              Explore Collection
            </Button>
          </Link>
          <Link href="/rashi">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-lg font-bold border-2 hover:bg-primary/5"
            >
              <span className="material-symbols-outlined mr-2">
                auto_awesome
              </span>
              Find Your Rashi
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              verified
            </span>
            <span className="text-sm font-medium">Lab Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              local_shipping
            </span>
            <span className="text-sm font-medium">Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              security
            </span>
            <span className="text-sm font-medium">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              support_agent
            </span>
            <span className="text-sm font-medium">Expert Guidance</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <span className="material-symbols-outlined text-3xl text-primary/50">
          expand_more
        </span>
      </div>
    </section>
  );
}
