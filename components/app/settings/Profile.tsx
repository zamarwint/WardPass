"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLegend } from "@/components/ui/field";
import { ProfilePictureUpload } from "./ProfilePicUpload";
import { UserRoundPen } from "lucide-react";

export function ProfileAvatar({ image, alt, fallback, size }: { image: string, alt: string, fallback: string, size: string }) {
    return (
        <Avatar className={size}>
            <AvatarImage
                src={image}
                alt={alt}
            />
            <AvatarFallback className="grayscale">{fallback}</AvatarFallback>
        </Avatar>
    )
}

export function ProfilePicture({ data }: { data: any }) {
    return (
        <Field className="size-full flex flex-row items-center justify-between">
            <FieldLegend>Profile Picture</FieldLegend>
            <FieldContent>
                <div className="size-full flex items-center justify-center gap-3">
                    {/* BUTTONS */}
                    <Dialog>
                        <DialogTrigger className={buttonVariants({ variant: "default", size: "lg" })}>
                            <UserRoundPen />
                            <span>Edit Profile Picture</span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile Picture</DialogTitle>
                                <DialogDescription>Upload or remove a picture. Image must not exceed 500x500 pixels.</DialogDescription>
                            </DialogHeader>

                            {/* REACT DROPZONE */}
                            <div className="size-full">
                                <ProfilePictureUpload
                                    imageUrl={data?.user.image}
                                    userName={data?.user.name}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose>Close Dialog</DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <ProfileAvatar size="size-12" image={data?.user.image as string} alt={data?.user.name || "Profile picture"} fallback={`${data?.user.name.split(" ")[0][0]}${data?.user.name.split(" ")[1][0]}`} />
                </div>
            </FieldContent>
        </Field>
    )
}