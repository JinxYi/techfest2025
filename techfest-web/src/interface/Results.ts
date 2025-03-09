export interface ImageReport {
    Artificial: number;
    Deepfake: number;
    Real: number;
} 

export interface VideoReport {
    deepfake_probability: number;
    video_label: string
}