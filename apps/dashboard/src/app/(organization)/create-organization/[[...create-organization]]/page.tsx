import Image from "next/image";
import { CreateOrganization } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-6">
      <Image
        src={"/instello.svg"}
        width={200}
        height={80}
        alt="Instello Logo"
      />
      <p className="text-muted-foreground font-medium">
        One Platform. Every Posibility.
      </p>
      <CreateOrganization
        skipInvitationScreen
        afterCreateOrganizationUrl={"/:slug"}
      />
    </div>
  );
}
