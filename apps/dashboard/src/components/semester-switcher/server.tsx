import React from "react";
import { cookies } from "next/headers";

import { SemesterSwitcher } from "./client";

/**
 * Server component which syncs the semester cookie with client display the active semester,
 * without any loading indicator...
 *
 * @warning this component only needs to be used under server environment not client
 */
export default async function SemesterSwitcherServer() {
  const cookieStore = await cookies();
  const semesterCookieRaw = cookieStore.get("semester")?.value ?? "null";

  return <SemesterSwitcher defaultSemesterCookie={semesterCookieRaw} />;
}
