import Container from "@/components/container";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader title="Home" />
      <Container className="px-16 flex flex-col min-h-[calc(100svh-var(--header-height))] items-center justify-center">
        <h1 className="text-3xl font-bold text-muted-foreground">Instello Studio Dashboard</h1>
        <p className="font-semibold">Coming soon!</p>
      </Container>
    </>
  );
}
