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
        break;
      }

      case "video.upload.asset_created": {
        const { id: uploadId, asset_id } = wbEvent.data;
        await db
          .update(video)
          .set({ assetId: asset_id, status: "asset_created" })
          .where(eq(video.uploadId, uploadId));
        break;
      }

      case "video.asset.ready": {
        const asset = wbEvent.data;
        const playbackId = asset.playback_ids?.[0]?.id;
        await db
          .update(video)
          .set({ status: "ready", playbackId })
          .where(eq(video.assetId, asset.id));
        break;
      }

      case "video.asset.errored": {
        const { id: assetId } = wbEvent.data;
        await db
          .update(video)
          .set({ status: "errored" })
          .where(eq(video.assetId, assetId));
        break;
      }

      case "video.upload.cancelled": {
        const { id: uploadId } = wbEvent.data;
        await db
          .update(video)
          .set({ status: "cancelled" })
          .where(eq(video.uploadId, uploadId));
        break;
      }

      case "video.asset.deleted": {
        const { id: assetId } = wbEvent.data;
        await db.delete(video).where(eq(video.assetId, assetId));
        break;
      }

      default:
        return NextResponse.json(
          { message: `Unhandled event: ${wbEvent.type}` },
          { status: 400 },
        );
    }

    return NextResponse.json({ message: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ message: "failed" }, { status: 500 });
  }
}
