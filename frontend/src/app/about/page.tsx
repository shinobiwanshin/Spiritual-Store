import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Guiding Your Path With{" "}
            <span className="text-primary">Vedic Wisdom</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            AstraSpiritual combines ancient Vedic astrology with modern
            technology to provide you with accurate, personalized insights for a
            harmonious life.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-primary/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-9xl text-primary/20">
              temple_hindu
            </span>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold">Our Mission</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We believe that astrology is not just about prediction, but about
              understanding the cosmic energies that influence our lives. Our
              mission is to make authentic Vedic knowledge accessible to
              everyone, helping you navigate life's challenges with confidence
              and clarity.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">5000+</h3>
                <p className="text-sm text-muted-foreground">
                  Kundalis Generated
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">100+</h3>
                <p className="text-sm text-muted-foreground">
                  Expert Consultations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
