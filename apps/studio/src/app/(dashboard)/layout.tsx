import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@clerk/nextjs/server";
import { SidebarInset, SidebarProvider } from "@instello/ui/components/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();

  if (!sessionClaims?.metadata?.hasCreatorRole) redirect("/no-access");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="h-[44px] border-b"></header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
