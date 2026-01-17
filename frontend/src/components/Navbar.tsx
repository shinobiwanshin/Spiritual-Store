"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useCartStore } from "@/lib/stores/cart-store";

export default function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
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
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary rounded-full hover:bg-background transition-all"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full hover:bg-background transition-all"
          >
            Shop
          </Link>
          <Link
            href="/rashi"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full hover:bg-background transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">
              auto_awesome
            </span>
            Rashi
          </Link>
          <Link
            href="#about"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full hover:bg-background transition-all"
          >
            About
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
          </Button>

          {/* Wishlist Button */}
          <Link href="/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">favorite</span>
            </Button>
          </Link>

          {/* Cart Button */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
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
              <Button className="rounded-full px-5 h-9 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
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

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full hover:bg-primary/10"
          >
            <span className="material-symbols-outlined">menu</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
