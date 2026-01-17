import { Badge } from "@/components/ui/badge";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-muted/50 dark:bg-card/50">
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
              Founded in 2010, AstraSpiritual has been India&apos;s most trusted
              source for authentic spiritual products. We bridge the gap between
              ancient Vedic traditions and modern verification methods.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every gemstone is lab-certified, every Rudraksha is X-ray
              verified, and every product comes with a detailed authenticity
              certificate. Our team of expert astrologers provides personalized
              guidance to help you choose the right products for your spiritual
              journey.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary">
                  50K+
                </p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
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
                alt="About AstraSpiritual"
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
