"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useAuth,
  useOrganizationList,
  useUser,
} from "@clerk/nextjs";
import { SpinnerIcon } from "@phosphor-icons/react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export default function Page() {
  const params = useSearchParams();
  const clerk_status = params.get("__clerk_status") as
    | "sign_in"
    | "sign_up"
    | "complete";
  const clerk_ticket = params.get("__clerk_ticket");
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { setActive, isLoaded: organizationLoaded } = useOrganizationList();

  const getInvitation = useCallback(async () => {
    if (isLoaded || organizationLoaded) {
      const invitations = await user?.getOrganizationInvitations();

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const jwt_token = jwtDecode<{ sid?: string }>(clerk_ticket ?? "");

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!jwt_token?.sid) {
          toast.error("Invalid invitation token.");
          return;
        }

        const invitation = invitations?.data.find(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (inv) => inv.id === jwt_token.sid,
        );

        if (invitation?.status === "accepted") {
          await setActive?.({
            organization: invitation.publicOrganizationData.id,
          });
          toast.info("Already accepted");
          router.push(`/${invitation.publicOrganizationData.slug}`);
        } else if (invitation?.status === "pending" && isSignedIn) {
          await invitation.accept();
          router.push(`/${invitation.publicOrganizationData.slug}`);
        } else if (invitation?.status === "revoked") {
          toast.error("Invitation has been revoked by admin");
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [
    isLoaded,
    clerk_ticket,
    isSignedIn,
    router,
    user,
    organizationLoaded,
    setActive,
  ]);

  useEffect(() => {
    getInvitation()
      .then(() => {
        router.refresh();
      })
      .catch((e) => console.log(e));
  }, [isLoaded, getInvitation, router]);

  if (clerk_status === "sign_in")
    return (
      <>
        <SignedIn>
          <div className="flex h-screen flex-col items-center justify-center">
            <h4 className="text-muted-foreground text-lg font-medium">
              Accepting Invitation...
            </h4>
            <SpinnerIcon
              strokeWidth={0.5}
              className="text-muted-foreground size-8 animate-spin"
            />
          </div>
        </SignedIn>
        <SignedOut>
          <SignIn path="/accept-invitation" fallbackRedirectUrl={"/"} />
        </SignedOut>
      </>
    );

  return (
    <SignedOut>
      <SignUp path="/accept-invitatoin" fallbackRedirectUrl={"/"} />
    </SignedOut>
  );
}
