import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string | null;
  title?: string;
  className?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ src, title, className = "" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const prevSrcRef = useRef<string | null | undefined>(undefined);

  // Reset playback state when src changes (using ref to avoid exhaustive-deps)
  if (prevSrcRef.current !== src) {
    prevSrcRef.current = src;
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  };

  const handleEnded = () => setIsPlaying(false);

  const handleSeek = (values: number[]) => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    audio.currentTime = values[0];
    setProgress(values[0]);
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    setMuted(values[0] === 0);
  };

  const toggleMute = () => setMuted((m) => !m);

  return (
    <div
      className={`flex items-center gap-3 rounded-[3px] border border-border bg-card px-4 py-3 ${className}`}
      data-ocid="audio-player"
    >
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        >
          <track kind="captions" />
        </audio>
      )}

      {/* Play/Pause */}
      <button
        type="button"
        onClick={handlePlayPause}
        disabled={!src}
        aria-label={isPlaying ? "Pause" : "Play"}
        data-ocid="player-play-pause"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-primary text-primary-foreground transition-smooth hover:opacity-90 disabled:opacity-30"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>

      {/* Track info + progress */}
      <div className="min-w-0 flex-1">
        {title && (
          <p className="mb-1.5 truncate font-display text-xs font-semibold tracking-wide text-foreground">
            {title}
          </p>
        )}
        <div className="flex items-center gap-2">
          <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">
            {formatTime(progress)}
          </span>
          <Slider
            min={0}
            max={duration || 100}
            step={0.1}
            value={[progress]}
            onValueChange={handleSeek}
            disabled={!src}
            className="flex-1"
            data-ocid="player-progress"
          />
          <span className="w-8 font-mono text-[10px] text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="shrink-0 text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          {muted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[muted ? 0 : volume]}
          onValueChange={handleVolumeChange}
          className="w-16"
          data-ocid="player-volume"
        />
      </div>
    </div>
  );
}
