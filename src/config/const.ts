import { YTCategory } from "../types";

// GENEREL
export const DEFAULT_PROFILE_IMAGE_URL = "https://img.clerk.com/preview.png";
export const DEFAULT_ERROR_MESSAGE = "Something went wrong, try again later!";
export const SIGNIN_PAGE = "/auth/signin";
export const DEFAULT_IP = "127.0.0.1";

// ORGANIZATIONS
export const ROLES = ["creator", "editor"] as const;
export const DEFAULT_FEATURES = {
    isInvitePaused: false,
};

// VIDEOS
export const VALID_VIDEO_UPLOAD_STEPS = ["upload", "meta", "finish"] as const;

// YOUTUBE

export const ytCategories: YTCategory[] = [
    {
        name: "Autos & Vehicles",
        id: "2",
    },
    {
        name: "Comedy",
        id: "23",
    },
    {
        name: "Education",
        id: "27",
    },
    {
        name: "Entertainment",
        id: "24",
    },
    {
        name: "Film & Animation",
        id: "1",
    },
    {
        name: "Gaming",
        id: "20",
    },
    {
        name: "Howto & Style",
        id: "26",
    },
    {
        name: "Music",
        id: "10",
    },
    {
        name: "News & Politics",
        id: "25",
    },
    {
        name: "Nonprofits & Activism",
        id: "29",
    },
    {
        name: "People & Blogs",
        id: "22",
    },
    {
        name: "Pets & Animals",
        id: "15",
    },
    {
        name: "Science & Technology",
        id: "28",
    },
    {
        name: "Sports",
        id: "17",
    },
    {
        name: "Travel & Events",
        id: "19",
    },
];
