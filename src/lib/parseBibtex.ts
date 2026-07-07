// lib/parseBibtex.ts

export interface BibEntry {
  id: string;
  type: string;
  year: string;
  title: string;
  author: string;
  note?: string;
  journal?: string;
  booktitle?: string;
  doi?: string;
  arxiv?: string;
  url?: string;
  presentation?: string;
  eprint?: string;
}

/**
 * Minimal BibTeX parser.  Handles standard fields + custom fields
 * (arxiv, presentation, entrytype) injected as plain key = {value} pairs.
 */
export function parseBibtex(raw: string): BibEntry[] {
  const entries: BibEntry[] = [];

  // Match each @type{key, ...} block
  const entryRegex = /@(\w+)\s*\{\s*([^,]+)\s*,([^@]*)\}/gs;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(raw)) !== null) {
    const type  = match[1].toLowerCase();
    const id    = match[2].trim();
    const body  = match[3];

    if (type === "comment" || type === "string" || type === "preamble") continue;

    // Parse key = {value} or key = "value" or key = number
    const fields: Record<string, string> = {};
    const fieldRegex = /(\w+)\s*=\s*(?:\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}|"([^"]*)"|(\d+))/g;
    let fm: RegExpExecArray | null;
    while ((fm = fieldRegex.exec(body)) !== null) {
      const key = fm[1].toLowerCase();
      const val = (fm[2] ?? fm[3] ?? fm[4] ?? "").replace(/\s+/g, " ").trim();
      fields[key] = val;
    }

    entries.push({
      id,
      type,
      year:         fields.year        ?? "",
      title:        fields.title       ?? "",
      author:       fields.author      ?? "",
      note:         fields.note,
      journal:      fields.journal,
      booktitle:    fields.booktitle,
      doi:          fields.doi,
      arxiv:        fields.arxiv,
      url:          fields.url,
      presentation: fields.presentation,
      eprint:       fields.eprint,
    });
  }

  return entries;
}

/** Group entries by year (descending). */
export function groupByYear(entries: BibEntry[]): Map<string, BibEntry[]> {
  const sorted = [...entries].sort((a, b) => Number(b.year) - Number(a.year));
  const map = new Map<string, BibEntry[]>();
  for (const entry of sorted) {
    const yr = entry.year || "Unknown";
    if (!map.has(yr)) map.set(yr, []);
    map.get(yr)!.push(entry);
  }
  return map;
}