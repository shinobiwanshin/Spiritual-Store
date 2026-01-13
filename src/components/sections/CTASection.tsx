import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
          Begin Your Spiritual Transformation Today
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Join over 50,000 satisfied customers who have transformed their lives
          with authentic Vedic products and personalized astrological guidance.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/shop">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full px-8 h-14 text-lg font-bold"
            >
              Start Shopping
            </Button>
          </Link>
          <Link href="/rashi">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-lg font-bold border-2 border-white text-white hover:bg-white hover:text-primary"
            >
              Get Free Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
