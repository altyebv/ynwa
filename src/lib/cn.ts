type ClassValue = string | number | null | undefined | false | ClassValue[];

/** Minimal class joiner. No dependency for something this small. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (!v && v !== 0) continue;
    if (Array.isArray(v)) {
      const nested = cn(...v);
      if (nested) out.push(nested);
    } else {
      out.push(String(v));
    }
  }
  return out.join(' ');
}
