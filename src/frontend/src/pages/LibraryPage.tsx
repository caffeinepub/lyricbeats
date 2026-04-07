import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Check, Loader2, Music, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AudioPlayer } from "../components/AudioPlayer";
import {
  useCompositions,
  useDeleteComposition,
  useUpdateTitle,
} from "../hooks/useCompositions";
import type { Composition } from "../types";

export function LibraryPage() {
  const { data: compositions, isLoading, isError } = useCompositions();
  const deleteComposition = useDeleteComposition();

  if (isLoading) return <LibraryLoading />;
  if (isError) return <LibraryError />;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Library
        </h1>
        <p className="mt-1.5 font-body text-sm text-muted-foreground">
          {compositions?.length ?? 0} composition
          {compositions?.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Empty state */}
      {compositions?.length === 0 && (
        <div
          className="flex flex-col items-center gap-4 rounded-[3px] border border-dashed border-border bg-card py-20 text-center"
          data-ocid="empty-state-library"
        >
          <Music className="h-10 w-10 text-muted-foreground opacity-30" />
          <div>
            <p className="font-display text-base font-semibold text-foreground">
              Your library is empty
            </p>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Head to{" "}
              <Link to="/" className="text-primary hover:underline">
                Create
              </Link>{" "}
              to generate your first track.
            </p>
          </div>
        </div>
      )}

      {/* Composition list */}
      {compositions && compositions.length > 0 && (
        <div className="space-y-2" data-ocid="composition-list">
          {compositions.map((comp) => (
            <CompositionRow
              key={comp.id.toString()}
              composition={comp}
              onDelete={async (id) => {
                await deleteComposition.mutateAsync(id);
                toast.success("Composition deleted.");
              }}
              isDeleting={
                deleteComposition.isPending &&
                deleteComposition.variables === comp.id
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CompositionRowProps {
  composition: Composition;
  onDelete: (id: bigint) => void;
  isDeleting: boolean;
}

function CompositionRow({
  composition,
  onDelete,
  isDeleting,
}: CompositionRowProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(composition.title);
  const updateTitle = useUpdateTitle();

  const date = new Date(Number(composition.createdAt));
  const dateStr = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const handleSaveTitle = async () => {
    if (titleValue.trim() && titleValue !== composition.title) {
      await updateTitle.mutateAsync({
        id: composition.id,
        title: titleValue.trim(),
      });
      toast.success("Title updated.");
    }
    setEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setTitleValue(composition.title);
    setEditingTitle(false);
  };

  return (
    <div
      className="rounded-[3px] border border-border bg-card transition-smooth hover:border-border/80"
      data-ocid="composition-row"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Title or edit input */}
        <div className="min-w-0 flex-1">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") handleCancelTitle();
                }}
                className="h-7 rounded-[2px] border-border bg-background font-display text-sm font-semibold"
                data-ocid="edit-title-input"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                aria-label="Save title"
                className="text-primary transition-colors duration-200 hover:opacity-75"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCancelTitle}
                aria-label="Cancel editing"
                className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="truncate font-display text-sm font-semibold text-foreground">
              {composition.title}
            </p>
          )}
          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
            {dateStr}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Edit title */}
          <button
            type="button"
            onClick={() => setEditingTitle(true)}
            aria-label="Edit title"
            data-ocid="btn-edit-title"
            className="flex h-7 w-7 items-center justify-center rounded-[2px] text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(composition.id)}
            disabled={isDeleting}
            aria-label="Delete composition"
            data-ocid="btn-delete"
            className="flex h-7 w-7 items-center justify-center rounded-[2px] text-muted-foreground transition-smooth hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Play toggle */}
          <button
            type="button"
            onClick={() => setShowPlayer((v) => !v)}
            disabled={!composition.audioUrl}
            aria-label={showPlayer ? "Collapse player" : "Expand player"}
            data-ocid="btn-play-row"
            className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-primary/10 text-primary transition-smooth hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
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
      </div>

      {/* Expandable player */}
      {showPlayer && composition.audioUrl && (
        <div className="border-t border-border px-4 pb-3 pt-2">
          <AudioPlayer src={composition.audioUrl} title={composition.title} />
        </div>
      )}
    </div>
  );
}

function LibraryLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Skeleton className="mb-2 h-9 w-32 rounded-[3px]" />
      <Skeleton className="mb-8 h-4 w-48 rounded-[3px]" />
      <div className="space-y-2">
        {(["s1", "s2", "s3", "s4", "s5"] as const).map((k) => (
          <Skeleton key={k} className="h-16 w-full rounded-[3px]" />
        ))}
      </div>
    </div>
  );
}

function LibraryError() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 text-center">
      <p className="font-display text-base font-semibold text-destructive">
        Failed to load library.
      </p>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        Please refresh the page.
      </p>
      <Button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-4 rounded-[3px]"
        variant="outline"
      >
        Retry
      </Button>
    </div>
  );
}
