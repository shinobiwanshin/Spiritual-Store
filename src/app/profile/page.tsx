import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  return (
    <div className="relative min-h-screen pb-24 bg-background text-foreground">
      <div className="h-48 bg-primary/10 w-full relative">
        <div className="absolute inset-x-0 -bottom-12 flex justify-center">
          <div className="size-24 rounded-full border-4 border-background overflow-hidden bg-background">
            <Avatar className="h-full w-full">
              <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWiP2SewcoxlUtCs8f-UvouECt-duFa-hPw0QhsQ9jjjqNAqmLJfEW3bklTVsHwVWWWoC0uAO4VqUfJxh_7wMIsoCsVSV8S1K0ZplxQd305FI51_tisjCoud4z6wvkDZX3a5OL032hrOhk7Cn_LwPajHFhD9d6hLY3uvEXk4NKDAJcLxaMML2GIP6lAvy2kRv4H8gdKYaHkmBQrXerUohDmriOrHiykeAfWWZ0GP5E25IyK6Q4sTJ1GfFh6rFEjOiR6Uig3at4zOg" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="pt-16 pb-6 px-4 text-center">
        <h2 className="text-2xl font-serif font-bold">Aaryan</h2>
        <p className="text-sm text-muted-foreground">Member since Oct 2023</p>
      </div>

      <div className="px-4 space-y-4">
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                shopping_bag
              </span>
              <span className="font-bold">My Orders</span>
            </div>
            <span className="material-symbols-outlined text-muted-foreground">
              arrow_forward_ios
            </span>
          </CardContent>
        </Card>
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                location_on
              </span>
              <span className="font-bold">Addresses</span>
            </div>
            <span className="material-symbols-outlined text-muted-foreground">
              arrow_forward_ios
            </span>
          </CardContent>
        </Card>
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                settings
              </span>
              <span className="font-bold">Settings</span>
            </div>
            <span className="material-symbols-outlined text-muted-foreground">
              arrow_forward_ios
            </span>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
