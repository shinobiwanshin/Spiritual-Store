"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RashiPage() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-fixed">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md px-4 pt-4 pb-4 flex items-center border-b border-border">
        <Link href="/" className="p-2 -ml-2 text-primary">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-serif font-bold mr-8 text-foreground">
          Discover Your Rashi
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-8 pb-32">
        {/* Hero Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative size-32 rounded-full border-2 border-primary/30 flex items-center justify-center p-2">
              <div className="w-full h-full rounded-full border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-primary animate-pulse">
                  auto_awesome
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif font-bold text-primary mb-3">
            Celestial Alignment
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed px-4">
            Knowing your Rashi helps find the right remedies and gemstones to
            balance your life&apos;s energies.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">
              Full Name
            </Label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl">
                person
              </span>
              <Input
                className="pl-12 h-14 bg-card border-border shadow-sm text-base"
                placeholder="Enter your name"
                type="text"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">
              Date of Birth
            </Label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl">
                calendar_today
              </span>
              <Input
                className="pl-12 h-14 bg-card border-border shadow-sm text-base"
                type="date"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">
              Time of Birth
            </Label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl">
                schedule
              </span>
              <Input
                className="pl-12 h-14 bg-card border-border shadow-sm text-base"
                type="time"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">
              Place of Birth
            </Label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl">
                location_on
              </span>
              <Input
                className="pl-12 h-14 bg-card border-border shadow-sm text-base"
                placeholder="City, State, Country"
                type="text"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-primary/30 text-lg">
                  my_location
                </span>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8 flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl text-primary">
          <span className="material-symbols-outlined">info</span>
          <p className="text-[11px] font-medium italic">
            All calculations are based on Vedic Astrology principles for 100%
            accuracy.
          </p>
        </div>
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <Link href="/rashi/report">
          <Button
            className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl gap-3"
            size="lg"
          >
            <span className="material-symbols-outlined">cyclone</span>
            Generate Report
          </Button>
        </Link>
      </div>
    </div>
  );
}
