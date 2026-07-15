"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SquarePen } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"

import { authClient } from "@/utils/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GetAuthSession } from "@/lib/queries/GetSessionQuery";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function ProfileAvatar({ image, alt, fallback, size }: { image: string, alt: string, fallback: string, size: string }) {
    return (
        <Avatar className={size}>
            <AvatarImage
                src={image}
                alt={alt}
                className="grayscale"
            />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    )
}

export default function Profile() {
    const { isPending, data, error } = GetAuthSession();

    if (error) toast.error(error.message);

    const [newName, setNewName] = useState<string>(data?.user?.name || "");
    const [newImage, setNewImage] = useState(data?.user.image);
    const [nameChangePending, startNameChangeTransition] = useTransition();
    const [imageChangePending, startImageChangeTransition] = useTransition();

    const updateUserName = async () => {
        startNameChangeTransition(async () => {
            await authClient.updateUser({
                name: newName,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Updating...");
                    },
                    onSuccess: (ctx) => {
                        // Success message
                        toast.dismiss();
                        toast.success("Success!" + ctx.data);
                    },
                    onError: (ctx) => {
                        // display the error message
                        toast.dismiss();
                        toast.error(ctx.error.message);
                    },
                }
            });
        })
    }

    const updateUserImage = async () => {
        startImageChangeTransition(async () => {
            await authClient.updateUser({
                image: newImage,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Updating...");
                    },
                    onSuccess: (ctx) => {
                        // Success message
                        toast.dismiss();
                        toast.success("Success!" + ctx.data);
                    },
                    onError: (ctx) => {
                        // display the error message
                        toast.dismiss();
                        toast.error(ctx.error.message);
                    },
                }
            });
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="w-full flex justify-start py-7">
                    {isPending ? (
                        <>
                            <Loader2Icon className="size-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <motion.div className="flex items-center justify-between gap-2 w-full">
                            <div className="flex items-center justify-center gap-2">
                                <ProfileAvatar size="size-8" image={data?.user.image as string} alt={data?.user.name || "Profile picture"} fallback={`${data?.user.name.split(" ")[0][0]}${data?.user.name.split(" ")[1][0]}`} />
                                <div className="flex flex-col items-start justify-start">
                                    <div className="font-semibold">{data ? data.user.name : "Name"}</div>
                                    <div className="font-normal text-muted-foreground">{data ? data.user.email : "Email"}</div>
                                </div>
                            </div>
                            <div>
                                <SquarePen />
                            </div>
                        </motion.div>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="font-geist">
                <DialogHeader>
                    <DialogTitle className="font-bold">Edit Profile</DialogTitle>
                    <DialogDescription>
                        Edit your profile image and name.
                    </DialogDescription>
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <Separator />
                        <DialogTitle className="self-start">Change your profile picture.</DialogTitle>
                        <motion.div className="flex flex-col items-center justify-center gap-2">
                            <ProfileAvatar size="size-32" image={data?.user.image as string} alt={data?.user.name || "Profile picture"} fallback={`${data?.user.name.split(" ")[0][0]}${data?.user.name.split(" ")[1][0]}`} />
                            <motion.div className="flex items-center justify-center gap-2">
                                <Button>Edit Image</Button>
                                <Button variant="destructive">Remove Image</Button>
                            </motion.div>
                        </motion.div>
                        <Separator />
                        <DialogTitle className="self-start">Change your name.</DialogTitle>
                        <Label htmlFor="name" className="self-start text-muted-foreground">Full Name</Label>
                        <Input type="text" id="name" placeholder="e.g. John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </div>
                    <DialogFooter className="mt-2">
                        <DialogClose className="text-md mr-1">Cancel</DialogClose>
                        <Button disabled={!newName || !newImage || nameChangePending || imageChangePending} onClick={() => {
                            // CHECKS
                            if (newName === data?.user.name) {
                                toast.error("Error: New name is the same as current name.");
                                return;
                            }

                            if (newName && newImage) {
                                updateUserName();
                                updateUserImage();
                                return;
                            }

                            if (newName) updateUserName();
                            if (newImage) updateUserImage();
                        }}>{nameChangePending || imageChangePending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <span>Update</span>
                            </>
                        )}</Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}