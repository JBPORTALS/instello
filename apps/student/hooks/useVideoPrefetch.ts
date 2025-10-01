import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/api";

export function useVideoPrefetch() {
  const queryClient = useQueryClient();

  const prefetchVideo = (videoId: string) => {
    // Prefetch the video details
    queryClient.prefetchQuery(
      trpc.lms.video.getById.queryOptions({
        videoId,
      })
    );
  };

  const prefetchVideos = (videoIds: string[]) => {
    // Prefetch multiple videos in parallel
    const prefetchPromises = videoIds.map((videoId) =>
      queryClient.prefetchQuery(
        trpc.lms.video.getById.queryOptions({
          videoId,
        })
      )
    );
    
    return Promise.all(prefetchPromises);
  };

  return {
    prefetchVideo,
    prefetchVideos,
  };
}
