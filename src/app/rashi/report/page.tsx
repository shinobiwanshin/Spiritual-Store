import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function RashiReport() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md px-4 py-4 flex items-center border-b border-border">
        <Link href="/rashi" className="p-2 -ml-2 text-primary">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-serif font-bold mr-8 text-foreground">
          Your Rashi Report
        </h1>
      </header>

      <main className="px-6 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary animate-pulse">
            <span className="material-symbols-outlined text-5xl text-primary">
              auto_awesome
            </span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Aries (Mesha)
          </h2>
          <p className="text-muted-foreground font-medium">Your Moon Sign</p>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  diamond
                </span>
                Lucky Gemstone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                Red Coral (Moonga) allows Mars to be favourable to you. It will
                help with vitality and ambition.
              </p>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/5"
              >
                View Red Coral
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  self_improvement
                </span>
                Lucky Rudraksha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                3 Mukhi Rudraksha is best suited for you, helping to burn past
                sins and providing energy.
              </p>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/5"
              >
                View 3 Mukhi Rudraksha
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="font-bold text-lg flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">format_quote</span>
                Mantra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 leading-relaxed italic text-center font-serif text-lg">
                &quot;Om Kram Kreem Kraum Sah Bhaumaya Namah&quot;
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
