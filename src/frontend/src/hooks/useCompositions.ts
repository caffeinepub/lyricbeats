import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Composition, CreateCompositionRequest } from "../types";

// Local state store for demo — real backend wired when actor methods are available
const localStore: Composition[] = [
  {
    id: 1n,
    title: "Midnight Frequency",
    lyrics:
      "Signals lost between the stars\nReaching through the dark to find your light\nEvery frequency aligned\nPulses soft like breathing at night",
    audioUrl: null,
    createdAt: BigInt(Date.now() - 86400000),
  },
  {
    id: 2n,
    title: "Trade the Track",
    lyrics:
      "We trade in moments, not in time\nEach melody a borrowed rhyme\nThe studio at 3 AM\nWhere silence learns to speak again",
    audioUrl: null,
    createdAt: BigInt(Date.now() - 172800000),
  },
  {
    id: 3n,
    title: "Restand Title",
    lyrics:
      "Found the rhythm in the static\nFound the words I couldn't say\nSomething magic, something frantic\nCarrying me through the day",
    audioUrl: null,
    createdAt: BigInt(Date.now() - 259200000),
  },
];

let nextId = 4n;

export function useCompositions() {
  return useQuery<Composition[]>({
    queryKey: ["compositions"],
    queryFn: async () => [...localStore],
    staleTime: 0,
  });
}

export function useComposition(id: bigint) {
  return useQuery<Composition | null>({
    queryKey: ["composition", id.toString()],
    queryFn: async () => localStore.find((c) => c.id === id) ?? null,
  });
}

export function useCreateComposition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateCompositionRequest): Promise<Composition> => {
      await new Promise((r) => setTimeout(r, 1800));
      const newComp: Composition = {
        id: nextId++,
        title: req.title || "Untitled Composition",
        lyrics: req.lyrics,
        audioUrl: null,
        createdAt: BigInt(Date.now()),
      };
      localStore.unshift(newComp);
      return newComp;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["compositions"] });
    },
  });
}

export function useDeleteComposition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<boolean> => {
      const idx = localStore.findIndex((c) => c.id === id);
      if (idx !== -1) localStore.splice(idx, 1);
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["compositions"] });
    },
  });
}

export function useUpdateTitle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
    }: {
      id: bigint;
      title: string;
    }): Promise<boolean> => {
      const comp = localStore.find((c) => c.id === id);
      if (comp) comp.title = title;
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["compositions"] });
    },
  });
}
