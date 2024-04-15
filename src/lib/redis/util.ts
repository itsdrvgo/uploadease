// USERS

export function generateCachedUserKey(id: string) {
    return "user:" + id;
}

export function generateCachedUsernamesKey() {
    return "usernames";
}

// ORGANIZATIONS

export function generateCachedOrganizationKey(id: string) {
    return "organization:" + id;
}

export function generateCachedOrgMembersKey(id: string) {
    return "organization:" + id + ":members";
}

// MEMBERSHIPS

export function generateCachedMembershipKey(orgId: string, userId: string) {
    return "organization:" + orgId + ":membership:" + userId;
}

// VIDEOS

export function generateCachedVideoKey(id: string) {
    return "video:" + id;
}

// TEMPLATES

export function generateCachedTemplateOrgKey(orgId: string) {
    return "organization:" + orgId + ":template";
}
