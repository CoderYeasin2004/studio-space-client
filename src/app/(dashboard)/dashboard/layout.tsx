import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

/**
 * Dashboard shell: collapsible sidebar + sticky top bar. Marketing pages
 * never render inside this group, and vice versa.
 */
const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="mx-auto w-full max-w-360 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
