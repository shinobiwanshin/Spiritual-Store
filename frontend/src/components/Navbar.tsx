"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useCartStore } from "@/lib/stores/cart-store";

export default function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/rashi", label: "Rashi", icon: "auto_awesome" },
  ];

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
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full hover:bg-background transition-all flex items-center gap-1"
              >
                {link.icon && (
                  <span className="material-symbols-outlined text-base">
                    {link.icon}
                  </span>
                )}
                {link.label}
              </Link>
            ))}
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
        <div className="fixed inset-0 z-[60] lg:hidden">
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

            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
                >
                  {link.icon ? (
                    <span className="material-symbols-outlined text-primary">
                      {link.icon}
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-muted-foreground">
                      chevron_right
                    </span>
                  )}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

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
