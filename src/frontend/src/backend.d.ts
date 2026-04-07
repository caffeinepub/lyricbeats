import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type CompositionId = bigint;
export interface Composition {
    id: CompositionId;
    title: string;
    lyrics: string;
    createdAt: bigint;
    audioUrl?: string;
}
export interface CreateCompositionRequest {
    title: string;
    lyrics: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    createComposition(req: CreateCompositionRequest): Promise<Composition>;
    deleteComposition(id: CompositionId): Promise<boolean>;
    getComposition(id: CompositionId): Promise<Composition | null>;
    listCompositions(): Promise<Array<Composition>>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCompositionTitle(id: CompositionId, title: string): Promise<boolean>;
}
