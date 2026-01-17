"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RashiPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/indian-pattern.png')] opacity-5"></div>

        {/* Decorative Elements */}
        <div className="absolute top-32 left-10 w-32 h-32 border border-primary/10 rounded-full"></div>
        <div className="absolute top-48 right-16 w-24 h-24 border border-primary/5 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-primary/10 rounded-full"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          {/* Om Symbol */}
          <div className="size-28 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 mb-8 border-4 border-white/20">
            <span className="text-5xl text-white font-serif">ॐ</span>
          </div>

          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
            वैदिक ज्योतिष • Vedic Jyotish
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold">
            Discover Your
            <span className="block text-primary">Janma Rashi</span>
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Based on ancient Vedic calculations using your exact birth time and
            Panchang. Get personalized remedies as per Shastras.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-6 bg-muted/50 dark:bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "auto_awesome", label: "Janma Nakshatra" },
              { icon: "diamond", label: "Ratna Suggestion" },
              { icon: "psychology", label: "Graha Dasha" },
              { icon: "self_improvement", label: "Vedic Remedies" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 p-4 bg-background rounded-2xl border border-primary/10"
              >
                <span className="material-symbols-outlined text-2xl text-primary">
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/10 shadow-2xl shadow-primary/5">
            <CardContent className="p-8 space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold mb-2">
                  जन्म कुंडली विवरण
                </h2>
                <p className="text-muted-foreground text-sm">
                  Enter your birth details for accurate Vedic calculations
                </p>
              </div>

              <form className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">
                    Full Name (पूरा नाम)
                  </Label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      person
                    </span>
                    <Input
                      className="pl-12 h-14 bg-background border-border/50 rounded-xl text-base"
                      placeholder="Enter your full name"
                      type="text"
                    />
                  </div>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-foreground">
                      Date of Birth (जन्म तिथि)
                    </Label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        calendar_today
                      </span>
                      <Input
                        className="pl-12 h-14 bg-background border-border/50 rounded-xl"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-foreground">
                      Time of Birth (जन्म समय)
                    </Label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        schedule
                      </span>
                      <Input
                        className="pl-12 h-14 bg-background border-border/50 rounded-xl"
                        type="time"
                      />
                    </div>
                  </div>
                </div>

                {/* Place of Birth */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">
                    Place of Birth (जन्म स्थान)
                  </Label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      location_on
                    </span>
                    <Input
                      className="pl-12 pr-12 h-14 bg-background border-border/50 rounded-xl"
                      placeholder="City, State, Country"
                      type="text"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        my_location
                      </span>
                    </button>
                  </div>
                </div>

                {/* Info Box */}
                <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <span className="material-symbols-outlined text-primary mt-0.5">
                    verified
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Authentic Vedic Calculations
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on Lahiri Ayanamsa and traditional Panchang. All
                      remedies as per Brihat Parashara Hora Shastra.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Link href="/rashi/report">
                  <Button
                    className="w-full h-16 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 gap-3"
                    size="lg"
                  >
                    <span className="material-symbols-outlined">
                      auto_awesome
                    </span>
                    Generate Kundali Report
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                verified
              </span>
              <span>100% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                lock
              </span>
              <span>Data Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                group
              </span>
              <span>50K+ Reports</span>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 px-6 bg-muted/50 dark:bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="text-primary border-primary mb-4"
            >
              WHAT YOU GET
            </Badge>
            <h2 className="text-3xl font-serif font-bold">
              Complete Vedic Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "auto_awesome",
                title: "Janma Rashi & Nakshatra",
                desc: "Your moon sign and birth star as per Vedic astrology",
              },
              {
                icon: "diamond",
                title: "Ratna (Gemstone)",
                desc: "Personalized gemstone recommendation with wearing method",
              },
              {
                icon: "self_improvement",
                title: "Rudraksha Suggestion",
                desc: "Ideal Rudraksha mukhi for your planetary positions",
              },
              {
                icon: "temple_hindu",
                title: "Ishta Devata",
                desc: "Your personal deity for worship and spiritual growth",
              },
              {
                icon: "calendar_month",
                title: "Shubh Muhurat",
                desc: "Auspicious days and times for important activities",
              },
              {
                icon: "healing",
                title: "Vedic Remedies",
                desc: "Mantras, pujas, and rituals to balance your doshas",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all group bg-background"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
