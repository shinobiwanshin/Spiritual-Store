import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";

export default function Wishlist() {
  return (
    <div className="relative min-h-screen pb-24 bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md px-4 py-4 flex items-center border-b border-border">
        <h1 className="flex-1 text-center text-lg font-serif font-bold text-foreground">
          Your Wishlist
        </h1>
      </header>

      <div className="p-4 grid gap-4">
        {/* Placeholder for wishlist items */}
        <ProductCard
          id="2"
          title="5 Mukhi Nepal Rudraksha Mala"
          category="Authentic"
          price="₹1,850"
          reviews={456}
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuD5UuOpEVjMfcP6B3I3UN8rUY1Tg5opjyJsq3DaS9TPQTMJuFHy6l7lqjnwIvKs357uNdO93uubW5DRZf6YvpUrY4zTRNQGXi5WqsUwtomdOYitPEyVJANfyabWxAfHB0WtvqC0lGhmNH50BKDW2QV67bL3Y-srohMGyHb4OIds1S8zI-wkYjt78aQCnmLldBich8aUpTw2OLqdsZpn_tESOxWG30ml5oelVASXprFplenU4YOAg-5i4I1rsNOlP-O2fzrT2wObqEU"
        />
      </div>
      <div className="mt-8 text-center text-muted-foreground text-sm">
        <p>Add more items to your wishlist!</p>
      </div>

      <BottomNav />
    </div>
  );
}
