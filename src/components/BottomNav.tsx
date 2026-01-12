"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 z-50">
      <Link href="/" className="flex-1 max-w-[80px]">
        <Button
          variant="ghost"
          className={cn(
            "w-full h-14 flex flex-col gap-1 items-center justify-center hover:bg-transparent px-1",
            isActive("/") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "material-symbols-outlined text-2xl",
              isActive("/") && "fill-1"
            )}
          >
            home
          </span>
          <span className="text-[10px] font-medium leading-none">Home</span>
        </Button>
      </Link>

      <Link href="/shop" className="flex-1 max-w-[80px]">
        <Button
          variant="ghost"
          className={cn(
            "w-full h-14 flex flex-col gap-1 items-center justify-center hover:bg-transparent px-1",
            isActive("/shop") ? "text-primary " : "text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "material-symbols-outlined text-2xl",
              isActive("/shop") && "fill-1"
            )}
          >
            grid_view
          </span>
          <span className="text-[10px] font-medium leading-none">Shop</span>
        </Button>
      </Link>

      <Link href="/rashi" className="flex-1 max-w-[80px] -mt-12 group">
        <div
          className={cn(
            "size-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg border-4 border-background transition-transform active:scale-95 group-hover:bg-primary/90",
            isActive("/rashi") && "ring-2 ring-offset-2 ring-primary"
          )}
        >
          <span className="material-symbols-outlined text-3xl">
            auto_awesome
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold mt-1 text-center block",
            isActive("/rashi") ? "text-primary" : "text-primary/70"
          )}
        >
          Rashi
        </span>
      </Link>

      <Link href="/wishlist" className="flex-1 max-w-[80px]">
        <Button
          variant="ghost"
          className={cn(
            "w-full h-14 flex flex-col gap-1 items-center justify-center hover:bg-transparent px-1",
            isActive("/wishlist") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "material-symbols-outlined text-2xl",
              isActive("/wishlist") && "fill-1"
            )}
          >
            favorite
          </span>
          <span className="text-[10px] font-medium leading-none">Wishlist</span>
        </Button>
      </Link>

      <Link href="/profile" className="flex-1 max-w-[80px]">
        <Button
          variant="ghost"
          className={cn(
            "w-full h-14 flex flex-col gap-1 items-center justify-center hover:bg-transparent px-1",
            isActive("/profile") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "material-symbols-outlined text-2xl",
              isActive("/profile") && "fill-1"
            )}
          >
            person
          </span>
          <span className="text-[10px] font-medium leading-none">Profile</span>
        </Button>
      </Link>
    </nav>
  );
}
