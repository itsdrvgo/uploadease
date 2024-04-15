import { ExtendedFile } from "@/types";
import { create } from "zustand";

interface VideoState {
    video: ExtendedFile | null;
    setVideo: (video: ExtendedFile | null) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
    video: null,
    setVideo: (video) => set({ video }),
}));
