import { AWS_BUCKET_URL, BASE_URL } from "@constants/config";

export const getFileUrl = (url: string) => {
  if (url) {
    return url.includes("http") ? url : `${BASE_URL}${url}`;
  }
  // unavailable image icon
  return `${AWS_BUCKET_URL}/no_image_23370de72c.jpg`;
};
