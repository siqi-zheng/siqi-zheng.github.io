// components/PublicationCard.tsx
import { FileText, ExternalLink, BookOpen, Link2, Code2 } from "lucide-react";
import { BibEntry } from "@/lib/parseBibtex";

export function PublicationCard({ entry }: { entry: BibEntry }) {
  const venue = entry.journal ?? entry.booktitle ?? null;

  // Resolve the arXiv URL from either the `arxiv` field or `eprint`
  const arxivUrl =
    entry.arxiv ??
    (entry.eprint ? `https://arxiv.org/abs/${entry.eprint}` : null);

  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      {/* Year is rendered by the parent group header, not per-card */}

      <h3
        className="text-lg font-semibold text-foreground mt-1"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {entry.title}
      </h3>

      <p className="text-sm text-foreground mt-1">{entry.author}</p>

      {venue && (
        <p className="text-sm text-muted-foreground mt-1 italic">{venue}</p>
      )}

      {entry.note && (
        <p className="text-sm text-accent mt-1 italic">{entry.note}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {arxivUrl && (
          <a
            href={arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
          >
            <FileText className="w-3.5 h-3.5" /> arXiv
          </a>
        )}
        {entry.doi && (
          <a
            href={`https://doi.org/${entry.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
          >
            <BookOpen className="w-3.5 h-3.5" /> DOI
          </a>
        )}
        {entry.codes && (
          <a
            href={entry.codes}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
          >
            <Code2 className="w-3.5 h-3.5" /> Code
          </a>
        )}
        {entry.presentation && (
          <a
            href={entry.presentation}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Presentation
          </a>
        )}
        {entry.url && (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
          >
            <Link2 className="w-3.5 h-3.5" /> Paper
          </a>
        )}
      </div>
    </div>
  );
}