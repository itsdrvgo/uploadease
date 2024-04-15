import { DEFAULT_FEATURES, DEFAULT_PROFILE_IMAGE_URL } from "@/config/const";
import { Features, Role } from "@/types";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
    index,
    integer,
    json,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { generateId } from "../utils";

// SCHEMAS

export const users = pgTable(
    "users",
    {
        id: text("id").notNull().unique().primaryKey(),
        username: text("username").notNull().unique(),
        email: text("email").notNull().unique(),
        avatar: text("avatar").notNull().default(DEFAULT_PROFILE_IMAGE_URL),
        plan: integer("plan").notNull().default(0),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => {
        return {
            emailIdx: uniqueIndex("email_idx").on(table.email),
            usernameIdx: uniqueIndex("username_idx").on(table.username),
        };
    }
);

export const organizations = pgTable(
    "organizations",
    {
        id: text("id")
            .notNull()
            .unique()
            .primaryKey()
            .$defaultFn(() => generateId()),
        name: text("name").notNull(),
        passcode: text("passcode").notNull(),
        inviteCode: text("invite_code")
            .notNull()
            .$defaultFn(() => generateId(10)),
        creatorId: text("creator_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),
        features: json("features")
            .notNull()
            .default(JSON.stringify(DEFAULT_FEATURES))
            .$type<Features>(),
        memberCount: integer("member_count").notNull().default(1),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => {
        return {
            creatorIdx: index("creator_idx").on(table.creatorId),
            inviteCodeIdx: index("invite_code_idx").on(table.inviteCode),
            idInviteCodeIdx: uniqueIndex("id_invite_code_idx").on(
                table.id,
                table.inviteCode
            ),
        };
    }
);

export const memberships = pgTable(
    "memberships",
    {
        id: text("id")
            .notNull()
            .unique()
            .primaryKey()
            .$defaultFn(() => generateId()),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),
        orgId: text("org_id")
            .notNull()
            .references(() => organizations.id, {
                onDelete: "cascade",
            }),
        role: text("role").notNull().default("editor").$type<Role>(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => {
        return {
            userOrgIdx: uniqueIndex("user_org_idx").on(
                table.userId,
                table.orgId
            ),
        };
    }
);

export const videos = pgTable(
    "videos",
    {
        id: text("id")
            .notNull()
            .unique()
            .primaryKey()
            .$defaultFn(() => generateId()),
        title: text("title").notNull(),
        description: text("description").notNull(),
        thumbnail: text("thumbnail").notNull(),
        videoUrl: text("video_url").notNull(),
        categoryId: integer("category_id").notNull(),
        tags: text("tags").notNull(),
        privacy: text("privacy").notNull().default("private"),
        editorId: text("editor_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),
        orgId: text("org_id")
            .notNull()
            .references(() => organizations.id, {
                onDelete: "cascade",
            }),
        status: text("status").notNull().default("draft"),
        uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => {
        return {
            titleIdx: index("title_idx").on(table.title),
            editorIdx: index("editor_idx").on(table.editorId),
            orgIdx: index("org_idx").on(table.orgId),
        };
    }
);

export const templates = pgTable(
    "templates",
    {
        id: text("id")
            .notNull()
            .unique()
            .primaryKey()
            .$defaultFn(() => generateId()),
        orgId: text("org_id")
            .notNull()
            .references(() => organizations.id, {
                onDelete: "cascade",
            }),
        title: text("title").notNull(),
        description: text("description").notNull(),
        categoryId: integer("category_id").notNull(),
        tags: json("tags")
            .notNull()
            .default(JSON.stringify([]))
            .$type<string[]>(),
    },
    (table) => {
        return {
            orgIdx: index("org_template_idx").on(table.orgId),
        };
    }
);

// RELATIONS

export const userRelations = relations(users, ({ one, many }) => ({
    organizations: one(organizations, {
        fields: [users.id],
        references: [organizations.creatorId],
    }),
    memberships: many(memberships),
    videos: many(videos),
}));

export const organizationRelations = relations(
    organizations,
    ({ one, many }) => ({
        creator: one(users, {
            fields: [organizations.creatorId],
            references: [users.id],
        }),
        memberships: many(memberships),
        videos: many(videos),
        template: one(templates, {
            fields: [organizations.id],
            references: [templates.orgId],
        }),
    })
);

export const membershipRelations = relations(memberships, ({ one }) => ({
    user: one(users, {
        fields: [memberships.userId],
        references: [users.id],
    }),
    organization: one(organizations, {
        fields: [memberships.orgId],
        references: [organizations.id],
    }),
}));

export const videoRelations = relations(videos, ({ one }) => ({
    editor: one(users, {
        fields: [videos.editorId],
        references: [users.id],
    }),
    organization: one(organizations, {
        fields: [videos.orgId],
        references: [organizations.id],
    }),
}));

export const templateRelations = relations(templates, ({ one }) => ({
    organization: one(organizations, {
        fields: [templates.orgId],
        references: [organizations.id],
    }),
}));

// TYPES

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Organization = InferSelectModel<typeof organizations>;
export type NewOrganization = InferInsertModel<typeof organizations>;

export type Membership = InferSelectModel<typeof memberships>;
export type NewMembership = InferInsertModel<typeof memberships>;

export type Video = InferSelectModel<typeof videos>;
export type NewVideo = InferInsertModel<typeof videos>;

export type Template = InferSelectModel<typeof templates>;
export type NewTemplate = InferInsertModel<typeof templates>;

// ZOD SCHEMA

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertOrganizationSchema = createInsertSchema(organizations);
export const selectOrganizationSchema = createSelectSchema(organizations);

export const insertMembershipSchema = createInsertSchema(memberships);
export const selectMembershipSchema = createSelectSchema(memberships);

export const insertVideoSchema = createInsertSchema(videos);
export const selectVideoSchema = createSelectSchema(videos);

export const insertTemplateSchema = createInsertSchema(templates);
export const selectTemplateSchema = createSelectSchema(templates);
