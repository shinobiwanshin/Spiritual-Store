"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  benefits: string[];
  howToWear: { icon?: string; color?: string };
}

export default function ServicesPage() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const addItem = useCartStore((state) => state.addItem);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/products?type=service&limit=20");
        if (res.ok) {
          const data = await res.json();
          setServices(data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (!isAutoPlaying || services.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, services.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const handleAddToCart = useCallback(
    (service: Service) => {
      if (!isSignedIn) {
        openSignIn();
        return;
      }

      addItem({
        id: service.id,
        title: service.title,
        price: service.price,
        image: "",
      });

      toast.success(`${service.title} added to cart!`);
    },
    [isSignedIn, openSignIn, addItem],
  );

  const currentService = services[currentIndex];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            Vedic Solutions
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Solutions for Life&apos;s
            <span className="block text-primary">Every Challenge</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our expert astrologers provide personalized Vedic consultations with
            remedies, mantras, and gemstone recommendations.
          </p>
        </div>
      </section>

      {/* Full-Width Single Carousel */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin">
                <span className="material-symbols-outlined text-4xl text-primary">
                  progress_activity
                </span>
              </div>
            </div>
          ) : services.length > 0 && currentService ? (
            <div className="relative">
              {/* Main Carousel Item - Full Width */}
              <div
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card via-card to-muted/50 border border-primary/10 shadow-2xl"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                  {/* Left Content */}
                  <div className="space-y-6">
                    {/* Icon */}
                    <div
                      className={`size-20 rounded-2xl bg-gradient-to-br ${currentService.howToWear?.color || "from-primary to-orange-500"} flex items-center justify-center shadow-xl`}
                    >
                      <span className="material-symbols-outlined text-white text-4xl">
                        {currentService.howToWear?.icon || "auto_awesome"}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                        {currentService.title}
                      </h2>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {currentService.description}
                      </p>
                    </div>

                    {/* Price & CTA */}
                    <div className="space-y-4 pt-4">
                      <div>
                        {parseFloat(currentService.price) === 0 ? (
                          <span className="text-4xl md:text-5xl font-bold text-green-500">
                            FREE
                          </span>
                        ) : (
                          <span className="text-4xl md:text-5xl font-bold text-primary">
                            ₹{parseFloat(currentService.price).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          className="w-full sm:w-auto h-14 px-8 text-lg rounded-full gap-3 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 transition-all"
                          onClick={() => handleAddToCart(currentService)}
                        >
                          <span className="material-symbols-outlined text-2xl">
                            add_shopping_cart
                          </span>
                          Book Now
                        </Button>
                        <Link
                          href={`/services/${currentService.slug}`}
                          className="w-full sm:w-auto"
                        >
                          <Button
                            variant="outline"
                            className="w-full h-14 px-8 text-lg rounded-full gap-3 border-2"
                          >
                            Learn More
                            <span className="material-symbols-outlined">
                              arrow_forward
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Right - Features */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-6">
                      What You&apos;ll Get
                    </h3>
                    <ul className="space-y-4">
                      {currentService.benefits?.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">
                            check_circle
                          </span>
                          <span className="text-lg">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-14 bg-background/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg"
                  aria-label="Previous"
                >
                  <span className="material-symbols-outlined text-2xl">
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-14 bg-background/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg"
                  aria-label="Next"
                >
                  <span className="material-symbols-outlined text-2xl">
                    chevron_right
                  </span>
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {services.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsAutoPlaying(false);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-20">
              No services available
            </p>
          )}
        </div>
      </section>

      {/* Rashi Kundali - Featured Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/5 via-background to-orange-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 mb-4">
                FREE Service
              </Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Rashi Kundali
              </h2>
              <p className="text-muted-foreground mb-6">
                Get your complete Janma Kundali with detailed Rashi analysis,
                Nakshatra predictions, planetary positions, and personalized
                Vedic insights based on your exact birth time. Absolutely free!
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Complete birth chart (Rasi & Navamsa)",
                  "Nakshatra & Pada details",
                  "Planetary positions & degrees",
                  "Dasha predictions",
                  "Personalized insights",
                  "Download chart as PDF",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500 text-lg">
                      check_circle
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/rashi" className="block">
                <Button className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-full gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 active:scale-95 transition-all duration-200">
                  <span className="material-symbols-outlined text-2xl">
                    auto_awesome
                  </span>
                  Get Free Kundali
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-500/20 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-8xl text-green-500 mb-4">
                    auto_awesome
                  </span>
                  <p className="text-xl font-serif font-bold">Free Kundali</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Life Reading - Featured Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-8xl text-primary mb-4">
                    auto_awesome
                  </span>
                  <p className="text-xl font-serif font-bold">
                    Premium Service
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Save ₹3,000
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Premium Service
              </Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Sampurna Kundali
              </h2>
              <p className="text-muted-foreground mb-6">
                Get a complete personalized consultation with our expert Vedic
                astrologer. Enjoy unlimited call time to discuss all aspects of
                your life. If you have any doubts or missed points, we offer a
                free follow-up call with unlimited time!
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Live call with expert astrologer",
                  "No time limit on consultation",
                  "Complete birth chart analysis",
                  "All life areas covered",
                  "Personalized remedies & mantras",
                  "Free follow-up call if needed",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">
                      check_circle
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-full gap-3 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
                  onClick={() =>
                    handleAddToCart({
                      id: "sampurna-kundali",
                      title: "Sampurna Kundali",
                      slug: "sampurna-kundali",
                      description:
                        "Complete consultation with unlimited call time",
                      price: "2999",
                      benefits: [],
                      howToWear: {},
                    })
                  }
                >
                  <span className="material-symbols-outlined text-2xl">
                    add_shopping_cart
                  </span>
                  Book for ₹2,999
                </Button>
                <span className="text-sm text-muted-foreground line-through">
                  ₹4,999
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Kundali - Subscription Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-purple-500/5 via-background to-violet-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 mb-4">
                Subscription
              </Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Monthly Kundali
              </h2>
              <p className="text-muted-foreground mb-6">
                Stay aligned with the cosmos every month! Receive your
                personalized Kundali chart based on the Telugu calendar
                delivered monthly. Plus, get 3 free consultation calls per year
                with our expert astrologers.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Monthly Kundali chart (Telugu calendar)",
                  "Personalized monthly predictions",
                  "Auspicious dates & timings",
                  "3 free consultation calls/year",
                  "Email delivery",
                  "Cancel anytime",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-purple-500 text-lg">
                      check_circle
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-full gap-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
                  onClick={() =>
                    handleAddToCart({
                      id: "monthly-kundali",
                      title: "Monthly Kundali Subscription",
                      slug: "monthly-kundali",
                      description:
                        "Monthly Kundali chart based on Telugu calendar",
                      price: "6999",
                      benefits: [],
                      howToWear: {},
                    })
                  }
                >
                  <span className="material-symbols-outlined text-2xl">
                    calendar_month
                  </span>
                  Subscribe for ₹6,999/year
                </Button>
                <span className="text-sm text-muted-foreground">
                  3 free calls included
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-500/20 via-violet-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-8xl text-purple-500 mb-4">
                    calendar_month
                  </span>
                  <p className="text-xl font-serif font-bold">
                    Monthly Updates
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                ₹6,999/year
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: "shopping_cart",
                title: "Book Service",
                desc: "Select and add to cart",
              },
              {
                icon: "payments",
                title: "Make Payment",
                desc: "Secure Razorpay checkout",
              },
              {
                icon: "calendar_month",
                title: "Schedule Call",
                desc: "We'll contact you",
              },
              {
                icon: "call",
                title: "Get Consultation",
                desc: "Expert guidance & remedies",
              },
            ].map((step, idx) => (
              <div key={step.title} className="text-center">
                <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center relative">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {step.icon}
                  </span>
                  <span className="absolute -top-2 -right-2 size-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-bold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
