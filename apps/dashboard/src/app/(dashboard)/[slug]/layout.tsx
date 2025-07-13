import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@instello/ui/components/sidebar";

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={defaultOpen}
      className="bg-sidebar"
    >
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
