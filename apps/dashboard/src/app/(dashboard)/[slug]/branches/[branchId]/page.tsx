import { HydrateClient } from "@/trpc/server";

import { BranchInfoRow } from "./branch-info-row";

export default function Page() {
  return (
    <HydrateClient>
      <section className="px-24 py-6">
        <BranchInfoRow />
      </section>
    </HydrateClient>
  );
}
