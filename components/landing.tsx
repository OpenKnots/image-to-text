import Converter from "@/components/converter";

export function Landing() {
  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="glass-panel rounded-3xl px-6 py-8 sm:px-10 sm:py-10 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Image to Text
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
            Clean extraction. Instant results.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Drop any image and capture crisp text in seconds.
          </p>
        </div>

        <Converter />

        <div className="glass-divider" />

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="glass-subtle rounded-full px-4 py-2">
            No storage
          </span>
          <span className="glass-subtle rounded-full px-4 py-2">
            Paste anywhere
          </span>
          <span className="glass-subtle rounded-full px-4 py-2">
            Export-ready
          </span>
        </div>
      </div>
    </section>
  );
}

export default Landing;
