import Mux from "@mux/mux-node";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const mux = new Mux();

export const muxRouter = createTRPCRouter({
    getMuxUploadEndpoint: protectedProcedure.query(async () => {
        const directUpload = await mux.video.uploads.create({
            cors_origin: "*",
            new_asset_settings: {
                playback_policy: ["public"],
            },
        });

        return {
            directUpload,
        };
    }),
});
