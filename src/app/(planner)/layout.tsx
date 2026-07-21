import { AppHeader } from "@/components/layout/AppHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="w-full">{children}</div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
