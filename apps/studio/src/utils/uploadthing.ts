import type { StudioFileRouter } from "@/app/api/uploadthing/core";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<StudioFileRouter>();
export const UploadDropzone = generateUploadDropzone<StudioFileRouter>();
