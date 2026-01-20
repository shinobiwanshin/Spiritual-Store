"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useCartStore } from "@/lib/stores/cart-store";

// Services for dropdown
const serviceLinks = [
  { href: "/rashi", label: "Rashi Kundali", icon: "auto_awesome", free: true },
  {
    href: "/services/sampurna-kundali",
    label: "Sampurna Kundali",
    icon: "call",
    premium: true,
  },
  {
    href: "/services/monthly-kundali",
    label: "Monthly Kundali",
    icon: "calendar_month",
    subscription: true,
  },
  {
    href: "/services/health-problems-consultation",
    label: "Health Problems",
    icon: "favorite",
  },
  {
    href: "/services/career-problems-consultation",
    label: "Career Problems",
    icon: "work",
  },
  {
    href: "/services/family-problems-consultation",
    label: "Family Problems",
    icon: "family_restroom",
  },
  {
    href: "/services/children-problems-consultation",
    label: "Children Problems",
    icon: "child_care",
  },
  {
    href: "/services/marital-problems-consultation",
    label: "Marital Problems",
    icon: "favorite_border",
  },
  {
    href: "/services/education-problems-consultation",
    label: "Education Problems",
    icon: "school",
  },
  {
    href: "/services/financial-problems-consultation",
    label: "Financial Problems",
    icon: "account_balance",
  },
  {
    href: "/services",
    label: "View All Services",
    icon: "arrow_forward",
    isViewAll: true,
  },
];

export default function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <span className="material-symbols-outlined text-white text-xl">
                auto_awesome
              </span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground tracking-tight hidden sm:block">
              ASTRA<span className="text-primary">SPIRITUAL</span>
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full hover:bg-background transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full hover:bg-background transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">
                  support_agent
                </span>
                Services
                <span
                  className={`material-symbols-outlined text-sm transition-transform ${servicesDropdownOpen ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {servicesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-background border border-border rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {serviceLinks.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setServicesDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors ${service.isViewAll ? "border-t border-border mt-2 pt-4" : ""}`}
                    >
                      <span
                        className={`material-symbols-outlined ${service.free ? "text-green-500" : service.premium ? "text-orange-500" : service.subscription ? "text-purple-500" : "text-primary"}`}
                      >
                        {service.icon}
                      </span>
                      <span className="font-medium flex-1">
                        {service.label}
                      </span>
                      {service.free && (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                          FREE
                        </Badge>
                      )}
                      {service.premium && (
                        <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">
                          ₹2,999
                        </Badge>
                      )}
                      {service.subscription && (
                        <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">
                          ₹6,999/yr
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist Button - Hidden on small mobile */}
            <Link href="/wishlist" className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Wishlist"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">favorite</span>
              </Button>
            </Link>

            {/* Orders Button - Hidden on small mobile */}
            <Link href="/orders" className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                aria-label="My Orders"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">receipt_long</span>
              </Button>
            </Link>

            {/* Cart Button */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                aria-label="View Cart"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors relative"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-[10px]">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="rounded-full px-5 h-9 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hidden sm:flex">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 border-2 border-primary/30 ring-2 ring-primary/10",
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open Menu"
              className="lg:hidden rounded-full hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-serif font-bold text-lg">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </Button>
            </div>

            <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
                >
                  <span className="material-symbols-outlined text-muted-foreground">
                    chevron_right
                  </span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              {/* Services Section */}
              <div className="pt-2">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Services
                </div>
                {serviceLinks.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
                  >
                    <span
                      className={`material-symbols-outlined ${service.free ? "text-green-500" : "text-primary"}`}
                    >
                      {service.icon}
                    </span>
                    <span className="font-medium flex-1">{service.label}</span>
                    {service.free && (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                        FREE
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>

              <hr className="my-4 border-border" />

              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
              >
                <span className="material-symbols-outlined text-primary">
                  favorite
                </span>
                <span className="font-medium">Wishlist</span>
              </Link>

              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
              >
                <span className="material-symbols-outlined text-primary">
                  receipt_long
                </span>
                <span className="font-medium">My Orders</span>
              </Link>

              <hr className="my-4 border-border" />

              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="w-full rounded-xl h-12 font-semibold">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
