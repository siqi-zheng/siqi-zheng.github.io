import { useParams, useNavigate } from "react-router-dom";
import { BLOG_POSTS } from "@/data/blog-posts";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { useEffect, useState, isValidElement } from "react";
import BackToTop from "@/components/BackToTop";

// ── Helpers ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Recursively collapses React children to a plain string (for heading IDs). */
function nodeToText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (isValidElement(node)) return nodeToText((node.props as any).children);
  return "";
}

interface TocEntry {
  level: number;  // 1–4
  text: string;
  id: string;
}

/** Parse headings (h1–h4) from raw Markdown. */
function extractToc(markdown: string): TocEntry[] {
  const toc: TocEntry[] = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(/^(#{1,4})\s+(.+)/);
    if (m) {
      // Strip inline markdown syntax so ID matches what React renders
      const text = m[2].replace(/[*_`[\]]/g, "").trim();
      toc.push({ level: m[1].length, text, id: slugify(text) });
    }
  }
  return toc;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");

  const toc = post ? extractToc(post.content) : [];

  // Scroll to top on mount / slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Reading-progress bar
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Highlight active TOC entry while scrolling
  useEffect(() => {
    if (!toc.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [post?.content, toc]); // added toc to dependencies

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Post not found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  /** Derive a stable anchor ID from rendered heading children. */
  const headingId = (children: React.ReactNode) =>
    slugify(nodeToText(children));

  return (
    <main className="min-h-screen py-12 md:py-20">
      {/* ── Reading progress bar ── */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-primary z-50 transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-12">

          {/* ── Sticky TOC sidebar ── */}
          {toc.length > 0 && (
            <aside className="hidden xl:block w-52 flex-shrink-0">
              <div className="sticky top-10 pr-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Contents
                </p>
                <nav aria-label="Table of contents">
                  <ul className="space-y-1">
                    {toc.map(({ level, text, id }) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(id)
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={[
                            "block text-sm leading-snug py-0.5 transition-colors",
                            level <= 2
                              ? "font-semibold"
                              : level === 3
                              ? "pl-3 font-normal"
                              : "pl-5 font-normal",
                            activeId === id
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                        >
                          {text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}

          {/* ── Article ── */}
          <article className="min-w-0 flex-1 max-w-3xl">

            {/* ── Back to home ── */}
            <button
              onClick={() => navigate("/#blog")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground active:scale-95 transition-all mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to home
            </button>

            {/* ── Date ── */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {/* ── Title ── */}
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-[1.15] text-balance mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {post.title}
            </h1>

            {/* ── Summary (from YAML frontmatter) ── */}
            {post.summary && (
              <p className="text-base leading-relaxed text-muted-foreground/75 mb-5">
                {post.summary}
              </p>
            )}

            {/* ── Tags (from YAML frontmatter) ── */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <hr className="border-border mb-8" />

            {/* ── Content ── */}
            <div className="prose-custom">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                  h1: ({ children }) => (
                    <h1
                      id={headingId(children)}
                      className="text-3xl font-bold text-foreground mt-12 mb-4"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      id={headingId(children)}
                      className="text-2xl font-semibold text-foreground mt-10 mb-4"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      id={headingId(children)}
                      className="text-xl font-semibold text-foreground mt-8 mb-3"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4
                      id={headingId(children)}
                      className="text-lg font-semibold text-foreground mt-6 mb-2"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-base leading-relaxed text-muted-foreground my-3 text-pretty">
                      {children}
                    </p>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1.5 my-4 text-muted-foreground">
                      {children}
                    </ol>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1.5 my-4 text-muted-foreground">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="mt-1.5">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary/30 pl-4 my-4 text-muted-foreground italic">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-foreground font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  del: ({ children }) => <del>{children}</del>,
                  
                  // FIX: Separate `pre` and `code` rendering 
                  pre: ({ children, ...props }) => (
                    <pre className="my-4 p-4 bg-muted rounded-lg text-sm overflow-x-auto font-mono" {...props}>
                      {children}
                    </pre>
                  ),
                  code: ({ node, className, children, ...props }: any) => {
                    // Detect if this is block code via language class or presence of newlines
                    const isBlock = /language-(\w+)/.exec(className || "") || String(children).includes("\n");
                    
                    return isBlock ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full text-sm border-collapse border border-border">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-muted text-foreground">
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="text-muted-foreground">
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="border-b border-border">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 text-left font-semibold border-r border-border last:border-r-0">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 border-r border-border last:border-r-0">
                      {children}
                    </td>
                  ),
                  a: ({ href, title, children }) => (
                    <a
                      href={href}
                      title={title}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline underline-offset-4"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt, title }) => (
                    <figure className="my-8 flex flex-col items-center">
                      <img
                        src={src}
                        alt={alt}
                        title={title}
                        className="rounded-lg max-w-full h-auto object-cover"
                        loading="lazy"
                      />
                      {alt && (
                        <figcaption className="mt-3 text-sm text-muted-foreground text-center text-balance italic">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            <hr className="border-border mt-12 mb-6" />

            {/* ── All articles ── */}
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
            >
              <ArrowLeft className="w-4 h-4" /> All articles
            </button>
          </article>

        </div>
      </div>
      <BackToTop />
    </main>
  );
}