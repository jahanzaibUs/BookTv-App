export type PlayerMode = "video" | "audio";

export interface PlayerState {
  isVisible: boolean;
  ref: any;
  mode: PlayerMode;
  url: string;
  isFullscreen?: boolean;
  isPlaying: boolean;
  rateId: number;
  positionMillis: number;
  durationMillis: number;
  chapterIndex: number;
  chapterId: number;
}
