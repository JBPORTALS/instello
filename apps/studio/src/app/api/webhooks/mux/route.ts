import type { UnwrapWebhookEvent } from "@mux/mux-node/resources/webhooks";
import { NextResponse } from "next/server";
import { eq } from "@instello/db";
import { db } from "@instello/db/client";
import { video } from "@instello/db/lms";

export async function POST(req: Request) {
  const wbEvent = (await req.json()) as UnwrapWebhookEvent;

  try {
    switch (wbEvent.type) {
      case "video.upload.errored": {
        const { id: uploadId, status } = wbEvent.data;

        await db
          .update(video)
          .set({ status })
          .where(eq(video.uploadId, uploadId));

        return NextResponse.json(
          { message: "Upload errored" },
          { status: 200, statusText: "Upload Error" },
        );
      }

      case "video.upload.cancelled": {
        const { id: uploadId } = wbEvent.data;

        await db
          .update(video)
          .set({ status: "cancelled" })
          .where(eq(video.uploadId, uploadId));

        return NextResponse.json(
          { message: "Upload cancelled" },
          { status: 200, statusText: "Upload Cancelled" },
        );
      }

      case "video.asset.created": {
        const { id: asset_id, passthrough, duration } = wbEvent.data;

        if (!passthrough)
          return NextResponse.json(
            { message: "No passthrough mentioned in the meta" },
            { status: 400, statusText: "No Passthrough" },
          );

        await db
          .update(video)
          .set({ assetId: asset_id, status: "asset_created", duration })
          .where(eq(video.id, passthrough));

        return NextResponse.json(
          { message: "Asset created" },
          { status: 200, statusText: "Asset Created" },
        );
      }

      case "video.asset.ready": {
        const asset = wbEvent.data;
        const playbackId = asset.playback_ids?.[0]?.id;

        await db
          .update(video)
          .set({ status: "ready", playbackId })
          .where(eq(video.assetId, asset.id));

        return NextResponse.json(
          { message: "Asset ready to play" },
          { status: 200, statusText: "Asset Ready to Play" },
        );
      }

      case "video.asset.errored": {
        const { id: assetId } = wbEvent.data;
        await db
          .update(video)
          .set({ status: "errored" })
          .where(eq(video.assetId, assetId));

        return NextResponse.json(
          { message: "Asset error occured" },
          { status: 200, statusText: "Upload Asset Errored" },
        );
      }

      case "video.asset.deleted": {
        const { passthrough } = wbEvent.data;

        if (!passthrough)
          return NextResponse.json(
            { message: "No passthrough mentioned in the meta" },
            { status: 400, statusText: "No Passthrough" },
          );

        await db.delete(video).where(eq(video.id, passthrough));
        return NextResponse.json(
          { message: "Asset deleted" },
          { status: 200, statusText: "Asset Deleted" },
        );
      }

      default:
        console.log("Unhandled event:", wbEvent);
        return NextResponse.json(
          { message: `Unhandled event: ${wbEvent.type}` },
          { status: 400, statusText: "Unhandled Event" },
        );
    }
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { message: "failed", description: err },
      { status: 500 },
    );
  }
}
