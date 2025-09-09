// @ts-nocheck
addEventListener("message", (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "START_UPLOAD": {
      const { id, url, file } = payload;
      uploadFile(id, url, file)
        .then(() => console.log("uplad started"))
        .catch((e) => console.log("Uploading error: ", e));
      break;
    }

    case "CANCEL_UPLOAD": {
      const { id } = payload;
      if (activeUploads[id]) {
        activeUploads[id].cancelled = true;
      }
      self.postMessage({ type: "UPLOAD_CANCELLED", payload: { id } });
      break;
    }

    case "PAUSE_UPLOAD": {
      const { id } = payload;
      if (activeUploads[id]) {
        activeUploads[id].paused = true;
        self.postMessage({ type: "UPLOAD_PAUSED", payload: { id } });
      }
      break;
    }

    case "RESUME_UPLOAD": {
      const { id } = payload;
      if (activeUploads[id]) {
        activeUploads[id].paused = false;
        uploadChunks(id)
          .then(() => console.log("uplad started"))
          .catch((e) => console.log("Uploading error: ", e));
        self.postMessage({ type: "UPLOAD_RESUMED", payload: { id } });
      }
      break;
    }
  }
});

// Keep active upload state in worker memory
const activeUploads = {};

async function uploadFile(id, url, file) {
  const chunkSize = 20 * 1024 * 1024; // 20MB
  const totalSize = file.size;

  activeUploads[id] = {
    file,
    url,
    chunkSize,
    totalSize,
    offset: 0,
    paused: false,
    cancelled: false,
  };

  self.postMessage({ type: "UPLOAD_STARTED", payload: { id, totalSize } });

  await uploadChunks(id);
}

async function uploadChunks(id) {
  const state = activeUploads[id];
  if (!state) return;

  const { file, url, chunkSize, totalSize } = state;

  while (state.offset < totalSize) {
    if (state.cancelled) return;
    if (state.paused) return;

    const start = state.offset;
    const end = Math.min(start + chunkSize, totalSize);
    const chunk = file.slice(start, end);

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": chunk.size,
          "Content-Range": `bytes ${start}-${end - 1}/${totalSize}`,
        },
        body: chunk,
      });

      if (res.status === 308) {
        // Continue
        state.offset = end;
        const progress = Math.floor((end / totalSize) * 100);
        self.postMessage({
          type: "UPLOAD_PROGRESS",
          payload: { id, progress },
        });
      } else if (res.status === 200 || res.status === 201) {
        // Upload complete
        state.offset = totalSize;
        self.postMessage({ type: "UPLOAD_SUCCESS", payload: { id } });
        delete activeUploads[id];
        return;
      } else {
        throw new Error(`Unexpected response ${res.status}`);
      }
    } catch (err) {
      self.postMessage({
        type: "UPLOAD_ERROR",
        payload: { id, error: err.message },
      });
      return;
    }
  }
}
