"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ProfilePictureUpload } from "./ProfilePicUpload";
import { UserRoundPen } from "lucide-react";

function getInitials(name?: string | null): string {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function ProfileAvatar({
    image,
    alt,
    fallback,
    size,
}: {
    image: string;
    alt: string;
    fallback: string;
    size: string;
}) {
    return (
        <Avatar className={size}>
            <AvatarImage src={image} alt={alt} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {fallback}
            </AvatarFallback>
        </Avatar>
    );
}

export function ProfilePicture({ data }: { data: any }) {
    const userName = data?.user?.name as string | undefined;
    const userImage = (data?.user?.image as string) || "";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
                <ProfileAvatar
                    size="size-12 border border-border/60 ring-2 ring-background shadow-2xs"
                    image={userImage}
                    alt={userName || "Profile picture"}
                    fallback={getInitials(userName)}
                />
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">Profile Picture</span>
                    <span className="text-xs text-muted-foreground">
                        Personalize your avatar (JPG or PNG, max 4 MB).
                    </span>
                </div>
            </div>

            <Dialog>
                <DialogTrigger
                    className={buttonVariants({
                        variant: "outline",
                        className: "h-10 px-4 rounded-xl font-semibold gap-2 cursor-pointer w-full sm:w-auto",
                    })}
                >
                    <UserRoundPen className="size-4" />
                    <span>Edit Picture</span>
                </DialogTrigger>
                <DialogContent className="rounded-2xl max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Profile Picture</DialogTitle>
                        <DialogDescription>
                            Upload or remove a picture. Image must not exceed 4 MB.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="size-full">
                        <ProfilePictureUpload
                            imageUrl={data?.user?.image}
                            userName={userName}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose className={buttonVariants({ variant: "outline", className: "rounded-xl" })}>
                            Close
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
