import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@clerk/nextjs/server";
import { SidebarInset, SidebarProvider } from "@instello/ui/components/sidebar";
import NextTopLoader from "nextjs-toploader";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();

  if (!sessionClaims?.metadata.hasCreatorRole) redirect("/no-access");

  return (
    <>
      <NextTopLoader
        color="#F7941D"
        crawl
        easing="linear"
        height={2}
        showSpinner={false}
      />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
            "--header-height": "calc(var(--spacing) * 14)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="@container/main">{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
