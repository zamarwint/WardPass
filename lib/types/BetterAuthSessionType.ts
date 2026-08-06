// Mirror your BetterAuth session shape
export type BetterAuthSessionType = {
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
        impersonatedBy?: string | null | undefined;
    };
    user: {
        id: string,
        name: string,
        email: string,
        emailVerified: boolean,
        image: string | null | undefined,
        createdAt: Date,
        updatedAt: Date,
        role: string,
        banned: boolean | null,
        banReason: string | null,
        banExpires: Date | null,
    }
};

export type sessionData = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
    impersonatedBy?: string | null | undefined;
}

export type userData = {
    id: string,
    name: string,
    email: string,
    emailVerified: boolean,
    image: string | null | undefined,
    createdAt: Date,
    updatedAt: Date,
    role: string,
    banned: boolean | null,
    banReason: string | null,
    banExpires: Date | null,
}