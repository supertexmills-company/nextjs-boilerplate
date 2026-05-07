/** Lightweight relative time for past dates (avoids extra deps). */
export function formatTimeAgo(iso: string | undefined | null, options?: { addSuffix?: boolean }): string {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const diffMs = Math.max(0, Date.now() - t);
  const ago = options?.addSuffix ? " ago" : "";
  const sec = Math.floor(diffMs / 1000);
  if (sec < 45) return `just now${ago}`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m${ago}`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h${ago}`;
  const days = Math.floor(hr / 24);
  return `${days}d${ago}`;
}
