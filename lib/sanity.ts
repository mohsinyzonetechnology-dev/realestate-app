// lib/sanity.ts
import { createClient } from "@sanity/client";
export const client = createClient({
  projectId: "g41qk6pi",
  dataset: "production",
  apiVersion: "2026-04-25",
  useCdn: false,
  token: process.env.EXPO_PUBLIC_SANITY_TOKEN,
});

export const uploadImageToSanity = async (uri: string) => {
  const filename = uri.split("/").pop() || "photo.jpg";
  const response = await fetch(uri);
  const blob = await response.blob();

  const asset = await client.assets.upload("image", blob, {
    filename,
    contentType: "image/jpeg",
  });

  return asset._id;
};

export const uploadVideoToSanity = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const asset = await client.assets.upload("file", blob, {
    filename: "listing-video.mp4",
  });

  return asset._id;
};
