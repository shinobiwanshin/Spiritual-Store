"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const addItem = useCartStore((state) => state.addItem);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Fetch all services and find by slug
        const res = await fetch("/api/products?type=service&limit=20");
        if (res.ok) {
          const data = await res.json();
          const services = data.products || [];
          const found = services.find((s: Service) => s.slug === slug);
          setService(found || null);
          // Related services (exclude current)
          setRelatedServices(
            services.filter((s: Service) => s.slug !== slug).slice(0, 4),
          );
        }
      } catch (error) {
        console.error("Failed to fetch service", error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  const handleAddToCart = useCallback(() => {
    if (!service) return;

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
  }, [service, isSignedIn, openSignIn, addItem]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin">
            <span className="material-symbols-outlined text-4xl text-primary">
              progress_activity
            </span>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!service) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-40 text-center">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The service you're looking for doesn't exist.
          </p>
          <Link href="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-orange-500/5"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[150px]"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Visual Element - Shows second on mobile (reversed), first on desktop */}
            <div className="relative flex items-center justify-center mt-8 lg:mt-0">
              {/* Main Visual Container */}
              <div className="relative">
                {/* Outer Glow Ring */}
                <div
                  className={`absolute inset-0 rounded-[3rem] bg-gradient-to-br ${service.howToWear?.color || "from-primary to-orange-500"} blur-2xl opacity-30 scale-110`}
                ></div>

                {/* Main Card */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center">
                  {/* Inner Gradient Circle */}
                  <div
                    className={`size-32 md:size-48 rounded-full bg-gradient-to-br ${service.howToWear?.color || "from-primary to-orange-500"} flex items-center justify-center shadow-2xl relative overflow-hidden`}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0"></div>
                    <span className="material-symbols-outlined text-white text-6xl md:text-8xl relative z-10">
                      {service.howToWear?.icon || "auto_awesome"}
                    </span>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-3 -right-3 size-6 md:size-8 rounded-full bg-gradient-to-br from-primary to-orange-500 animate-bounce"></div>
                  <div className="absolute -bottom-2 -left-2 size-4 md:size-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 animate-pulse"></div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-max">
                  <Badge className="bg-card/90 backdrop-blur-md text-primary border-primary/30 px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium shadow-lg hover:bg-card/95 transition-colors">
                    <span className="material-symbols-outlined text-xs md:text-sm mr-1.5 md:mr-2">
                      verified
                    </span>
                    Vedic Consultation
                  </Badge>
                </div>
              </div>
            </div>

            {/* Content - Shows first on mobile */}
            <div className="space-y-8 text-center lg:text-left pt-6 lg:pt-0">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  {service.title}
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                  {service.description}
                </p>
              </div>

              {/* Price & CTA */}
              <div className="space-y-8">
                <div className="flex items-baseline justify-center lg:justify-start gap-3">
                  {parseFloat(service.price) === 0 ? (
                    <span className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-400">
                      FREE
                    </span>
                  ) : (
                    <>
                      <span className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-primary">
                        ₹{parseFloat(service.price).toLocaleString()}
                      </span>
                      <span className="text-lg text-muted-foreground">
                        one-time
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-4 max-w-md mx-auto lg:mx-0 lg:max-w-none lg:flex-row">
                  <Button
                    className="w-full h-14 md:h-16 px-8 text-lg font-semibold rounded-2xl gap-3 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                    onClick={handleAddToCart}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      add_shopping_cart
                    </span>
                    Book Now
                  </Button>
                  <button
                    onClick={() => {
                      document
                        .getElementById("premium-plans")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full h-14 md:h-16 px-8 text-lg rounded-2xl border-2 border-primary/30 bg-card/50 backdrop-blur-sm hover:bg-primary/10 flex items-center justify-center gap-3 font-medium transition-all duration-300 hover:border-primary/50"
                  >
                    <span className="material-symbols-outlined text-primary">
                      workspace_premium
                    </span>
                    Premium Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-8 md:mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Included Benefits
              </Badge>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold">
                What You&apos;ll Get
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
              {service.benefits?.map((benefit, idx) => (
                <div
                  key={idx}
                  className="group relative p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl">
                        check_circle
                      </span>
                    </div>
                    <span className="text-lg font-medium">{benefit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: "shopping_cart",
                title: "Book Service",
                desc: "Add to cart & checkout",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: "payments",
                title: "Make Payment",
                desc: "Secure Razorpay",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: "calendar_month",
                title: "Schedule Call",
                desc: "We'll contact you",
                color: "from-orange-500 to-yellow-500",
              },
              {
                icon: "call",
                title: "Consultation",
                desc: "Expert guidance",
                color: "from-primary to-orange-500",
              },
            ].map((step, idx) => (
              <div key={step.title} className="relative text-center group">
                {/* Connector Line */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent"></div>
                )}
                <div className="relative mb-4">
                  <div
                    className={`size-16 md:size-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <span className="material-symbols-outlined text-white text-2xl md:text-3xl">
                      {step.icon}
                    </span>
                  </div>
                  <span className="absolute -top-2 -right-2 md:-right-0 md:left-1/2 md:translate-x-6 size-7 bg-card border-2 border-primary text-primary text-sm rounded-full flex items-center justify-center font-bold shadow-md">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-bold text-sm md:text-base mb-1">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Plans Section - Hide for premium services themselves */}
      {slug !== "sampurna-kundali" && slug !== "monthly-kundali" && (
        <section id="premium-plans" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Premium Services
              </Badge>
              <h2 className="text-3xl font-serif font-bold">
                Upgrade Your Experience
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Sampurna Kundali Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-orange-500/10 to-primary/10 border border-primary/20 p-8 hover:shadow-2xl transition-all group">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-orange-500 text-white border-0">
                    Best Value
                  </Badge>
                </div>
                <div className="flex flex-col h-full">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg mb-6">
                    <span className="material-symbols-outlined text-white text-3xl">
                      call
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3">
                    Sampurna Kundali
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-1">
                    Complete personalized consultation with unlimited call time.
                    Free follow-up call included if you have any doubts!
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-primary text-lg">
                        check_circle
                      </span>
                      Unlimited call time
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-primary text-lg">
                        check_circle
                      </span>
                      Free follow-up call
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-primary text-lg">
                        check_circle
                      </span>
                      All life areas covered
                    </li>
                  </ul>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 mt-auto">
                    <div className="text-center sm:text-left">
                      <span className="text-3xl font-bold text-primary">
                        ₹2,999
                      </span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ₹4,999
                      </span>
                    </div>
                    <Link
                      href="/services/sampurna-kundali"
                      className="w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto rounded-full gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg hover:shadow-primary/25">
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Monthly Kundali Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-purple-500/10 border border-purple-500/20 p-8 hover:shadow-2xl transition-all group">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-purple-500 text-white border-0">
                    Subscription
                  </Badge>
                </div>
                <div className="flex flex-col h-full">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg mb-6">
                    <span className="material-symbols-outlined text-white text-3xl">
                      calendar_month
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3">
                    Monthly Kundali
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-1">
                    Monthly Kundali chart based on Telugu calendar with 3 free
                    consultation calls per year included!
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-purple-500 text-lg">
                        check_circle
                      </span>
                      Monthly chart delivery
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-purple-500 text-lg">
                        check_circle
                      </span>
                      3 free calls/year
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-purple-500 text-lg">
                        check_circle
                      </span>
                      Email delivery
                    </li>
                  </ul>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 mt-auto">
                    <div className="text-center sm:text-left">
                      <span className="text-3xl font-bold text-purple-500">
                        ₹6,999
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        /year
                      </span>
                    </div>
                    <Link
                      href="/services/monthly-kundali"
                      className="w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto rounded-full gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 shadow-lg hover:shadow-purple-500/25">
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-8 text-center">
              Other Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedServices.map((s) => (
                <Link key={s.id} href={`/services/${s.slug}`}>
                  <Card className="h-full border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all group cursor-pointer">
                    <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                      <div
                        className={`size-12 md:size-14 rounded-xl bg-gradient-to-br ${s.howToWear?.color || "from-primary to-orange-500"} flex items-center justify-center shadow-lg mb-3 md:mb-4 group-hover:scale-110 transition-transform shrink-0`}
                      >
                        <span className="material-symbols-outlined text-white text-xl md:text-2xl">
                          {s.howToWear?.icon || "auto_awesome"}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm md:text-base mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {s.title}
                      </h3>
                      <span className="text-primary font-bold text-sm md:text-base">
                        ₹{parseFloat(s.price).toLocaleString()}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
