import { z } from "zod";

const CloudinaryResponseSchema = z.object({
  secure_url: z.url(),
});

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing cloudinary configuration");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error(`Upload Failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const parsed = CloudinaryResponseSchema.parse(data);

  return parsed.secure_url;
}
