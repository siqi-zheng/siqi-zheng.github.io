import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { BLOG_POSTS } from "@/data/blog-posts";
import { Calendar, ArrowRight, ArrowLeft, X } from "lucide-react";

export default function BlogListPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Derive all unique tags sorted alphabetically
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    BLOG_POSTS.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, []);

  // Toggle a tag on/off
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter posts — show all when no tags selected
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return BLOG_POSTS;
    return BLOG_POSTS.filter((post) =>
      selectedTags.every((tag) => post.tags.includes(tag))
    );
  }, [selectedTags]);

  return (
    <main className="min-h-screen py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground active:scale-95 transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6 text-balance"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Blog
        </h1>

        {/* Tag filter strip */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {tag}
                  {isActive && <X className="w-3 h-3" />}
                </button>
              );
            })}

            {/* Clear all button — only visible when filters are active */}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-200 active:scale-95"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>

          {/* Results count — shown only when filtering */}
          {selectedTags.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              {filteredPosts.length === 0
                ? "No posts match the selected tags."
                : `Showing ${filteredPosts.length} of ${BLOG_POSTS.length} post${filteredPosts.length !== 1 ? "s" : ""}`}
            </p>
          )}
        </div>

        {/* Post list */}
        <div className="space-y-5">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block w-full text-left p-5 rounded-xl border border-border bg-card hover:shadow-md active:scale-[0.98] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <h2
                      className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1.5 text-pretty">
                      {post.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 sm:pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary font-medium">
                  Read article{" "}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-sm">No posts match the selected tags.</p>
              <button
                onClick={() => setSelectedTags([])}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}