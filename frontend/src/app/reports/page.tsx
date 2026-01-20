import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const reports = [
  {
    title: "1 Year Prediction Report",
    slug: "1-year-prediction",
    description:
      "Detailed month-by-month analysis for the upcoming year, covering career, health, finance, and relationships.",
    price: "₹999",
    icon: "calendar_today",
    color: "from-blue-500 to-cyan-500",
    link: "/reports/1-year-prediction",
    cta: "Get Report",
  },
  {
    title: "3 Year Prediction Report",
    slug: "3-year-prediction",
    description:
      "Comprehensive 3-year roadmap. Understand upcoming transits, dasha changes, and key life events.",
    price: "₹2,499",
    icon: "date_range",
    color: "from-purple-500 to-indigo-500",
    link: "/reports/3-year-prediction",
    cta: "Get Report",
  },
  {
    title: "5 Year Prediction Report",
    slug: "5-year-prediction",
    description:
      "Long-term Vedic foresight. Plan major life decisions with a clear view of the next 5 years.",
    price: "₹3,999",
    icon: "history",
    color: "from-orange-500 to-red-500",
    link: "/reports/5-year-prediction",
    cta: "Get Report",
  },
];

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            Astrological Reports
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Unlock Your <span className="text-primary">Destiny</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive Vedic reports to guide you through every phase of
            life.
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {reports.map((report) => (
            <div
              key={report.slug}
              className="group relative bg-card hover:bg-muted/50 border border-border rounded-3xl p-8 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`size-14 rounded-2xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-6 shadow-lg`}
              >
                <span className="material-symbols-outlined text-white text-3xl">
                  {report.icon}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">
                {report.title}
              </h3>
              <p className="text-muted-foreground mb-6 line-clamp-3">
                {report.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span
                  className={`font-bold text-lg ${report.price === "FREE" ? "text-green-500" : "text-foreground"}`}
                >
                  {report.price}
                </span>
                <Link href={report.link}>
                  <Button
                    variant="outline"
                    className="rounded-full gap-2 group-hover:bg-primary group-hover:text-white transition-all"
                  >
                    {report.cta}
                    <span className="material-symbols-outlined text-lg">
                      arrow_forward
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
