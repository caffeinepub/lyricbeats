export interface Composition {
  id: bigint;
  title: string;
  lyrics: string;
  audioUrl: string | null;
  createdAt: bigint;
}

export interface CreateCompositionRequest {
  title: string;
  lyrics: string;
}
