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
      <main
        className="flex-1 overflow-y-auto px-4 py-5"
        style={{
          backgroundColor: "#fffdfb",
          backgroundImage: [
            "radial-gradient(circle at 108% 9%, rgba(72, 216, 207, 0.26) 0%, rgba(72, 216, 207, 0) 31%)",
            "radial-gradient(circle at -12% 47%, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0) 30%)",
            "radial-gradient(circle at 110% 86%, rgba(98, 221, 214, 0.2) 0%, rgba(98, 221, 214, 0) 29%)",
            "linear-gradient(180deg, #ffffff 0%, #f3fffd 52%, #fffaf0 100%)",
          ].join(", "),
        }}
      >
        <div className="w-full">{children}</div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
