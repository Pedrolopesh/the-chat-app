/** Formato legado das mensagens: "DD/MM/YYYY-HH:mm". */
export function nowStamp(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}-${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Mostra só a hora se for hoje; senão a data. */
export function shortStamp(stamp?: string, today = new Date()): string {
  if (!stamp) return "";
  const [date, time] = stamp.split("-");
  if (!date || !time) return stamp;
  const p = (n: number) => String(n).padStart(2, "0");
  const todayStr = `${p(today.getDate())}/${p(today.getMonth() + 1)}/${today.getFullYear()}`;
  return date === todayStr ? time : date.slice(0, 5);
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "?"
  );
}
