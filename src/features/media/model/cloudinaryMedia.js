export function optimizedCloudinaryImage(
  url,
  { width = 1200, height = 800 } = {},
) {
  if (
    !url ||
    !/^https:\/\/res\.cloudinary\.com\//i.test(url) ||
    !url.includes("/image/upload/")
  ) {
    return url;
  }
  const transformation = `f_auto,q_auto,c_fill,g_auto,w_${width},h_${height}`;
  return url.replace("/image/upload/", `/image/upload/${transformation}/`);
}

/** The whole image, no crop, at most `width` wide (for the full view). */
export function fittedCloudinaryImage(url, { width = 1600 } = {}) {
  if (
    !url ||
    !/^https:\/\/res\.cloudinary\.com\//i.test(url) ||
    !url.includes("/image/upload/")
  ) {
    return url;
  }
  const transformation = `f_auto,q_auto,c_limit,w_${width}`;
  return url.replace("/image/upload/", `/image/upload/${transformation}/`);
}

/** A still frame of a Cloudinary video, or null for other hosts. */
export function cloudinaryVideoPoster(url, { width = 800, height = 800 } = {}) {
  if (
    !url ||
    !/^https:\/\/res\.cloudinary\.com\//i.test(url) ||
    !url.includes("/video/upload/")
  ) {
    return null;
  }
  const transformation = `so_0,c_fill,g_auto,q_auto,w_${width},h_${height}`;
  return url
    .replace("/video/upload/", `/video/upload/${transformation}/`)
    .replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
}
