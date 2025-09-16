import { createRouteHandler } from "uploadthing/next";

import { studioFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: studioFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
