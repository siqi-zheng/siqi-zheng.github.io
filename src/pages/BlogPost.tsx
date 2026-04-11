import { useParams, useNavigate } from "react-router-dom";
import { BLOG_POSTS } from "@/data/blog-posts";
import { ArrowLeft, Calendar } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css"; // CRITICAL: Math will not display correctly without this
import { useEffect } from "react";

function renderMarkdown(md: string) {
  const lines = md.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  const inline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const linkOrImageRe = /(!?)\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g;
    
    let last = 0;
    let m: RegExpExecArray | null;
    
    while ((m = linkOrImageRe.exec(text)) !== null) {
      if (m.index > last) parts.push(formatInline(text.slice(last, m.index)));
      
      const isImage = m[1] === "!";
      const textOrAlt = m[2];
      const url = m[3];
      const title = m[4];

      if (isImage) {
        // Fallback for inline images (if an image shares a line with text)
        // Kept as <img> so it doesn't break paragraph layouts
        parts.push(
          <img 
            key={m.index} 
            src={url} 
            alt={textOrAlt} 
            title={title}
            className="inline-block rounded-lg max-w-full h-auto object-cover my-2 align-middle" 
            loading="lazy"
          />
        );
      } else {
        parts.push(
          <a 
            key={m.index} 
            href={url} 
            title={title}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline underline-offset-4"
          >
            {textOrAlt}
          </a>
        );
      }
      last = m.index + m[0].length;
    }
    
    if (last < text.length) parts.push(formatInline(text.slice(last)));
    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  const formatInline = (text: string): React.ReactNode => {
    return text
      .split(/(\*\*[^*]+\*\*|\*[^*]+\*|\$[^$]+\$)/)
      .map((seg, idx) => {
        if (seg.startsWith("**") && seg.endsWith("**"))
          return <strong key={idx} className="text-foreground font-semibold">{seg.slice(2, -2)}</strong>;
        if (seg.startsWith("*") && seg.endsWith("*"))
          return <em key={idx}>{seg.slice(1, -1)}</em>;
        if (seg.startsWith("$") && seg.endsWith("$")) {
          try {
            const html = katex.renderToString(seg.slice(1, -1), { displayMode: false, throwOnError: false });
            return <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return seg;
          }
        }
        return seg;
      });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") { i++; continue; }

    // NEW: Handle block-level images (image on its own line)
    const blockImgMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/);
    if (blockImgMatch) {
      const textOrAlt = blockImgMatch[1];
      const url = blockImgMatch[2];
      const title = blockImgMatch[3];
      
      // Use the Title for the caption if it exists. 
      // If no title, use alt text (ignoring if they literally typed "alt")
      const caption = textOrAlt

      elements.push(
        <figure key={i} className="my-8 flex flex-col items-center">
          <img 
            src={url} 
            alt={textOrAlt} 
            title={title}
            className="rounded-lg max-w-full h-auto object-cover" 
            loading="lazy"
          />
          {caption && (
            <figcaption className="mt-3 text-sm text-muted-foreground text-center text-balance italic">
              {caption}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-2xl font-semibold text-foreground mt-10 mb-4" style={{ fontFamily: "var(--font-serif)" }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-xl font-semibold text-foreground mt-8 mb-3" style={{ fontFamily: "var(--font-serif)" }}>{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-primary/30 pl-4 my-4 text-muted-foreground italic">
          {inline(line.slice(2))}
        </blockquote>
      );
    } else if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-muted-foreground">
          {items.map((item, j) => <li key={j}>{inline(item)}</li>)}
        </ol>
      );
      continue;
    } else if (line.trim().startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-muted-foreground">
          {items.map((item, j) => <li key={j}>{inline(item)}</li>)}
        </ul>
      );
      continue;
    } else if (line.trim().startsWith("$$")) {
      let mathExpr = line.trim().replace(/^\$\$/, "");
      if (mathExpr.endsWith("$$") && line.trim() !== "$$") {
        mathExpr = mathExpr.replace(/\$\$$/, "");
      } else {
        i++;
        while (i < lines.length && !lines[i].trim().includes("$$")) {
          mathExpr += "\n" + lines[i];
          i++;
        }
        if (i < lines.length) {
          mathExpr += "\n" + lines[i].replace(/\$\$/, "");
        }
      }

      try {
        const html = katex.renderToString(mathExpr, { displayMode: true, throwOnError: false });
        elements.push(
          <div key={i} className="my-6 overflow-x-auto text-foreground flex justify-center" dangerouslySetInnerHTML={{ __html: html }} />
        );
      } catch (err) {
        elements.push(
          <pre key={i} className="my-4 p-4 bg-red-950/20 text-red-500 rounded-lg text-sm overflow-x-auto font-mono">
            {mathExpr}
          </pre>
        );
      }
    } else {
      elements.push(
        <p key={i} className="text-base leading-relaxed text-muted-foreground my-3 text-pretty">
          {inline(line)}
        </p>
      );
    }
    i++;
  }

  return elements;
}

export default function BlogPost() {
  
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  useEffect(() => {
      window.scrollTo(0, 0);
    }, [slug]);
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Post not found</h1>
          <button onClick={() => navigate("/")} className="text-primary hover:underline">
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 md:py-20">
      <article className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => navigate("/#blog")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground active:scale-95 transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="w-4 h-4" />
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-[1.15] text-balance mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <hr className="border-border mb-8" />

        <div className="prose-custom">{renderMarkdown(post.content)}</div>

        <hr className="border-border mt-12 mb-6" />
        <button
          onClick={() => navigate("/#blog")}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" /> All articles
        </button>
      </article>
    </main>
  );
}
