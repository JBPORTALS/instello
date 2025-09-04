import Container from "@/components/container";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader title="Home" />
      <Container className="px-16">
        <h1>Instello Studio Home</h1>
      </Container>
    </>
  );
}
