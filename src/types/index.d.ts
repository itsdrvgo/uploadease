import { Icons } from "@/components/icons/icons";
import {
    DEFAULT_FEATURES,
    ROLES,
    VALID_VIDEO_UPLOAD_STEPS,
} from "@/config/const";
import {
    CachedOrgClientData,
    CachedOrgData,
} from "@/lib/validation/cache/organization";
import { CachedTemplateData } from "@/lib/validation/cache/template";
import { ChangeEvent, DragEvent, HTMLAttributes, ReactNode } from "react";

export type SiteConfig = {
    name: string;
    description: string;
    ogImage: string;
    keywords?: string[];
    links?: {
        [key: string]: string;
    };
};

export type GenericProps = HTMLAttributes<HTMLElement>;
export interface LayoutProps {
    children: ReactNode;
}

export type NavItem = {
    title: string;
    href: string;
    isExternal?: boolean;
    isAnchorVisible?: boolean;
    icon?: keyof typeof Icons;
};

export type Role = (typeof ROLES)[number];
export type Features = typeof DEFAULT_FEATURES;

export type UploadEvent<T = HTMLDivElement> = DragEvent<T> | ChangeEvent<T>;

export type VideoUploadStep = (typeof VALID_VIDEO_UPLOAD_STEPS)[number];

export type ExtendedFile = {
    url: string;
    file: File;
};

export interface YTCategory {
    name: string;
    id: string;
}

type OrgDataPrivate = {
    type: "creator";
    org: CachedOrgData;
};

type OrgDataPublic = {
    type: "others";
    org: CachedOrgClientData;
};

export type OrgData = OrgDataPrivate | OrgDataPublic;

type OrgDataWithTemplatePrivate = {
    type: "creator";
    org: CachedOrgData & {
        template: CachedTemplateData | null;
    };
};

type OrgDataWithTemplatePublic = {
    type: "others";
    org: CachedOrgClientData & {
        template: CachedTemplateData | null;
    };
};

type OrgWithTemplateData =
    | OrgDataWithTemplatePrivate
    | OrgDataWithTemplatePublic;

declare module "@supabase/gotrue-js" {
    interface UserMetadata {
        avatar_url?: string;
        email: string;
        email_verified: boolean;
        full_name: string;
        iss: string;
        name: string;
        phone_verified: boolean;
        picture?: string;
        provider_id: string;
        sub: string;
    }
}
