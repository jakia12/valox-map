export async function loadJson(url) {
  const res = await fetch(url, { cache: "force-cache" });

  if (!res.ok) {
    throw new Error(`Failed to load: ${url}`);
  }

  return await res.json();
}
