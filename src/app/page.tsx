"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const bestSellers = [
    {
      id: "1",
      title: "Natural Colombian Emerald (Panna)",
      category: "Gemstones",
      price: "₹24,999",
      originalPrice: "₹32,000",
      discount: "22% OFF",
      reviews: 128,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6dq99HUk3_VUqfws_NnJwc9LOlMrFbK6COgnyc6cjQ94J0E3Lnv2LwZLlJejQ10_QID3YFs6yKPFmXtr7dWhDppjUMJqY3b1IctEYjH1fCiF0dRpdPo0bun1wF6JjOqi2rTbMWmT5LvyrtcKk25KgncRwoGtH00Vke58WmNYdocnKTxFYe6eNgMijkdwgcp5BoD1j-8VK3GFgMy777BUfI33flIkQPgzFtU388oO8vN3OZ4ygo203q_6bkdwLfgDgjM7vpuEy4h0",
    },
    {
      id: "2",
      title: "5 Mukhi Nepal Rudraksha",
      category: "Rudraksha",
      price: "₹1,850",
      originalPrice: "₹2,200",
      discount: "16% OFF",
      reviews: 456,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD5UuOpEVjMfcP6B3I3UN8rUY1Tg5opjyJsq3DaS9TPQTMJuFHy6l7lqjnwIvKs357uNdO93uubW5DRZf6YvpUrY4zTRNQGXi5WqsUwtomdOYitPEyVJANfyabWxAfHB0WtvqC0lGhmNH50BKDW2QV67bL3Y-srohMGyHb4OIds1S8zI-wkYjt78aQCnmLldBich8aUpTw2OLqdsZpn_tESOxWG30ml5oelVASXprFplenU4YOAg-5i4I1rsNOlP-O2fzrT2wObqEU",
    },
    {
      id: "3",
      title: "Shri Yantra - Copper (3 inch)",
      category: "Yantras",
      price: "₹551",
      reviews: 204,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrS30payT-shdn7gexjP_uFnMINnUCd3-5Si30KqJsu2eUe82JDQxITLV1EUXdxlvMVvcyYOZT9WMrYqtnuglGjOTSvHCVpxTuykYNLOfBsGGB52ZqjWzh2cmlK2LAFgVp0FnCzpigYGfHDxw4R-NK_NndExMGJ-enoq7gtRDiCRm8SDJ74N2GTMjDkIH9T3n_QziwFgF76SDEwpxf3TuImX6XqkBHAcD6q3ESuimNn0Bp0z7ePU-wHwxs11OvAlMHElV_JD8hJ4",
    },
    {
      id: "4",
      title: "Premium Brass Ganesha Idol",
      category: "Idols",
      price: "₹3,499",
      originalPrice: "₹4,500",
      discount: "22% OFF",
      reviews: 89,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA8P9cUYQCdQOhZUc6PVHN2xwu43I8RlHFc6HkAl397Iiny5RXYMDRz3elkgJSfoYaKNa8_cquoIKLeHFZr8kka0_PQerAB2eEXHjvxdqMY0sSFKedKunaoR60oPddN2r02O33rJFR-R2hsFAxqQPIGyJ4zA_93Y_u1fqalx2XxIbykd5Oe6kI-zmGwqpGrhIaxapqsIyPelQBKcTP5O1Z9V4hEfahQzUh1hFsGp__flLC1Pmjh5G2nOAf4siDlsm9fqK6gwfHyd6Y",
    },
    {
      id: "7",
      title: "Blue Sapphire (Neelam) - 3 Carat",
      category: "Gemstones",
      price: "₹45,000",
      originalPrice: "₹55,000",
      discount: "18% OFF",
      reviews: 67,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAq91xz-778sDK3j6UBQh57k9GuJ_7cxyKB3XsxmzxDgwDJxNv05vT_zvDni7VzQ_DUYJJLrbkdO7Ts3X6KthgX15cMBT5cISv5oOKjLa84O4_RfLBYkxnSsSQp8xDMPD-imQsG3eWzt08JzuBwNwvzH2V77hV1Yy77LhD7kvGPEPw_8n8L4rvoI2JmFHTL3LuSEIF-ZhHZOBjxIr7lUri8gAtP1Tm1_gAJ3soQHJothGwOLANCiopFPlKmv_8srWlMVaC3A9qxMPw",
    },
    {
      id: "11",
      title: "Rose Quartz Heart Pendant",
      category: "Crystals",
      price: "₹899",
      originalPrice: "₹1,199",
      discount: "25% OFF",
      reviews: 234,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAnR-fT8myoNdVGBsF3VFBGizvxVLnnhMV1js0ib5n6sHUdDXKnxWc6sGQ8P6VJiLP2u1tFvBFtdEM9LO56Q6bY5vg7WDsVNFK3T5SqKiE2jYVJU8yzE-QsA1Cui2sRX9KR3xeEJ3lH5cJAfq5OvOcY18iDARISLF0zZC10X-52CwRzdOZXruIstsN5ovyhTJ0Wd93ChcF81-p7bHnYsRAYyUzyUL7iX7vOXdC8x34oXOTQ_aNPBs55nup8NmEi8pL4kxp73jDeJ3I",
    },
  ];

  return (
    <div className="relative min-h-screen pb-24 bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      {/* Premium Home Header */}
      <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-serif text-2xl font-bold text-primary tracking-tight hover:opacity-80 transition-opacity"
            >
              VEDIC STORE
            </Link>
            {/* Desktop Nav - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Link
                href="/shop"
                className="hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-primary after:transition-all"
              >
                Rudraksha
              </Link>
              <Link
                href="/shop"
                className="hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-primary after:transition-all"
              >
                Gemstones
              </Link>
              <Link
                href="/shop"
                className="hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-primary after:transition-all"
              >
                Yantras
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
              <AvatarImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWiP2SewcoxlUtCs8f-UvouECt-duFa-hPw0QhsQ9jjjqNAqmLJfEW3bklTVsHwVWWWoC0uAO4VqUfJxh_7wMIsoCsVSV8S1K0ZplxQd305FI51_tisjCoud4z6wvkDZX3a5OL032hrOhk7Cn_LwPajHFhD9d6hLY3uvEXk4NKDAJcLxaMML2GIP6lAvy2kRv4H8gdKYaHkmBQrXerUohDmriOrHiykeAfWWZ0GP5E25IyK6Q4sTJ1GfFh6rFEjOiR6Uig3at4zOg"
                alt="User"
              />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors relative"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute top-1 right-1 size-4 bg-terracotta text-white text-[9px] flex items-center justify-center rounded-full animate-pulse">
                2
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 space-y-12 py-8">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-muted-foreground group-focus-within:text-primary transition-colors">
              search
            </span>
          </div>
          <Input
            className="pl-12 h-14 bg-card border-border rounded-2xl shadow-sm focus-visible:ring-primary focus-visible:shadow-lg focus-visible:shadow-primary/10 text-base transition-shadow"
            placeholder="Search for Gemstones, Rudraksha, Mantras..."
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <Button
              size="sm"
              className="h-10 rounded-xl px-4 bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/30 transition-shadow"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Hero Carousel */}
        <section className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          <Card className="snap-center border-0 rounded-2xl min-w-[85vw] md:min-w-0 md:flex-1 overflow-hidden shadow-xl group relative h-[320px] md:h-[420px] cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500">
            <div
              className="w-full h-full bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAgczGTfUL6EEzq4WZtACqh17M-mWDOG6h5vTbyLxR-SO1GgpNcBa_w4Y_EPC21aXMtC1KjvUISz5TRMffrIFBWFHNl0hrxzMVUsCTZdnYyRhpdE9abjbWGNwHLj6h7Z3s5wfbu0IcoKPsT1GYretJuVKjWTu8bCACvWWmMMehnffh0VwbI58AZF9eWTyC35Q3uqR7ce9C7vBFCLEE9XS1woQfGbo4t9aEmQMWbx2IdX6S9StR1QtgYwiAs0oY46YiBtIhpgvuLedY")',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8 space-y-3">
                <Badge className="bg-primary text-primary-foreground border-none px-3 py-1 shadow-lg">
                  CERTIFIED AUTHENTIC
                </Badge>
                <h3 className="text-white text-2xl md:text-5xl font-serif font-bold leading-tight drop-shadow-lg">
                  Premium Vedic <br /> Gemstones
                </h3>
                <p className="text-white/80 text-sm md:text-base max-w-md hidden md:block">
                  Discover the power of nature's finest stones, lab-certified
                  for your spiritual journey.
                </p>
                <Button
                  className="mt-4 rounded-full px-6 md:px-8 font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  size="lg"
                >
                  Shop Collection
                </Button>
              </div>
            </div>
          </Card>
          <Card className="snap-center border-0 rounded-2xl min-w-[85vw] md:min-w-0 md:flex-1 overflow-hidden shadow-xl group relative h-[320px] md:h-[420px] cursor-pointer md:block hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500">
            <div
              className="w-full h-full bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBE_gJbHIqIwCJ_AYgMdg8Zb-ietEEQwrJQBUozD1wUC9Bg-0GT2rucpSb3kWB9Xf2rPL5JiwCQoyNQxU5VK6ylCu-sx8Rudb0pPOhSCjPpVf8SBWYTOK63IW32yeFGxepRy6Kne6LjWk_d1OI5b50gM9mNAvbXqYExZ_9jr_vgtmbJsCtiGmqbmiIpsU23LWalqgYqGGkvDf4K4Bn2LHBFcpCaaP10yTS1i43r5e5wf5xpGV-4FpidvORXzo48I2Kq71gmG4MqAR0")',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8 space-y-3">
                <Badge className="bg-terracotta text-white border-none px-3 py-1 shadow-lg">
                  SACRED POWER
                </Badge>
                <h3 className="text-white text-2xl md:text-4xl font-serif font-bold leading-tight drop-shadow-lg">
                  Original Nepal <br /> Rudraksha
                </h3>
                <Button
                  className="mt-4 rounded-full px-6 md:px-8 font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  variant="secondary"
                  size="lg"
                >
                  Explore Now
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Zodiac Strip */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground text-xl font-serif font-bold tracking-tight">
              Shop by Zodiac
            </h3>
            <Button
              variant="link"
              className="text-primary text-xs font-bold gap-1 p-0 h-auto hover:no-underline hover:gap-2 transition-all"
            >
              View All{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Button>
          </div>
          <div className="flex w-full overflow-x-auto hide-scrollbar gap-4 pb-4">
            {[
              {
                name: "Aries",
                icon: "auto_awesome",
                color: "bg-red-100 text-red-600 hover:bg-red-200",
              },
              {
                name: "Taurus",
                icon: "spa",
                color: "bg-green-100 text-green-600 hover:bg-green-200",
              },
              {
                name: "Gemini",
                icon: "account_circle",
                color: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
              },
              {
                name: "Cancer",
                icon: "water_drop",
                color: "bg-blue-100 text-blue-600 hover:bg-blue-200",
              },
              {
                name: "Leo",
                icon: "sunny",
                color: "bg-orange-100 text-orange-600 hover:bg-orange-200",
              },
              {
                name: "Virgo",
                icon: "grass",
                color: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200",
              },
              {
                name: "Libra",
                icon: "balance",
                color: "bg-pink-100 text-pink-600 hover:bg-pink-200",
              },
              {
                name: "Scorpio",
                icon: "water",
                color: "bg-purple-100 text-purple-600 hover:bg-purple-200",
              },
            ].map((z, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group py-2"
              >
                <div
                  className={`size-16 rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 ${z.color}`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {z.icon}
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                  {z.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section>
          <h3 className="text-foreground text-2xl font-serif font-bold tracking-tight mb-6 text-center">
            Sacred Collections
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Rudraksha",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnR-fT8myoNdVGBsF3VFBGizvxVLnnhMV1js0ib5n6sHUdDXKnxWc6sGQ8P6VJiLP2u1tFvBFtdEM9LO56Q6bY5vg7WDsVNFK3T5SqKiE2jYVJU8yzE-QsA1Cui2sRX9KR3xeEJ3lH5cJAfq5OvOcY18iDARISLF0zZC10X-52CwRzdOZXruIstsN5ovyhTJ0Wd93ChcF81-p7bHnYsRAYyUzyUL7iX7vOXdC8x34oXOTQ_aNPBs55nup8NmEi8pL4kxp73jDeJ3I",
                count: "120+ Products",
              },
              {
                title: "Gemstones",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgczGTfUL6EEzq4WZtACqh17M-mWDOG6h5vTbyLxR-SO1GgpNcBa_w4Y_EPC21aXMtC1KjvUISz5TRMffrIFBWFHNl0hrxzMVUsCTZdnYyRhpdE9abjbWGNwHLj6h7Z3s5wfbu0IcoKPsT1GYretJuVKjWTu8bCACvWWmMMehnffh0VwbI58AZF9eWTyC35Q3uqR7ce9C7vBFCLEE9XS1woQfGbo4t9aEmQMWbx2IdX6S9StR1QtgYwiAs0oY46YiBtIhpgvuLedY",
                count: "85+ Products",
              },
              {
                title: "Yantras",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrS30payT-shdn7gexjP_uFnMINnUCd3-5Si30KqJsu2eUe82JDQxITLV1EUXdxlvMVvcyYOZT9WMrYqtnuglGjOTSvHCVpxTuykYNLOfBsGGB52ZqjWzh2cmlK2LAFgVp0FnCzpigYGfHDxw4R-NK_NndExMGJ-enoq7gtRDiCRm8SDJ74N2GTMjDkIH9T3n_QziwFgF76SDEwpxf3TuImX6XqkBHAcD6q3ESuimNn0Bp0z7ePU-wHwxs11OvAlMHElV_JD8hJ4",
                count: "45+ Products",
              },
              {
                title: "Idols",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8P9cUYQCdQOhZUc6PVHN2xwu43I8RlHFc6HkAl397Iiny5RXYMDRz3elkgJSfoYaKNa8_cquoIKLeHFZr8kka0_PQerAB2eEXHjvxdqMY0sSFKedKunaoR60oPddN2r02O33rJFR-R2hsFAxqQPIGyJ4zA_93Y_u1fqalx2XxIbykd5Oe6kI-zmGwqpGrhIaxapqsIyPelQBKcTP5O1Z9V4hEfahQzUh1hFsGp__flLC1Pmjh5G2nOAf4siDlsm9fqK6gwfHyd6Y",
                count: "60+ Products",
              },
            ].map((cat, i) => (
              <Link key={i} href="/shop">
                <Card className="group relative aspect-[4/5] overflow-hidden border-0 rounded-2xl shadow-md cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url('${cat.img}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors"></div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <h4 className="text-white font-serif font-bold text-lg tracking-wide group-hover:scale-105 transition-transform">
                      {cat.title}
                    </h4>
                    <span className="text-white/70 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 block mt-1">
                      {cat.count}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Daily Insight Card */}
        <section>
          <Card className="bg-[#f9f6f0] dark:bg-[#242220] border-primary/20 shadow-lg relative overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-500 group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-9xl text-primary">
                auto_awesome
              </span>
            </div>
            <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="text-primary border-primary"
                  >
                    DAILY INSIGHT
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Oct 24 • Aries
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground leading-snug">
                  &quot;The celestial alignment favors new beginnings. A perfect
                  day to invest in long-term spiritual practices.&quot;
                </h3>
                <Button
                  variant="link"
                  className="text-primary p-0 h-auto font-bold uppercase tracking-widest text-xs gap-2 hover:gap-3 transition-all"
                >
                  Read Full Horoscope{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Button>
              </div>
              <div className="shrink-0 size-20 md:size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                <span className="material-symbols-outlined text-3xl md:text-4xl">
                  light_mode
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* Best Sellers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-foreground text-2xl font-serif font-bold tracking-tight">
              Best Sellers
            </h3>
            <Link href="/shop">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                View All Products
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                category={product.category}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                reviews={product.reviews}
                image={product.image}
              />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop">
              <Button
                variant="outline"
                className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#1b1a18] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-primary">
              VEDIC STORE
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing ancient wisdom to the modern world through authentic
              religious products and astrological guidance.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest">
              Support
            </h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest">
              Trust
            </h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Lab Certification
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Authenticity Check
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Astrology Experts
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest">
              Connect
            </h4>
            <div className="flex gap-4">
              <Link
                href="#"
                className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all"
              >
                <span className="material-symbols-outlined text-xl">share</span>
              </Link>
              <Link
                href="#"
                className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all"
              >
                <span className="material-symbols-outlined text-xl">mail</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 text-center text-gray-500 text-xs">
          © 2024 Vedic Store. All sacred items are ethically sourced and lab
          certified.
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
