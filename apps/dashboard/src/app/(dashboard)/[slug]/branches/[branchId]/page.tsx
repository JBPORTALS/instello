import Container from "@/components/container";
import { HydrateClient } from "@/trpc/server";

import { BranchInfoRow } from "./branch-info-row";

export default function Page() {
  return (
    <HydrateClient>
      <div className="w-full px-6 py-2.5">
        <section className="relative aspect-video h-52 w-full rounded-md bg-gradient-to-r from-indigo-500 to-blue-500"></section>
      </div>
      <Container className="px-16">
        <BranchInfoRow />
      </Container>
    </HydrateClient>
  );
}
