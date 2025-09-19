import { Header } from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="@container/main h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] px-4 sm:px-8 md:px-10 xl:px-14">
      <Header />

      <main className="h-full py-6">{children}</main>
    </main>
  );
}
