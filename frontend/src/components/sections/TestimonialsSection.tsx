import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
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
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-muted/50 dark:bg-card/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-primary border-primary mb-4">
            TESTIMONIALS
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review, i) => (
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
  );
}
