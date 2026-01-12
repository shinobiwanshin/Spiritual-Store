"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function LandingPage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-bold text-primary tracking-tight"
          >
            VEDIC STORE
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#services"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Services
            </a>
            <a
              href="#products"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Products
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Reviews
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/rashi">
              <Button variant="ghost" className="hidden sm:flex">
                Find Your Rashi
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="rounded-full px-6">Shop Now</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-50"></div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 size-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 size-80 bg-terracotta/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-8">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
            ✨ Authentic Vedic Products Since 2010
          </Badge>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight">
            Awaken Your
            <span className="block text-primary">Spiritual Journey</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover lab-certified gemstones, authentic Rudraksha, sacred
            Yantras, and divine idols. All blessed with ancient Vedic mantras
            for your spiritual growth.
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

      {/* Services Section */}
      <section id="services" className="py-24 bg-[#f9f6f0] dark:bg-[#1a1918]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="text-primary border-primary mb-4"
            >
              OUR SERVICES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              What We Offer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete spiritual solutions backed by Vedic wisdom and modern
              authenticity verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "diamond",
                title: "Certified Gemstones",
                desc: "Lab-tested precious stones aligned with your birth chart for maximum benefit",
              },
              {
                icon: "self_improvement",
                title: "Authentic Rudraksha",
                desc: "Original Nepal Rudraksha beads with X-ray certification for spiritual power",
              },
              {
                icon: "auto_awesome",
                title: "Rashi Analysis",
                desc: "Free personalized horoscope and gemstone recommendations by expert astrologers",
              },
              {
                icon: "temple_hindu",
                title: "Puja Services",
                desc: "Book online pujas performed by certified pandits at sacred temples",
              },
            ].map((service, i) => (
              <Card
                key={i}
                className="group bg-background border-primary/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="size-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <span className="material-symbols-outlined text-3xl">
                      {service.icon}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xl">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge
                variant="outline"
                className="text-primary border-primary mb-4"
              >
                BESTSELLERS
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">
                Featured Products
              </h2>
            </div>
            <Link href="/shop">
              <Button
                variant="outline"
                className="mt-4 md:mt-0 border-primary text-primary hover:bg-primary hover:text-white"
              >
                View All Products →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                category={product.category}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                reviews={product.reviews}
                image={product.images[0]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-[#f9f6f0] dark:bg-[#1a1918]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-primary border-primary">
                ABOUT US
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                Ancient Wisdom,
                <br />
                <span className="text-primary">Modern Trust</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2010, Vedic Store has been India&apos;s most trusted
                source for authentic spiritual products. We bridge the gap
                between ancient Vedic traditions and modern verification
                methods.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every gemstone is lab-certified, every Rudraksha is X-ray
                verified, and every product comes with a detailed authenticity
                certificate. Our team of expert astrologers provides
                personalized guidance to help you choose the right products for
                your spiritual journey.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <p className="text-4xl font-serif font-bold text-primary">
                    50K+
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Happy Customers
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-serif font-bold text-primary">
                    15+
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Years Experience
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-serif font-bold text-primary">
                    100%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Authentic Products
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5UuOpEVjMfcP6B3I3UN8rUY1Tg5opjyJsq3DaS9TPQTMJuFHy6l7lqjnwIvKs357uNdO93uubW5DRZf6YvpUrY4zTRNQGXi5WqsUwtomdOYitPEyVJANfyabWxAfHB0WtvqC0lGhmNH50BKDW2QV67bL3Y-srohMGyHb4OIds1S8zI-wkYjt78aQCnmLldBich8aUpTw2OLqdsZpn_tESOxWG30ml5oelVASXprFplenU4YOAg-5i4I1rsNOlP-O2fzrT2wObqEU"
                  alt="About Vedic Store"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="text-primary border-primary mb-4"
            >
              WHY CHOOSE US
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              The Vedic Store Difference
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "science",
                title: "Lab Certified",
                desc: "Every gemstone undergoes rigorous testing at certified gemological labs. We provide detailed certification with each purchase.",
              },
              {
                icon: "psychology",
                title: "Expert Astrologers",
                desc: "Our team of Vedic astrologers with 20+ years experience provides personalized consultations and recommendations.",
              },
              {
                icon: "refresh",
                title: "Easy Returns",
                desc: "Not satisfied? Return within 30 days for a full refund. No questions asked. Your satisfaction is our priority.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative p-8 rounded-3xl border border-primary/10 bg-gradient-to-b from-primary/5 to-transparent hover:border-primary/30 transition-all group"
              >
                <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 bg-[#f9f6f0] dark:bg-[#1a1918]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="text-primary border-primary mb-4"
            >
              TESTIMONIALS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                rating: 5,
                text: "The Blue Sapphire I purchased brought remarkable changes in my career within weeks. The certification gave me complete confidence in its authenticity.",
              },
              {
                name: "Rahul Verma",
                location: "Delhi",
                rating: 5,
                text: "Best Rudraksha collection I've found. The energization process they follow is truly authentic. Customer service is exceptional.",
              },
              {
                name: "Anita Patel",
                location: "Bangalore",
                rating: 5,
                text: "The Rashi analysis was incredibly accurate. The recommended Emerald has improved my concentration and business decisions significantly.",
              },
            ].map((review, i) => (
              <Card
                key={i}
                className="bg-background border-primary/10 hover:border-primary/30 transition-all"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <svg
                        key={j}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/80 leading-relaxed italic">
                    &quot;{review.text}&quot;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
            Begin Your Spiritual Transformation Today
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join over 50,000 satisfied customers who have transformed their
            lives with authentic Vedic products and personalized astrological
            guidance.
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

      {/* Footer */}
      <footer className="bg-[#1b1a18] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-primary">
              VEDIC STORE
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              India&apos;s most trusted destination for authentic Vedic
              products. Lab-certified gemstones, genuine Rudraksha, and sacred
              spiritual items since 2010.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <span className="material-symbols-outlined">share</span>
              </a>
              <a
                href="#"
                className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <span className="material-symbols-outlined">mail</span>
              </a>
              <a
                href="#"
                className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <span className="material-symbols-outlined">call</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
              Quick Links
            </h4>
            <ul className="text-gray-400 text-sm space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/rashi"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Rashi Finder
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Book Puja
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Astrology Consultation
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
              Support
            </h4>
            <ul className="text-gray-400 text-sm space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
              Trust & Safety
            </h4>
            <ul className="text-gray-400 text-sm space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Lab Certification
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Authenticity Check
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Vedic Store. All sacred items are ethically sourced and lab
            certified.
          </p>
          <div className="flex items-center gap-4">
            <img
              src="https://www.svgrepo.com/show/508748/visa.svg"
              alt="Visa"
              className="h-8 opacity-50"
            />
            <img
              src="https://www.svgrepo.com/show/508701/mastercard-full.svg"
              alt="Mastercard"
              className="h-8 opacity-50"
            />
            <img
              src="https://www.svgrepo.com/show/508425/upi.svg"
              alt="UPI"
              className="h-8 opacity-50"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
