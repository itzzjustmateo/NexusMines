import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "Changelog | NexusMines",
  description: "Recent updates and improvements to the NexusMines platform.",
};

export default function ChangelogPage() {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");
  let content = "No changelog found.";
  try {
    content = fs.readFileSync(changelogPath, "utf-8");
  } catch (err) {
    console.error("Error reading CHANGELOG.md:", err);
  }

  // Split into sections based on version tracking (## [Version])
  // This allows us to highlight the "Latest Update" uniquely.
  const sections = content.split(/(?=## \[)/g);
  const headerContent = sections[0] || content;
  const versions = sections.slice(1);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20 overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] opacity-40 animate-in fade-in duration-1000 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            Latest <span className="text-brand-accent">Updates</span>
          </h1>
          <div className="prose prose-zinc dark:prose-invert mx-auto text-lg text-zinc-600 dark:text-zinc-400">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {headerContent.replace("# Changelog", "").trim()}
            </ReactMarkdown>
          </div>
        </div>

        <div className="space-y-12">
          {versions.map((versionBlock, index) => {
            const isLatest = index === 0;
            return (
              <div 
                key={index}
                className={`animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col`}
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
              >
                <div className={`p-8 sm:p-10 rounded-3xl border backdrop-blur-md shadow-sm transition-all duration-300 ${
                  isLatest 
                    ? "bg-white/70 dark:bg-zinc-900/70 border-brand-accent/30 shadow-[0_0_40px_rgba(var(--brand-accent-rgb),0.05)] relative overflow-hidden ring-1 ring-brand-accent/20" 
                    : "bg-white/40 dark:bg-zinc-950/40 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/60 dark:hover:bg-zinc-900/60"
                }`}>
                  {isLatest && (
                    <div className="absolute top-0 right-0 bg-brand-accent text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl tracking-widest uppercase shadow-sm">
                      Latest Release
                    </div>
                  )}
                  <div className="prose prose-zinc dark:prose-invert prose-headings:font-bold max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: ({ ...props }) => {
                          const text = String(props.children);
                          // Extract [1.1.2] - 2026-03-07 into separate elements
                          const matchMatch = text.match(/\[(.*?)\](?: - (.*))?/);
                          if (matchMatch) {
                            const versionText = matchMatch[1];
                            const isUnreleased = versionText.toLowerCase() === "unreleased";
                            return (
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-8 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
                                <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white m-0 tracking-tight">
                                  {isUnreleased ? versionText : `v${versionText}`}
                                </h2>
                                {matchMatch[2] && (
                                  <span className="text-sm font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
                                    {matchMatch[2]}
                                  </span>
                                )}
                              </div>
                            );
                          }
                          return <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2" {...props} />;
                        },
                        h3: ({ ...props }) => {
                          const type = String(props.children).toLowerCase();
                          let colorClass = "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
                          
                          if (type.includes("added")) colorClass = "bg-emerald-50 text-emerald-600 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
                          else if (type.includes("fixed")) colorClass = "bg-blue-50 text-blue-600 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
                          else if (type.includes("changed")) colorClass = "bg-amber-50 text-amber-600 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
                          else if (type.includes("removed")) colorClass = "bg-red-50 text-red-600 border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";

                          return (
                            <h3 className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border mt-6 mb-3 ${colorClass}`}>
                              {props.children}
                            </h3>
                          );
                        },
                        ul: ({ ...props }) => (
                          <ul className="space-y-3 my-4 list-none pl-0" {...props} />
                        ),
                        li: ({ ...props }) => (
                          <li className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 text-base leading-relaxed">
                            <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-brand-accent/50 shrink-0" />
                            <span>{props.children}</span>
                          </li>
                        ),
                        a: ({ ...props }) => (
                          <a className="text-brand-accent hover:text-brand-accent/80 transition-colors font-medium underline decoration-brand-accent/30 underline-offset-4" {...props} />
                        ),
                        code: ({ inline, ...props }: any) => {
                          if (inline) {
                            return <code className="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 text-sm font-medium text-brand-accent" {...props} />;
                          }
                          return <code className="block bg-zinc-950 text-zinc-300 p-4 rounded-xl text-sm overflow-x-auto my-4 border border-zinc-800 shadow-inner" {...props} />;
                        }
                      }}
                    >
                      {versionBlock}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
