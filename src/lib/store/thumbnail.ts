import { ExtendedFile } from "@/types";
import { create } from "zustand";

interface ThumbnailState {
    thumbnail: ExtendedFile | null;
    setThumbnail: (thumbnail: ExtendedFile | null) => void;
}

export const useThumbnailStore = create<ThumbnailState>((set) => ({
    thumbnail: null,
    setThumbnail: (thumbnail) => set({ thumbnail }),
}));
