import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
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
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-muted/50 dark:bg-card/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-primary border-primary mb-4">
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
          {services.map((service, i) => (
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
  );
}
