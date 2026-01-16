"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { products } from "@/data/products";

export default function RashiReport() {
  // Mock data - would come from calculation
  const rashiData = {
    sign: "Aries",
    signHindi: "Mesha",
    symbol: "♈",
    element: "Fire",
    ruler: "Mars",
    nakshatra: "Ashwini",
    luckyColor: "Red",
    luckyNumber: "9",
    luckyDay: "Tuesday",
  };

  const recommendedProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Result Section */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Your Rashi Report
          </Badge>

          <div className="size-32 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 mb-6 border-4 border-white/20">
            <span className="text-6xl text-white">{rashiData.symbol}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
            {rashiData.sign}{" "}
            <span className="text-primary">({rashiData.signHindi})</span>
          </h1>
          <p className="text-lg text-muted-foreground">Your Moon Sign</p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              {
                label: "Element",
                value: rashiData.element,
                icon: "local_fire_department",
              },
              { label: "Ruler", value: rashiData.ruler, icon: "public" },
              { label: "Nakshatra", value: rashiData.nakshatra, icon: "star" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 rounded-full border border-border/50"
              >
                <span className="material-symbols-outlined text-primary text-sm">
                  {stat.icon}
                </span>
                <span className="text-sm">
                  <span className="text-muted-foreground">{stat.label}:</span>{" "}
                  <span className="font-bold">{stat.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lucky Items Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif font-bold mb-6 text-center">
            Your Lucky Elements
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Lucky Day", value: rashiData.luckyDay, icon: "event" },
              {
                label: "Lucky Color",
                value: rashiData.luckyColor,
                icon: "palette",
              },
              {
                label: "Lucky Number",
                value: rashiData.luckyNumber,
                icon: "tag",
              },
            ].map((item) => (
              <Card key={item.label} className="border-primary/10 text-center">
                <CardContent className="p-6 space-y-2">
                  <div className="size-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="font-serif font-bold text-lg">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Recommendations Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-serif font-bold text-center mb-8">
            Recommended for You
          </h2>

          {/* Gemstone Card */}
          <Card className="border-primary/20 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-red-500">
                  diamond
                </span>
              </div>
              <CardContent className="flex-1 p-6">
                <Badge className="mb-2">Lucky Gemstone</Badge>
                <h3 className="font-serif font-bold text-xl mb-2">
                  Red Coral (Moonga)
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Red Coral allows Mars to be favorable to you. It enhances
                  vitality, courage, and ambition. Wear it on Tuesday in a gold
                  or copper ring on your ring finger.
                </p>
                <Link href="/shop">
                  <Button className="shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined mr-2">
                      shopping_bag
                    </span>
                    Shop Red Coral
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>

          {/* Rudraksha Card */}
          <Card className="border-primary/20 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-amber-600">
                  self_improvement
                </span>
              </div>
              <CardContent className="flex-1 p-6">
                <Badge className="mb-2">Lucky Rudraksha</Badge>
                <h3 className="font-serif font-bold text-xl mb-2">
                  3 Mukhi Rudraksha
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  The 3 Mukhi Rudraksha is best suited for Aries natives. It
                  helps burn past karma, releases stress, and provides constant
                  energy and motivation.
                </p>
                <Link href="/shop">
                  <Button className="shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined mr-2">
                      shopping_bag
                    </span>
                    Shop 3 Mukhi Rudraksha
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>

          {/* Mantra Card */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <span className="material-symbols-outlined text-4xl text-primary">
                format_quote
              </span>
              <h3 className="font-serif font-bold text-lg">Your Mantra</h3>
              <p className="font-serif text-2xl italic text-primary">
                &quot;Om Kram Kreem Kraum Sah Bhaumaya Namah&quot;
              </p>
              <p className="text-sm text-muted-foreground">
                Chant this mantra 108 times on Tuesday for best results
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-12 px-6 bg-[#f9f6f0] dark:bg-[#1a1918]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <span className="material-symbols-outlined mr-2">download</span>
              Download Report
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <span className="material-symbols-outlined mr-2">share</span>
              Share Report
            </Button>
            <Link href="/shop">
              <Button size="lg" className="shadow-xl shadow-primary/20">
                <span className="material-symbols-outlined mr-2">
                  shopping_bag
                </span>
                Shop Recommended Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
