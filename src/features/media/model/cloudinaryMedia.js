export function optimizedCloudinaryImage(url, { width = 1200, height = 800 } = {}) {
  if (!url || !/^https:\/\/res\.cloudinary\.com\//i.test(url) || !url.includes("/image/upload/")) {
    return url;
  }
  const transformation = `f_auto,q_auto,c_fill,g_auto,w_${width},h_${height}`;
  return url.replace("/image/upload/", `/image/upload/${transformation}/`);
}
