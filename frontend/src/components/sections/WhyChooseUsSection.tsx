import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: "science",
    title: "Lab Certified",
    desc: "Every gemstone undergoes rigorous testing at certified gemological labs. We provide detailed certification with each purchase.",
  },
  {
    icon: "psychology",
    title: "Expert Astrologers",
    desc: "Our team of Vedic astrologers with 20+ years experience provides personalized consultations and recommendations.",
  },
  {
    icon: "refresh",
    title: "Easy Returns",
    desc: "Not satisfied? Return within 30 days for a full refund. No questions asked. Your satisfaction is our priority.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-primary border-primary mb-4">
            WHY CHOOSE US
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold">
            The Astra Spiritual Difference
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div
              key={i}
              className="relative p-8 rounded-3xl border border-primary/10 bg-gradient-to-b from-primary/5 to-transparent hover:border-primary/30 transition-all group"
            >
              <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
