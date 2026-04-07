import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { Loader2, Music, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AudioPlayer } from "../components/AudioPlayer";
import {
  useCompositions,
  useCreateComposition,
} from "../hooks/useCompositions";
import type { Composition } from "../types";

export function CreatePage() {
  const [lyrics, setLyrics] = useState("");
  const [title, setTitle] = useState("");
  const [lastCreated, setLastCreated] = useState<Composition | null>(null);

  const { data: compositions } = useCompositions();
  const createComposition = useCreateComposition();

  const handleGenerate = async () => {
    if (!lyrics.trim()) {
      toast.error("Please enter some lyrics first.");
      return;
    }
    try {
      const result = await createComposition.mutateAsync({
        title: title.trim() || "Untitled Composition",
        lyrics: lyrics.trim(),
      });
      setLastCreated(result);
      toast.success("Composition created — ready to play!");
    } catch {
      toast.error("Failed to create composition. Try again.");
    }
  };

  const recentCount = compositions?.length ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Page headline */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Create
        </h1>
        <p className="mt-1.5 font-body text-sm text-muted-foreground">
          Type your lyrics below and let AI compose the music.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-[3px] border border-border bg-card p-6">
        {/* Title field */}
        <div className="mb-4">
          <Label
            htmlFor="comp-title"
            className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Track Title
          </Label>
          <Input
            id="comp-title"
            placeholder="Midnight Frequency"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-[3px] border-border bg-background font-body text-sm focus-visible:ring-primary"
            data-ocid="input-title"
          />
        </div>

        {/* Lyrics textarea */}
        <div className="mb-5">
          <Label
            htmlFor="lyrics-input"
            className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Lyrics
          </Label>
          <Textarea
            id="lyrics-input"
            placeholder="Enter your lyrics here… Let AI create the perfect melody."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={10}
            className="resize-none rounded-[3px] border-border bg-background font-body text-sm leading-relaxed focus-visible:ring-primary"
            data-ocid="input-lyrics"
          />
          <p className="mt-1.5 text-right font-mono text-[11px] text-muted-foreground">
            {lyrics.length} chars
          </p>
        </div>

        {/* Generate button */}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={createComposition.isPending || !lyrics.trim()}
            className="gap-2 rounded-[3px] bg-primary font-display text-sm font-semibold tracking-wide text-primary-foreground transition-smooth hover:opacity-90 disabled:opacity-50"
            data-ocid="btn-generate"
          >
            {createComposition.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Composing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Music
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Inline audio player — appears after generation */}
      {lastCreated?.audioUrl && (
        <div className="mt-4" data-ocid="player-result">
          <AudioPlayer src={lastCreated.audioUrl} title={lastCreated.title} />
        </div>
      )}

      {/* Quick-access recent compositions */}
      {recentCount > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-foreground">
              My Compositions
            </h2>
            <Link
              to="/library"
              className="font-display text-xs font-medium text-primary transition-colors duration-200 hover:opacity-75"
              data-ocid="link-library"
            >
              View all →
            </Link>
          </div>

          {compositions && compositions.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 rounded-[3px] border border-dashed border-border bg-card py-12 text-center"
              data-ocid="empty-state-compositions"
            >
              <Music className="h-8 w-8 text-muted-foreground opacity-40" />
              <p className="font-body text-sm text-muted-foreground">
                No compositions yet. Generate your first track above!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {compositions?.slice(0, 4).map((comp) => (
                <RecentCompositionCard
                  key={comp.id.toString()}
                  composition={comp}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RecentCompositionCard({ composition }: { composition: Composition }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const date = new Date(Number(composition.createdAt));
  const dateStr = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <div
      className="group rounded-[3px] border border-border bg-card transition-smooth hover:border-primary/30 hover:bg-secondary"
      data-ocid="composition-card"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-foreground">
            {composition.title}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
            {dateStr}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowPlayer((v) => !v)}
          disabled={!composition.audioUrl}
          aria-label={
            showPlayer
              ? `Collapse ${composition.title}`
              : `Play ${composition.title}`
          }
          className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] bg-primary/10 text-primary transition-smooth hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
          data-ocid="btn-play-card"
        >
          <svg
            className="h-3.5 w-3.5 fill-current"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M3 2.5l11 5.5-11 5.5V2.5z" />
          </svg>
        </button>
      </div>
      {showPlayer && composition.audioUrl && (
        <div className="border-t border-border px-4 pb-3 pt-2">
          <AudioPlayer src={composition.audioUrl} title={composition.title} />
        </div>
      )}
    </div>
  );
}
