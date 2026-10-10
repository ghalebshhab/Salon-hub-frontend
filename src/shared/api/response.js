export function requireData(response, fallback = "Request failed") {
  if (!response?.success) throw new Error(response?.message || fallback);
  return response.data;
}
