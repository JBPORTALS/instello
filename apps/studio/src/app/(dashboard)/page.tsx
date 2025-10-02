import Container from "@/components/container";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader title="Home" />
      <Container className="flex min-h-[calc(100svh-var(--header-height))] flex-col items-center justify-center px-16">
        <h1 className="text-muted-foreground text-3xl font-bold">
          Instello Studio Dashboard
        </h1>
        <p className="font-semibold">Coming soon!</p>
      </Container>
    </>
  );
}
