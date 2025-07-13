import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@instello/ui/components/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  /** Continue to dashboard content */
  return (
    <SidebarProvider defaultOpen={defaultOpen} className="bg-sidebar">
      <AppSidebar variant="sidebar" />
      {children}
    </SidebarProvider>
  );
}
