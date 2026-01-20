"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useCartStore } from "@/lib/stores/cart-store";

// Define menu structure
type MenuItem = {
  label: string;
  href?: string;
  type: "link" | "dropdown";
  items?: { label: string; href: string; icon: string }[];
};

const menuItems: MenuItem[] = [
  { label: "Home", href: "/", type: "link" },
  { label: "About Us", href: "/about", type: "link" },
  {
    label: "Services",
    type: "dropdown",
    items: [
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
    ],
  },
  {
    label: "Monthly Kundali",
    href: "/services/monthly-kundali",
    type: "link",
  },
  { label: "Know Your Birth Kundali", href: "/rashi", type: "link" },
  {
    label: "Reports",
    type: "dropdown",
    items: [
      {
        href: "/reports/1-year-prediction",
        label: "1 Year Prediction Report",
        icon: "calendar_today",
      },
      {
        href: "/reports/3-year-prediction",
        label: "3 Year Prediction Report",
        icon: "date_range",
      },
      {
        href: "/reports/5-year-prediction",
        label: "5 Year Prediction Report",
        icon: "history",
      },
    ],
  },
  { label: "Products", href: "/shop", type: "link" },
];

export default function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<
    string | null
  >(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <span className="material-symbols-outlined text-white text-xl">
                auto_awesome
              </span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground tracking-tight hidden lg:block">
              ASTRA<span className="text-primary">SPIRITUAL</span>
            </span>
          </Link>

          {/* Center Navigation - Desktop */}
          {/* Note: Hidden on mobile/tablet (< lg), visible on large screens */}
          {/* Using text-sm and tighter spacing to fit 7 items */}
          <div className="hidden xl:flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1.5 overflow-x-auto">
            {menuItems.map((item, idx) => {
              if (item.type === "dropdown") {
                const isActive = activeDropdown === item.label;
                return (
                  <div
                    key={idx}
                    className="relative"
                    ref={isActive ? dropdownRef : null}
                  >
                    <button
                      onClick={() =>
                        setActiveDropdown(isActive ? null : item.label)
                      }
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full hover:bg-background transition-all flex items-center gap-1 whitespace-nowrap"
                    >
                      {item.label}
                      <span
                        className={`material-symbols-outlined text-sm transition-transform ${isActive ? "rotate-180" : ""}`}
                      >
                        expand_more
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isActive && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-20">
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                          >
                            <span className="material-symbols-outlined text-primary text-xl">
                              {subItem.icon}
                            </span>
                            <span className="font-medium text-sm">
                              {subItem.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={idx}
                  href={item.href!}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full hover:bg-background transition-all whitespace-nowrap"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <SignedIn>
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

              <Link href="/orders" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="My Orders"
                  className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    receipt_long
                  </span>
                </Button>
              </Link>
            </SignedIn>

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

            {/* Mobile Menu Button - Visible on lg and below because menu items are many */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open Menu"
              className="xl:hidden rounded-full hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 xl:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20">
              <Link
                href="/"
                className="flex items-center gap-2 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-lg">
                    auto_awesome
                  </span>
                </div>
                <span className="font-serif text-lg font-bold text-foreground tracking-tight">
                  ASTRA<span className="text-primary">SPIRITUAL</span>
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full hover:bg-muted"
              >
                <span className="material-symbols-outlined">close</span>
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
              {menuItems.map((item, idx) => {
                if (item.type === "dropdown") {
                  const isMobileActive = activeMobileDropdown === item.label;
                  return (
                    <div key={idx} className="space-y-1">
                      <button
                        onClick={() =>
                          setActiveMobileDropdown(
                            isMobileActive ? null : item.label,
                          )
                        }
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-medium ${isMobileActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`material-symbols-outlined ${isMobileActive ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {item.label === "Reports"
                              ? "description"
                              : "support_agent"}
                          </span>
                          {item.label}
                        </span>
                        <span
                          className={`material-symbols-outlined text-sm transition-transform duration-300 ${isMobileActive ? "rotate-90" : ""}`}
                        >
                          chevron_right
                        </span>
                      </button>

                      {/* Accordion Content */}
                      {isMobileActive && (
                        <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200">
                          <div className="border-l-2 border-primary/20 pl-2 space-y-1">
                            {item.items?.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                              >
                                <span className="material-symbols-outlined text-base">
                                  {subItem.icon}
                                </span>
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={idx}
                    href={item.href!}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-foreground hover:bg-muted hover:text-primary transition-all group"
                  >
                    <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary transition-colors">
                      {item.label === "Home"
                        ? "home"
                        : item.label === "About Us"
                          ? "info"
                          : item.label === "Monthly Kundali"
                            ? "calendar_month"
                            : item.label === "Know Your Birth Kundali"
                              ? "auto_awesome"
                              : item.label === "Reports"
                                ? "description"
                                : item.label === "Products"
                                  ? "shopping_bag"
                                  : "circle"}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <div className="my-6 border-t border-border/50" />

              <SignedIn>
                <div className="space-y-2">
                  <h4 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Account
                  </h4>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-muted-foreground">
                      favorite
                    </span>
                    <span className="font-medium">Wishlist</span>
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-muted-foreground">
                      receipt_long
                    </span>
                    <span className="font-medium">My Orders</span>
                  </Link>
                </div>
              </SignedIn>
            </div>

            {/* Footer / Sign In */}
            <div className="p-6 border-t border-border/50 bg-muted/20">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="w-full rounded-xl h-12 font-bold shadow-lg shadow-orange-500/20 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} AstraSpiritual.
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                  All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
