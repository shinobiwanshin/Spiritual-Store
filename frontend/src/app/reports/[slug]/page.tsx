"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "sonner";

// Static Data for reports
const reportsData: Record<
  string,
  {
    title: string;
    description: string;
    price: string;
    features: string[];
    icon: string;
    color: string;
    howItWorks: { title: string; desc: string; icon: string }[];
  }
> = {
  "1-year-prediction": {
    title: "1 Year Prediction Report",
    description:
      "Navigate the upcoming year with confidence. Our 1-Year Prediction Report provides a detailed month-by-month analysis of your life, focusing on key areas such as Career, Finance, Health, and Relationships.",
    price: "999",
    icon: "calendar_today",
    color: "from-blue-500 to-cyan-500",
    features: [
      "Month-by-month detailed predictions",
      "Analysis of key planetary transits",
      "Career & Finance outlook",
      "Relationship & Health guidance",
      "Personalized remedies & mantras",
      "Interactive digital format",
    ],
    howItWorks: [
      {
        title: "Provide Birth Details",
        desc: "Enter your date, time, and place of birth.",
        icon: "person",
      },
      {
        title: "Chart Analysis",
        desc: "Our experts analyze your unique birth chart.",
        icon: "query_stats",
      },
      {
        title: "Report Generation",
        desc: "Receive your personalized report instantly.",
        icon: "description",
      },
    ],
  },
  "3-year-prediction": {
    title: "3 Year Prediction Report",
    description:
      "Plan your medium-term future with our comprehensive 3-Year Prediction Report. Understand the major shifts in your life path, upcoming testing periods (Dashas), and golden opportunities waiting for you.",
    price: "2499",
    icon: "date_range",
    color: "from-purple-500 to-indigo-500",
    features: [
      "3-year comprehensive roadmap",
      "Major Dasha & Bhukti analysis",
      "Saturn (Sade Sati) movement effects",
      "Maximize lucky periods",
      "Mitigate challenging times",
      "Detailed career progression plan",
    ],
    howItWorks: [
      {
        title: "Select Package",
        desc: "Choose the 3-year insight package.",
        icon: "shopping_bag",
      },
      {
        title: "Expert Review",
        desc: "Senior astrologers review your transits.",
        icon: "visibility",
      },
      {
        title: "Strategic Plan",
        desc: "Get a strategic life plan for 3 years.",
        icon: "timeline",
      },
    ],
  },
  "5-year-prediction": {
    title: "5 Year Prediction Report",
    description:
      "The ultimate guide to your long-term destiny. Our 5-Year Prediction Report offers a profound look into your future, helping you make life-altering decisions about marriage, property, business, and settlement.",
    price: "3999",
    icon: "history",
    color: "from-orange-500 to-red-500",
    features: [
      "Deep-dive 5-year forecast",
      "Life-changing event predictions",
      "Marriage & Childbirth timing",
      "Property & Wealth accumulation",
      "Foreign travel & settlement chances",
      "Spiritual growth path",
    ],
    howItWorks: [
      {
        title: "Complete Profile",
        desc: "Share detailed birth info.",
        icon: "badge",
      },
      {
        title: "In-depth Study",
        desc: "Multiple astrologers analyze your chart.",
        icon: "group",
      },
      {
        title: "Life Mastery",
        desc: "Master your destiny for half a decade.",
        icon: "psychology",
      },
    ],
  },
};

export default function ReportDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const addItem = useCartStore((state) => state.addItem);

  const report = reportsData[slug];

  if (!report) {
    return notFound();
  }

  const handleAddToCart = () => {
    if (!isSignedIn) {
      sessionStorage.setItem(
        "pendingCartItem",
        JSON.stringify({
          id: slug,
          title: report.title,
          price: report.price,
          image: "",
          productType: "service",
        }),
      );
      openSignIn({ redirectUrl: `/reports/${slug}` });
      return;
    }

    addItem({
      price: report.price,
      image: "",
      productType: "service",
    });
    toast.success(`${report.title} added to cart!`);
  };

  // Check for pending cart item on mount
  // Check for pending cart item on mount
  useState(() => {
    // Replaced with useEffect below
  });

  useEffect(() => {
    if (isSignedIn) {
      const pendingItem = sessionStorage.getItem("pendingCartItem");
      if (pendingItem) {
        try {
          const item = JSON.parse(pendingItem);
          if (item.id === slug) {
            addItem({
              id: item.id,
              title: item.title,
              price: item.price,
              image: item.image,
              productType: "service",
            });
            toast.success(`${item.title} added to cart!`);
            sessionStorage.removeItem("pendingCartItem");
          }
        } catch (e) {
          console.error("Failed to parse pending item", e);
        }
      }
    }
  }, [isSignedIn, slug, addItem]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br from-background via-background ${report.color.split(" ")[1]}/10`}
        ></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Detailed Forecast
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                {report.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {report.description}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <span className="text-4xl font-bold text-primary">
                  ₹{parseInt(report.price).toLocaleString()}
                </span>
                <Button
                  size="lg"
                  className={`rounded-full px-8 h-14 text-lg bg-gradient-to-r ${report.color}`}
                  onClick={handleAddToCart}
                >
                  <span className="material-symbols-outlined mr-2">
                    shopping_bag
                  </span>
                  Buy Report
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative flex justify-center lg:justify-end">
              <div
                className={`w-80 h-96 rounded-[3rem] bg-gradient-to-br ${report.color} p-1 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500`}
              >
                <div className="bg-background/90 backdrop-blur-sm w-full h-full rounded-[2.8rem] flex flex-col items-center justify-center p-8 text-center border border-white/10">
                  <span className="material-symbols-outlined text-8xl mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
                    {report.icon}
                  </span>
                  <h3 className="text-2xl font-serif font-bold mb-2">
                    Vedic Insights
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Personalized for your unique birth chart
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            What's Inside The Report
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {report.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-background p-6 rounded-2xl shadow-sm border border-border/50 flex items-start gap-4"
              >
                <span
                  className={`flex-shrink-0 size-10 rounded-full bg-gradient-to-br ${report.color} flex items-center justify-center text-white`}
                >
                  <span className="material-symbols-outlined text-xl">
                    check
                  </span>
                </span>
                <p className="font-medium text-lg pt-1.5">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10"></div>

            {report.howItWorks.map((step, idx) => (
              <div key={idx} className="text-center relative">
                <div
                  className={`size-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${report.color} flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform`}
                >
                  <span className="material-symbols-outlined text-white text-3xl">
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
