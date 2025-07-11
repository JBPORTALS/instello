import { CreateOrganization } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-svh items-center justify-center">
      <CreateOrganization
        skipInvitationScreen
        afterCreateOrganizationUrl={"/:slug"}
      />
    </div>
  );
}
